// File: app/api/explorer/[tableName]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
// Library 'pg-format' sudah tidak di-import lagi

export async function GET(request, { params }) {
    const { tableName } = params;
    const { searchParams } = new URL(request.url);
    const requestType = searchParams.get('requestType');

    if (!tableName || !requestType) {
        return NextResponse.json({ message: 'Parameter tidak lengkap' }, { status: 400 });
    }

    let client;
    try {
        client = await pool.connect();

        if (requestType === 'metadata') {
            const query = `
                SELECT
                    column_name, ordinal_position,
                    CASE
                        WHEN data_type = 'character varying' THEN 'varchar(' || character_maximum_length || ')'
                        WHEN data_type = 'numeric' THEN 'numeric(' || numeric_precision || ', ' || numeric_scale || ')'
                        ELSE data_type
                    END AS data_type
                FROM information_schema.columns
                WHERE table_name = $1
                ORDER BY ordinal_position;
            `;
            const result = await client.query(query, [tableName]);
            return NextResponse.json(result.rows, { status: 200 });

        } else if (requestType === 'data') {
            // 1. Cari tahu schema dari tabel yang diminta
            const schemaQuery = `
                SELECT schemaname FROM pg_tables 
                WHERE tablename = $1 
                AND (schemaname = 'v2_datalake' OR schemaname = 'v_datamart') 
                LIMIT 1;
            `;
            const schemaResult = await client.query(schemaQuery, [tableName]);

            if (schemaResult.rowCount === 0) {
                return NextResponse.json({ message: `Tabel '${tableName}' tidak ditemukan.` }, { status: 404 });
            }
            const schemaName = schemaResult.rows[0].schemaname;

            // 2. Buat query aman menggunakan fitur bawaan client.escapeIdentifier
            const safeSchema = client.escapeIdentifier(schemaName);
            const safeTable = client.escapeIdentifier(tableName);
            
            // Query diubah untuk menggunakan LIMIT 500
            const dataQuery = `SELECT * FROM ${safeSchema}.${safeTable} LIMIT 500`;
            
            const result = await client.query(dataQuery);
            return NextResponse.json(result.rows, { status: 200 });
        } else {
             return NextResponse.json({ message: 'Jenis request tidak valid' }, { status: 400 });
        }

    } catch (error) {
        console.error(`Error pada API Explorer untuk tabel ${tableName}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}