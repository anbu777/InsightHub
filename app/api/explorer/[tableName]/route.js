import { NextResponse } from 'next/server';
import { dwhPool as pool } from '@/lib/db';

export async function GET(request, { params }) {
    const { tableName } = params;
    const { searchParams } = new URL(request.url);
    const requestType = searchParams.get('requestType');

    // [REVISI] Baca parameter 'limit' dari URL
    const limitParam = searchParams.get('limit');

    if (!tableName || !requestType) {
        return NextResponse.json({ message: 'Parameter tidak lengkap' }, { status: 400 });
    }


    let client;
    try {
        client = await pool.connect();

        const schemaResult = await client.query(
            "SELECT schemaname FROM pg_tables WHERE tablename = $1 AND tablename LIKE 'sigi%'", 
            [tableName]
        );

        if (schemaResult.rowCount === 0) {
            return NextResponse.json({ message: 'Tabel tidak diizinkan.' }, { status: 403 });
        }
        const schemaName = schemaResult.rows[0].schemaname;

        if (requestType === 'metadata') {
            const query = `
                SELECT
                    column_name,
                    CASE
                        WHEN data_type = 'character varying' THEN 'varchar(' || character_maximum_length || ')'
                        WHEN data_type = 'numeric' THEN 'numeric(' || numeric_precision || ', ' || numeric_scale || ')'
                        ELSE data_type
                    END AS formatted_data_type
                FROM information_schema.columns
                WHERE table_name = $1 AND table_schema = $2
                ORDER BY ordinal_position;
            `;
            const result = await client.query(query, [tableName, schemaName]);
            return NextResponse.json(result.rows, { status: 200 });

        } 
        
        else if (requestType === 'data') {
            // Menggunakan fitur bawaan untuk keamanan dan menambahkan LIMIT 30
            const safeSchema = client.escapeIdentifier(schemaName);
            const safeTable = client.escapeIdentifier(tableName);
            const dataQuery = `SELECT * FROM ${safeSchema}.${safeTable} LIMIT 30`;


        } else if (requestType === 'data') {
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

            const safeSchema = client.escapeIdentifier(schemaName);
            const safeTable = client.escapeIdentifier(tableName);
            
            // [REVISI] Tentukan limit secara dinamis
            // Jika ada limitParam, gunakan itu. Jika tidak, default ke 500.
            const limit = parseInt(limitParam, 10) || 500;
            
            const dataQuery = `SELECT * FROM ${safeSchema}.${safeTable} LIMIT ${limit}`;

            
            const result = await client.query(dataQuery);
            return NextResponse.json(result.rows, { status: 200 });
        } 
        
        else {
            return NextResponse.json({ message: 'Jenis request tidak valid.' }, { status: 400 });
        }
    } catch (error) {
        console.error(`Error pada API Explorer untuk ${tableName}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}