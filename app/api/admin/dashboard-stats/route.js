// File: app/api/admin/dashboard-stats/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Baris ini adalah yang paling penting, yang hilang dari file Anda
export async function GET() {
    let client;
    try {
        client = await pool.connect();

        const columnCountQuery = `
            SELECT COUNT(*) as column_count FROM information_schema.columns WHERE table_name LIKE 'sigi%';
        `;
        
        const schemaCountsQuery = `
            SELECT schemaname, COUNT(*) as count
            FROM pg_tables
            WHERE tablename LIKE 'sigi%'
            GROUP BY schemaname;
        `;

        const [columnCountResult, schemaCountsResult] = await Promise.all([
            client.query(columnCountQuery),
            client.query(schemaCountsQuery)
        ]);
        
        const responseData = {
            stats: {
                api_count: 78,
                column_count: columnCountResult.rows[0].column_count,
                schema_count: 1,
            },
            schemaCounts: schemaCountsResult.rows,
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('!!! KESALAHAN PADA API dashboard-stats:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        if (client) client.release();
    }
}