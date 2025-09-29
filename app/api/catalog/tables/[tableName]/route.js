// File: app/api/catalog/tables/[tableName]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) { // Perhatikan: ada 'params' di sini
  const { tableName } = params;
  let client;

  try {
    client = await pool.connect();
    const query = `
      SELECT
        column_name,
        CASE
          WHEN data_type = 'character varying' THEN 'varchar(' || character_maximum_length || ')'
          WHEN data_type = 'character' THEN 'char(' || character_maximum_length || ')'
          WHEN data_type = 'numeric' THEN 'numeric(' || numeric_precision || ', ' || numeric_scale || ')'
          WHEN data_type = 'integer' THEN 'integer'
          WHEN data_type = 'bigint' THEN 'bigint'
          WHEN data_type = 'timestamp without time zone' THEN 'timestamp'
          WHEN data_type = 'timestamp with time zone' THEN 'timestamptz'
          ELSE data_type
        END AS formatted_data_type
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `;
    const result = await client.query(query, [tableName]);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error(`!!! KESALAHAN PADA API DETAIL UNTUK ${tableName}:`, error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  } finally {
    if (client) client.release();
  }
}