import { NextResponse } from 'next/server';
// PERBAIKAN DI SINI: Impor 'dwhPool' secara spesifik dan ganti namanya menjadi 'pool'
import { dwhPool as pool } from '@/lib/db';

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT tablename, schemaname FROM pg_tables
      WHERE (schemaname = 'v2_datalake' OR schemaname = 'v2_datamart')
      AND tablename LIKE 'sigi%';
    `;
    const result = await client.query(query);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('!!! KESALAHAN PADA API KATALOG:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    if (client) client.release();
  }
}