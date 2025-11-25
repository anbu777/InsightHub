


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."request_status_type" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE "public"."request_status_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."exec"("sql_query" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;


ALTER FUNCTION "public"."exec"("sql_query" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_total_clicks"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN (SELECT SUM(click_count)::integer FROM public.datasets);
END;
$$;


ALTER FUNCTION "public"."get_total_clicks"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, job_title)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'job_title');
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_click_count"("row_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  update datasets
  set click_count = coalesce(click_count, 0) + 1 -- Gunakan coalesce jika click_count bisa NULL
  where id = row_id;
end;
$$;


ALTER FUNCTION "public"."increment_click_count"("row_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT is_admin
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Aset Tanah PU" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" bigint,
    "koord_y" bigint,
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "nama_satker" "text",
    "nama_barang" "text",
    "nup" bigint,
    "tanggal_perolehan" "text",
    "alamat" "text",
    "kode_kab_kota" bigint,
    "jenis_sertifikat" "text",
    "jenis_dokumen" "text",
    "status_penggunaan" "text",
    "tgl_tarik" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Aset Tanah PU" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."BPB" (
    "fid" bigint,
    "thn_data" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "metadata" "text",
    "wadmpr" "text",
    "wadmkk" "text",
    "kategori" "text",
    "jns_infr" "text",
    "wadmkd" "text",
    "wadmkc" "text",
    "v_infr" "text",
    "thn_bangun" bigint,
    "objectid" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."BPB" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Bendung" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude" "text",
    "lintas_kewenangan" "text",
    "longitude" "text",
    "manfaat_irigasi" bigint,
    "manfaat_lain_lain" "text",
    "media_cover_aset" "text",
    "media_fasilitas_lainnya" "text",
    "media_foto" "text",
    "media_gardu_rumah_petugas" "text",
    "media_intake" "text",
    "media_penguras" "text",
    "media_plang_nama" "text",
    "media_prasasti_peresmian" "text",
    "media_skema_sungai" "jsonb",
    "media_tabel_debit_andalan" "jsonb",
    "media_tubuh_bendung" "text",
    "media_video" "jsonb",
    "media_video_singkat_aset" "text",
    "nama_infrastruktur" "text",
    "op_oleh" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_infrastruktur" "text",
    "status_pemeliharaan" "text",
    "tagging_proyek" "text",
    "tahun_pembangunan" bigint,
    "teknis_debit_intake_musim_hujan_m3_detik" bigint,
    "teknis_debit_intake_musim_kemarau_m3_detik" bigint,
    "teknis_jenis" "text",
    "teknis_keterangan" "text",
    "teknis_kondisi_infrastruktur" "text",
    "teknis_lebar_m" bigint,
    "teknis_sungai" "text",
    "teknis_tahun_rehab_terakhir" "text",
    "teknis_tinggi_m" bigint,
    "tipe_infrastruktur" "text",
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Bendung" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Bendungan Konstruksi" (
    "daerah_aliran_sungai" "text",
    "hidrologi_curah_hujan_pmp_mm" "text",
    "hidrologi_debit_q1000_m3_detik" bigint,
    "hidrologi_debit_qpmf_m3_detik" "text",
    "hidrologi_luas_tangkapan_air_km2" bigint,
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "keterangan_lokasi" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" "text",
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" "text",
    "kondisi_bangunan" "text",
    "konstruksi_biaya" "text",
    "konstruksi_konsultan_desain" "text",
    "konstruksi_kontraktor" "text",
    "konstruksi_supervisi" "text",
    "konstruksi_tahun_rencana_impounding" "text",
    "konstruksi_tanggal_desain" "text",
    "konstruksi_tanggal_konstruksi" "text",
    "konstruksi_tanggal_masa_pelaksanaan_mulai" "text",
    "konstruksi_tanggal_masa_pelaksanaan_selesai" "text",
    "kota_kabupaten" "text",
    "latitude" "text",
    "lintas_kewenangan" "text",
    "longitude" "text",
    "manfaat_irigasi_ha" bigint,
    "manfaat_pariwisata" "text",
    "manfaat_pengurangan_debit_banjir_q100_m3_detik" "text",
    "manfaat_pengurangan_luas_genangan_banjir_hilir_q1000_ha" "text",
    "manfaat_plta_mw" "text",
    "manfaat_plts_mw" "text",
    "manfaat_sumber_penyediaan_air_baku_m3_detik" bigint,
    "media_cover_aset" "text",
    "media_fasilitas_umum" "jsonb",
    "media_foto" "text",
    "media_gardu_pandang" "text",
    "media_grafik_elevasi_volume_luas" "text",
    "media_instrumentasi" "text",
    "media_kantor_upb" "text",
    "media_pengelak" "jsonb",
    "media_plang_nama" "text",
    "media_prasasti_peresmian" "text",
    "media_skema_sungai" "text",
    "media_spillway" "text",
    "media_tubuh_bendungan" "text",
    "media_video" "text",
    "media_video_singkat_aset" "text",
    "nama_infrastruktur" "text",
    "no_perpres" "text",
    "nomor_registrasi" "text",
    "op_oleh" "text",
    "pelimpah_dengan_pintu" "text",
    "pelimpah_elevasi_mercu_ambang_mdpl" "text",
    "pelimpah_keterangan_type" "text",
    "pelimpah_lebar_m" "text",
    "pelimpah_panjang_m" bigint,
    "pelimpah_panjang_saluran_transisi_m" bigint,
    "pelimpah_type_pelimpah" "text",
    "pengambilan_elevasi_inlet_mdpl" "text",
    "pengambilan_keterangan_type" "text",
    "pengambilan_lebar_pintu_m" "text",
    "pengambilan_tinggi_pintu_m" "text",
    "pengambilan_type_pengambilan" "text",
    "pengelak_debit_rencana_q25_m3_detik" "text",
    "pengelak_elevasi_inlet_konduit_mdpl" "text",
    "pengelak_keterangan_type" "text",
    "pengelak_luas_penampang_m2" "text",
    "pengelak_type_pengelak" "text",
    "pengelola" "text",
    "peredam_keterangan_type" "text",
    "peredam_lebar_kolam_m" "text",
    "peredam_panjang_kolam_m" "text",
    "peredam_type_kolam" "text",
    "peresmian_sejarah_singkat" "text",
    "peresmian_tanggal_impounding" "text",
    "peresmian_tanggal_peresmian" "text",
    "provinsi" "text",
    "sedimen_elevasi_dead_storage_mdpl" "text",
    "sedimen_volume_tampung_m3" "text",
    "selesai_pembangunan" "text",
    "status_infrastruktur" "text",
    "status_pemeliharaan" "text",
    "tagging_proyek" "text",
    "tahun_pembangunan" "text",
    "teknis_elevasi_dasar_galian_mdpl" bigint,
    "teknis_elevasi_dasar_sungai_mdpl" bigint,
    "teknis_elevasi_puncak_mdpl" "text",
    "teknis_keterangan_type" "text",
    "teknis_lebar_dasar_pondasi_m" "text",
    "teknis_lebar_puncak_bendungan_m" bigint,
    "teknis_luas_genangan_minimal_m2" "text",
    "teknis_luas_genangan_normal_m2" "text",
    "teknis_luas_genangan_total_m2" bigint,
    "teknis_panjang_puncak_m" "text",
    "teknis_type" "text",
    "teknis_volume_tampung_efektif_m3" "text",
    "teknis_volume_tampung_minimal_m3" "text",
    "teknis_volume_tampung_normal_m3" "text",
    "teknis_volume_tampung_total_m3" "text",
    "updated_at" "text",
    "urut" "text",
    "wilayah_sungai" "text",
    "objectid" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Bendungan Konstruksi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Bendungan Operasi" (
    "daerah_aliran_sungai" "text",
    "hidrologi_curah_hujan_pmp_mm" "text",
    "hidrologi_debit_q1000_m3_detik" bigint,
    "hidrologi_debit_qpmf_m3_detik" "text",
    "hidrologi_luas_tangkapan_air_km2" bigint,
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "keterangan_lokasi" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" "text",
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" "text",
    "kondisi_bangunan" "text",
    "konstruksi_biaya" "text",
    "konstruksi_konsultan_desain" "text",
    "konstruksi_kontraktor" "text",
    "konstruksi_supervisi" "text",
    "konstruksi_tahun_rencana_impounding" "text",
    "konstruksi_tanggal_desain" "text",
    "konstruksi_tanggal_konstruksi" "text",
    "konstruksi_tanggal_masa_pelaksanaan_mulai" "text",
    "konstruksi_tanggal_masa_pelaksanaan_selesai" "text",
    "kota_kabupaten" "text",
    "latitude" "text",
    "lintas_kewenangan" "text",
    "longitude" "text",
    "manfaat_irigasi_ha" bigint,
    "manfaat_pariwisata" "text",
    "manfaat_pengurangan_debit_banjir_q100_m3_detik" "text",
    "manfaat_pengurangan_luas_genangan_banjir_hilir_q1000_ha" "text",
    "manfaat_plta_mw" "text",
    "manfaat_plts_mw" "text",
    "manfaat_sumber_penyediaan_air_baku_m3_detik" bigint,
    "media_cover_aset" "text",
    "media_fasilitas_umum" "jsonb",
    "media_foto" "text",
    "media_gardu_pandang" "text",
    "media_grafik_elevasi_volume_luas" "text",
    "media_instrumentasi" "text",
    "media_kantor_upb" "text",
    "media_pengelak" "jsonb",
    "media_plang_nama" "text",
    "media_prasasti_peresmian" "text",
    "media_skema_sungai" "text",
    "media_spillway" "text",
    "media_tubuh_bendungan" "text",
    "media_video" "text",
    "media_video_singkat_aset" "text",
    "nama_infrastruktur" "text",
    "no_perpres" "text",
    "nomor_registrasi" "text",
    "op_oleh" "text",
    "pelimpah_dengan_pintu" "text",
    "pelimpah_elevasi_mercu_ambang_mdpl" "text",
    "pelimpah_keterangan_type" "text",
    "pelimpah_lebar_m" "text",
    "pelimpah_panjang_m" bigint,
    "pelimpah_panjang_saluran_transisi_m" bigint,
    "pelimpah_type_pelimpah" "text",
    "pengambilan_elevasi_inlet_mdpl" "text",
    "pengambilan_keterangan_type" "text",
    "pengambilan_lebar_pintu_m" "text",
    "pengambilan_tinggi_pintu_m" "text",
    "pengambilan_type_pengambilan" "text",
    "pengelak_debit_rencana_q25_m3_detik" "text",
    "pengelak_elevasi_inlet_konduit_mdpl" "text",
    "pengelak_keterangan_type" "text",
    "pengelak_luas_penampang_m2" "text",
    "pengelak_type_pengelak" "text",
    "pengelola" "text",
    "peredam_keterangan_type" "text",
    "peredam_lebar_kolam_m" "text",
    "peredam_panjang_kolam_m" "text",
    "peredam_type_kolam" "text",
    "peresmian_sejarah_singkat" "text",
    "peresmian_tanggal_impounding" "text",
    "peresmian_tanggal_peresmian" "text",
    "provinsi" "text",
    "sedimen_elevasi_dead_storage_mdpl" "text",
    "sedimen_volume_tampung_m3" "text",
    "selesai_pembangunan" "text",
    "status_infrastruktur" "text",
    "status_pemeliharaan" "text",
    "tagging_proyek" "text",
    "tahun_pembangunan" "text",
    "teknis_elevasi_dasar_galian_mdpl" bigint,
    "teknis_elevasi_dasar_sungai_mdpl" bigint,
    "teknis_elevasi_puncak_mdpl" "text",
    "teknis_keterangan_type" "text",
    "teknis_lebar_dasar_pondasi_m" "text",
    "teknis_lebar_puncak_bendungan_m" bigint,
    "teknis_luas_genangan_minimal_m2" "text",
    "teknis_luas_genangan_normal_m2" "text",
    "teknis_luas_genangan_total_m2" bigint,
    "teknis_panjang_puncak_m" "text",
    "teknis_type" "text",
    "teknis_volume_tampung_efektif_m3" "text",
    "teknis_volume_tampung_minimal_m3" "text",
    "teknis_volume_tampung_normal_m3" "text",
    "teknis_volume_tampung_total_m3" "text",
    "updated_at" "text",
    "urut" "text",
    "wilayah_sungai" "text",
    "objectid" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Bendungan Operasi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Bendungan Rencana" (
    "daerah_aliran_sungai" "text",
    "hidrologi_curah_hujan_pmp_mm" "text",
    "hidrologi_debit_q1000_m3_detik" "text",
    "hidrologi_debit_qpmf_m3_detik" "text",
    "hidrologi_luas_tangkapan_air_km2" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "keterangan_lokasi" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "konstruksi_biaya" "text",
    "konstruksi_konsultan_desain" "text",
    "konstruksi_kontraktor" "text",
    "konstruksi_supervisi" "text",
    "konstruksi_tahun_rencana_impounding" "text",
    "konstruksi_tanggal_desain" "text",
    "konstruksi_tanggal_konstruksi" "text",
    "konstruksi_tanggal_masa_pelaksanaan_mulai" "text",
    "konstruksi_tanggal_masa_pelaksanaan_selesai" "text",
    "kota_kabupaten" "text",
    "latitude" bigint,
    "lintas_kewenangan" "text",
    "longitude" bigint,
    "manfaat_irigasi_ha" bigint,
    "manfaat_pariwisata" "text",
    "manfaat_pengurangan_debit_banjir_q100_m3_detik" bigint,
    "manfaat_pengurangan_luas_genangan_banjir_hilir_q1000_ha" "text",
    "manfaat_plta_mw" "text",
    "manfaat_plts_mw" "text",
    "manfaat_sumber_penyediaan_air_baku_m3_detik" "text",
    "media_cover_aset" "text",
    "media_fasilitas_umum" "jsonb",
    "media_foto" "jsonb",
    "media_gardu_pandang" "jsonb",
    "media_grafik_elevasi_volume_luas" "jsonb",
    "media_instrumentasi" "jsonb",
    "media_kantor_upb" "jsonb",
    "media_pengelak" "jsonb",
    "media_plang_nama" "text",
    "media_prasasti_peresmian" "text",
    "media_skema_sungai" "jsonb",
    "media_spillway" "jsonb",
    "media_tubuh_bendungan" "jsonb",
    "media_video" "jsonb",
    "media_video_singkat_aset" "text",
    "nama_infrastruktur" "text",
    "no_perpres" "text",
    "nomor_registrasi" "text",
    "op_oleh" "text",
    "pelimpah_dengan_pintu" "text",
    "pelimpah_elevasi_mercu_ambang_mdpl" bigint,
    "pelimpah_keterangan_type" "text",
    "pelimpah_lebar_m" bigint,
    "pelimpah_panjang_m" bigint,
    "pelimpah_panjang_saluran_transisi_m" bigint,
    "pelimpah_type_pelimpah" "text",
    "pengambilan_elevasi_inlet_mdpl" "text",
    "pengambilan_keterangan_type" "text",
    "pengambilan_lebar_pintu_m" "text",
    "pengambilan_tinggi_pintu_m" "text",
    "pengambilan_type_pengambilan" "text",
    "pengelak_debit_rencana_q25_m3_detik" bigint,
    "pengelak_elevasi_inlet_konduit_mdpl" "text",
    "pengelak_keterangan_type" "text",
    "pengelak_luas_penampang_m2" bigint,
    "pengelak_type_pengelak" "text",
    "pengelola" "text",
    "peredam_keterangan_type" "text",
    "peredam_lebar_kolam_m" "text",
    "peredam_panjang_kolam_m" "text",
    "peredam_type_kolam" "text",
    "peresmian_sejarah_singkat" "text",
    "peresmian_tanggal_impounding" "text",
    "peresmian_tanggal_peresmian" "text",
    "provinsi" "text",
    "rencana_konstruksi" "text",
    "sedimen_elevasi_dead_storage_mdpl" "text",
    "sedimen_volume_tampung_m3" "text",
    "selesai_pembangunan" bigint,
    "status_infrastruktur" "text",
    "status_pemeliharaan" "text",
    "tagging_proyek" "text",
    "tahun_pembangunan" bigint,
    "teknis_elevasi_dasar_galian_mdpl" bigint,
    "teknis_elevasi_dasar_sungai_mdpl" bigint,
    "teknis_elevasi_puncak_mdpl" bigint,
    "teknis_keterangan_type" "text",
    "teknis_lebar_dasar_pondasi_m" "text",
    "teknis_lebar_puncak_bendungan_m" bigint,
    "teknis_luas_genangan_minimal_m2" "text",
    "teknis_luas_genangan_normal_m2" "text",
    "teknis_luas_genangan_total_m2" "text",
    "teknis_panjang_puncak_m" bigint,
    "teknis_type" "text",
    "teknis_volume_tampung_efektif_m3" "text",
    "teknis_volume_tampung_minimal_m3" "text",
    "teknis_volume_tampung_normal_m3" "text",
    "teknis_volume_tampung_total_m3" bigint,
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Bendungan Rencana" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Daerah Irigasi Permukaan" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" bigint,
    "koord_y" bigint,
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "no_urut" "text",
    "nm_inf" "text",
    "kewenangan" "text",
    "luas_ha" bigint,
    "irigasi" "text",
    "thn_keg" "text",
    "keterangan" "text",
    "jenis_di" "text",
    "bgn_utm" "text",
    "thn_data" "text",
    "kondisi" "text",
    "nm_ws" "text",
    "nm_das" "text",
    "kd_ws" "text",
    "provinsi" "text",
    "kab_kota" "text",
    "kecamatan" "text",
    "kel_desa" "text",
    "mn_bgn_utm" "text",
    "nm_ba_ut" "text",
    "smbr_air" "text",
    "l_renc" "text",
    "luas_fung" "text",
    "ip_rencana" "text",
    "pola_tnm" "text",
    "p_sal_ind" "text",
    "ko_sal_ind" "text",
    "p_sal_sek" "text",
    "ko_sal_sek" "text",
    "pjn_sal_te" "text",
    "ko_sal_ter" "text",
    "p_sal_pem" "text",
    "ko_sal_pem" "text",
    "p_sal_sup" "text",
    "ko_sal_sup" "text",
    "jml_kl_ps" "text",
    "kon_kl_ps" "text",
    "jml_bg_bag" "text",
    "kon_bg_bag" "text",
    "jml_bg_b_s" "text",
    "kon_bg_b_s" "text",
    "jml_bg_sad" "text",
    "kon_bg_sad" "text",
    "jml_bg_pen" "text",
    "kon_bg_pen" "text",
    "jml_sip" "text",
    "kon_sip" "text",
    "jml_tlg" "text",
    "kon_tlg" "text",
    "jml_jmb" "text",
    "kon_jmb" "text",
    "jml_plk" "text",
    "kon_plk" "text",
    "jml_p3a" "text",
    "jml_gp3a" "text",
    "jml_ip3a" "text",
    "ket" "text",
    "kd_inf" "text",
    "video" "text",
    "remark" "text",
    "status" "text",
    "irigrasi" "text",
    "nm_bgn_utm" "text",
    "shape_leng" bigint,
    "sta_hibah" "text",
    "st_area(shape)" "text",
    "st_perimeter(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Daerah Irigasi Permukaan" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Danau" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "keterangan_lokasi" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_kecamatan" bigint,
    "kode_kelurahan" bigint,
    "kode_kota_kabupaten" bigint,
    "kode_pengelola" "text",
    "kode_provinsi" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kota_kabupaten" "text",
    "latitude" "text",
    "lintas_kewenangan" "text",
    "longitude" "text",
    "manfaat_irigasi_ha" "text",
    "manfaat_pariwisata" "text",
    "manfaat_penyediaan_air_baku_liter_detik" "text",
    "manfaat_perikanan" "text",
    "manfaat_plta_mw" "text",
    "manfaat_reduksi_m3_detik" bigint,
    "manfaat_ternak" "text",
    "media_as_build_drwaing" "jsonb",
    "media_cover_aset" "text",
    "media_foto" "text",
    "media_geojson" "text",
    "media_lain_lain" "jsonb",
    "media_video" "jsonb",
    "media_video_singkat_aset" "text",
    "nama_aset" "text",
    "op_oleh" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_pemeliharaan" "text",
    "teknis_daerah_tangkapan_air_km2" bigint,
    "teknis_jenis_sedimentasi" "text",
    "teknis_jenis_tampungan" "text",
    "teknis_kapasitas_layanan_m3_detik" bigint,
    "teknis_keterangan" "text",
    "teknis_kualitas_air" "text",
    "teknis_laju_sedimentasi_ton_tahun" bigint,
    "teknis_luas_genangan_ha" bigint,
    "teknis_luas_tampungan_ha" bigint,
    "teknis_rata_rata_kedalaman_m" bigint,
    "teknis_sedimentasi_mm_ha_tahun" bigint,
    "teknis_type_tampungan" "text",
    "teknis_volume_tampung_m3" "text",
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Danau" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Data Kepegawaian Kementrian PU" (
    "Pendidikan" "text",
    "Jumlah Pendidikan" bigint,
    "Unit Organisasi (Unor)" "text",
    "Jumlah Unor" bigint,
    "Golongan (Khusus PNS)" "text",
    "Jumlah Golongan" bigint,
    "Status Kepegawaian" "text",
    "Persentase" "text"
);


ALTER TABLE "public"."Data Kepegawaian Kementrian PU" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Efektivitas Drainase" (
    "objectid" bigint,
    "objectid_1" bigint,
    "unique_id" bigint,
    "segmentype" "text",
    "linkid" bigint,
    "link_name" "text",
    "direction" "text",
    "lane" bigint,
    "start_km" "text",
    "end_km" bigint,
    "seg_length" bigint,
    "isf" bigint,
    "isb" bigint,
    "kpi_drn" bigint,
    "shape_len" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Efektivitas Drainase" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Embung" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude" "text",
    "lintas_kewenangan" "text",
    "longitude" "text",
    "manfaat_irigasi_ha" "text",
    "manfaat_sumber_penyediaan_air_baku_m3_detik" "text",
    "manfaat_ternak" bigint,
    "media_bangunan_pelengkap" "jsonb",
    "media_cover_aset" "text",
    "media_detail_inlet_outlet" "jsonb",
    "media_detail_item_rehab_peningkatan" "jsonb",
    "media_detail_sebelum" "jsonb",
    "media_foto" "text",
    "media_penampang_melintang" "jsonb",
    "media_plang_nama" "text",
    "media_prasasti_peresmian" "text",
    "media_tampak_embung_elevasi_muka_air" "jsonb",
    "media_video" "jsonb",
    "media_video_singkat_aset" "text",
    "nama_infrastruktur" "text",
    "op_oleh" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_infrastruktur" "text",
    "status_pemeliharaan" "text",
    "tagging_proyek" "text",
    "tahun_pembangunan" bigint,
    "teknis_elevasi_muka_air_maksimal_mdpl" bigint,
    "teknis_elevasi_muka_air_minimal_mdpl" bigint,
    "teknis_elevasi_muka_air_normal_mdpl" bigint,
    "teknis_elevasi_muka_air_puncak_mdpl" bigint,
    "teknis_jenis" "text",
    "teknis_kapasitas_volume_m3" bigint,
    "teknis_keterangan" "text",
    "teknis_keterangan_type" "text",
    "teknis_kondisi_infrastruktur" "text",
    "teknis_lebar_tubuh_m" bigint,
    "teknis_panjang_tubuh_m" bigint,
    "teknis_tahun_rehab_terakhir" bigint,
    "teknis_tinggi_tubuh_pondasi_m" bigint,
    "teknis_tinggi_tubuh_sungai_m" bigint,
    "teknis_tma_m" bigint,
    "teknis_type" "text",
    "tipe_infrastruktur" "text",
    "updated_at" "text",
    "urut" bigint,
    "volume_infrastruktur_desain_m3" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Embung" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Gerbang Tol" (
    "fid" bigint,
    "id" "text",
    "objectid" bigint,
    "kode_ruas" "text",
    "ruas" "text",
    "kode_gt" "text",
    "nama" "text",
    "seksi" bigint,
    "sta" "text",
    "foto" "text",
    "layer" "text",
    "koord_x" "text",
    "koord_y" "text",
    "jml_gardu" "text",
    "jmlgrdrvs" "text",
    "jml_lajur" "text",
    "panjang_m" "text",
    "luas_m" "text",
    "status" "text",
    "sub_status" "text",
    "region" "text",
    "bujt" "text",
    "kodefikasi" "text",
    "no" bigint,
    "shape_leng" "text",
    "keterangan" "text",
    "orig_fid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Gerbang Tol" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."IPA Spam" (
    "objectid" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "koord_x" bigint,
    "koord_y" bigint,
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "namobj" "text",
    "thnpbn" bigint,
    "propinsi" "text",
    "kab_kota" "text",
    "kaprod" bigint,
    "sts_pngn" "text",
    "remarks" "text",
    "metadata" "text",
    "fcode" "text",
    "sync_state" "text",
    "srs_id" bigint,
    "Column1" "text"
);


ALTER TABLE "public"."IPA Spam" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."IPAL" (
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "stspng" "text",
    "metadata" "text",
    "kab_kota" "text",
    "thnmop" bigint,
    "jnsis" "text",
    "propinsi" "text",
    "ckplyn" bigint,
    "thnpbn" bigint,
    "objectid" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "srs_id" bigint,
    "esri_oid" bigint,
    "Column1" "text"
);


ALTER TABLE "public"."IPAL" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."IPLT" (
    "koord_x" "text",
    "koord_y" "text",
    "namobj" "text",
    "stspng" "text",
    "metadata" "text",
    "jnsspl" "text",
    "kab_kota" "text",
    "thnmop" bigint,
    "propinsi" "text",
    "ckplyn" bigint,
    "thnpbn" bigint,
    "objectid" bigint,
    "remarks" "text",
    "srs_id" bigint,
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."IPLT" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Intake Sungai" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelompok_data_dasar" "text",
    "kelurahan" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude" bigint,
    "longitude" bigint,
    "manfaat_debit" bigint,
    "manfaat_jiwa" bigint,
    "nama_intake" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_pekerjaan" "text",
    "tahun_pembangunan" bigint,
    "tahun_pengadaan" bigint,
    "teknis_debit_iddle_kapasitas" bigint,
    "teknis_debit_pengambilan" bigint,
    "teknis_debit_q90" bigint,
    "teknis_elevasi" "text",
    "teknis_head_pompa" bigint,
    "teknis_jenis_intake" "text",
    "teknis_jenis_pompa" "text",
    "teknis_kapasitas_tampung" bigint,
    "teknis_kelembagaan" "text",
    "teknis_luas" bigint,
    "teknis_nama_sistem" "text",
    "teknis_sistem_pengambilan" "text",
    "teknis_status_air_baku" "text",
    "teknis_sungai" "text",
    "teknis_tahun_rehab_terakhir" bigint,
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Intake Sungai" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jalan Daerah" (
    "se_anno_cad_data" "text",
    "objectid" bigint,
    "kl_dat_das" "text",
    "nm_ruas" "text",
    "thn_data" bigint,
    "status" "text",
    "fungsi" "text",
    "mendukung" "text",
    "ura_dukung" "text",
    "kd_bd_pu" bigint,
    "kd_jns_inf" bigint,
    "kd_inf" bigint,
    "provinsi" "text",
    "kab_kot" "text",
    "kecamatan" "text",
    "desa_kel" "text",
    "tk_ruas_aw" "text",
    "tk_ruas_ak" "text",
    "kd_patok" "text",
    "km_awal" "text",
    "km_akhir" bigint,
    "kon_baik" "text",
    "kon_sdg" "text",
    "kon_rgn" bigint,
    "kon_rusak" "text",
    "kon_mntp" "text",
    "kon_t_mntp" bigint,
    "panjang" bigint,
    "lbr_keras" bigint,
    "lhrt" bigint,
    "vcr" bigint,
    "tipe_jln" bigint,
    "mst" bigint,
    "tipe_keras" "text",
    "tanah_kri" "text",
    "macadam" "text",
    "aspal" bigint,
    "rigid" "text",
    "thn_pen_ak" "text",
    "jns_pen" "text",
    "koord_x_aw" bigint,
    "koord_y_aw" bigint,
    "koord_x_ak" bigint,
    "koord_y_ak" bigint,
    "shape_length" bigint,
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "last_sync" "text",
    "sync_state" bigint,
    "bm_prov_id" bigint,
    "kab_kot_id" bigint,
    "kelompok_val" "text",
    "ESRI_OID" bigint,
    "Column1" "text"
);


ALTER TABLE "public"."Jalan Daerah" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jalan Nasional" (
    "objectid" bigint,
    "bad_km" "text",
    "bad_psn" "text",
    "balai_id" bigint,
    "bm_prov_id" bigint,
    "city_id" bigint,
    "city_regency" "text",
    "end_point_identifier" "text",
    "fair_km" bigint,
    "fair_psn" bigint,
    "good_km" bigint,
    "good_psn" bigint,
    "iri" bigint,
    "link_name" "text",
    "linkid" bigint,
    "mantap_km" bigint,
    "mantap_psn" bigint,
    "mvalue_from" "text",
    "mvalue_to" bigint,
    "p_bad_km" "text",
    "p_bad_psn" "text",
    "p_fair_km" bigint,
    "p_fair_psn" bigint,
    "p_good_km" bigint,
    "p_good_psn" bigint,
    "p_mantap_km" bigint,
    "p_mantap_psn" bigint,
    "p_poor_km" bigint,
    "p_poor_psn" bigint,
    "p_tdk_mantap_km" bigint,
    "p_tdk_mantap_psn" bigint,
    "poor_km" bigint,
    "poor_psn" bigint,
    "real_length" bigint,
    "road_class" "text",
    "road_function" "text",
    "road_status" "text",
    "satker_ppk_id" "text",
    "semester" bigint,
    "shp_length" bigint,
    "sk_length" bigint,
    "start_point_identifier" "text",
    "tdk_mantap_km" bigint,
    "tdk_mantap_psn" bigint,
    "total_length" bigint,
    "up_bad_km" "text",
    "up_bad_psn" "text",
    "up_fair_km" "text",
    "up_fair_psn" "text",
    "up_good_km" "text",
    "up_good_psn" "text",
    "up_mantap_km" "text",
    "up_mantap_psn" "text",
    "up_poor_km" "text",
    "up_poor_psn" "text",
    "up_tdk_mantap_km" "text",
    "up_tdk_mantap_psn" "text",
    "update_date" "text",
    "year" bigint,
    "shape_length" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" bigint,
    "last_sync" "text",
    "objectid_1" bigint,
    "Column1" "text"
);


ALTER TABLE "public"."Jalan Nasional" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jalan Perbatasan Kalimantan" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" "text",
    "koord_y" "text",
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "linkid" bigint,
    "link_name" "text",
    "start_poin" "text",
    "end_point_" "text",
    "real_lengt" bigint,
    "sk_length" "text",
    "bm_prov_id" bigint,
    "road_funct" "text",
    "road_statu" "text",
    "road_class" "text",
    "city_regen" "text",
    "mst" "text",
    "fromdate" "text",
    "todate" "text",
    "eventid" "text",
    "start_date" "text",
    "end_date" "text",
    "shp_length" bigint,
    "mvalue_fro" "text",
    "mvalue_to" bigint,
    "city_id" bigint,
    "shape_length" "text",
    "provinsi" "text",
    "sta_hibah" "text",
    "st_length(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Jalan Perbatasan Kalimantan" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jalan Tol Konstruksi" (
    "objectid" bigint,
    "ruas" "text",
    "jalur" "text",
    "jenis" "text",
    "nama" "text",
    "panjang_km" bigint,
    "panjang_shp" bigint,
    "status" "text",
    "sub_status" "text",
    "region" "text",
    "bujt" "text",
    "kodefikasi" "text",
    "no" bigint,
    "kabupaten" "text",
    "provinsi" "text",
    "update_date" "text",
    "jenis_perkerasan" "text",
    "jumlah_lajur" "text",
    "lebar_lajur_lalulintas" "text",
    "lebar_bahu_dalam" "text",
    "lebar_bahu_luar" "text",
    "lebar_median" "text",
    "lebar_row" "text",
    "shape_len" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Jalan Tol Konstruksi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jalan Tol Operasi" (
    "nama_tol" "text",
    "nama_ruas" "text",
    "panjang" bigint,
    "pengelola" "text",
    "kabupaten_kota" "text",
    "provinsi" "text",
    "operational_date" "text",
    "objectid" bigint,
    "status" "text",
    "jalur" "text",
    "sta" "text",
    "sub_status" "text",
    "region" "text",
    "kodefikasi" "text",
    "x_star" bigint,
    "y_star" bigint,
    "x_end" bigint,
    "y_end" bigint,
    "shape_len" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Jalan Tol Operasi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jembatan Gantung" (
    "objectid" bigint,
    "bridge_name" "text",
    "city_regency" "text",
    "bridge_length" bigint,
    "bridge_width" bigint,
    "superstr_type" "text",
    "cons_year" bigint,
    "longitude" bigint,
    "latitude" bigint,
    "bridge_num" bigint,
    "bridge_type" "text",
    "bridge_status" "text",
    "province" "text",
    "sta_hibah" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Jembatan Gantung" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jembatan Khusus" (
    "objectid" bigint,
    "abt_type" "text",
    "bm_prov_id" bigint,
    "bridge_id" bigint,
    "bridge_length" bigint,
    "bridge_name" "text",
    "bridge_num" "text",
    "bridge_status" "text",
    "bridge_type" "text",
    "bridge_width" bigint,
    "city_regency" "text",
    "cons_year" bigint,
    "cross_type" "text",
    "latitude" bigint,
    "linkid" "text",
    "longitude" bigint,
    "cons_status" "text",
    "pile_type" "text",
    "pond_type" "text",
    "shore_dist" "text",
    "span_number" bigint,
    "superstr_type" "text",
    "c1000" bigint,
    "survey_date" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" bigint,
    "last_sync" "text",
    "keyjoin" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Jembatan Khusus" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jembatan Nasional" (
    "objectid" bigint,
    "linkid" bigint,
    "bridge_num" "text",
    "bridge_name" "text",
    "city_regency" "text",
    "bridge_length" bigint,
    "bridge_width" bigint,
    "bridge_type" "text",
    "bridge_status" "text",
    "adt_year" bigint,
    "aadt" bigint,
    "cons_year" bigint,
    "cross_type" "text",
    "road_func" "text",
    "span_number" bigint,
    "latitude" bigint,
    "longitude" bigint,
    "shore_dist" "text",
    "c1000" bigint,
    "survey_date" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Jembatan Nasional" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Jembatan Tol" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" "text",
    "koord_y" "text",
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "ruas" "text",
    "nama" "text",
    "sta" "text",
    "spans_m" "text",
    "panjang_m" "text",
    "tipe_data" "text",
    "jenis" "text",
    "sktr_cros" "text",
    "desa" "text",
    "kecamatan" "text",
    "kabupaten" "text",
    "lbr_eks" "text",
    "lbr_ren" "text",
    "status" "text",
    "region" "text",
    "bujt" "text",
    "kodefikasi" "text",
    "sub_status" "text",
    "seksi" "text",
    "spans" "text",
    "panjang" "text",
    "jalur" "text",
    "dimensi" "text",
    "shape_leng" "text",
    "span" "text",
    "stts_cross" "text",
    "lbr_eksist" "text",
    "lbr_rncna" "text",
    "layer" "text",
    "km" "text",
    "struk_cros" "text",
    "lbr_renc" "text",
    "span_" "text",
    "strk_cross" "text",
    "sync_state" "text",
    "provinsi" "text",
    "sta_hibah" "text",
    "st_length(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Jembatan Tol" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Kebutuhan Air" (
    "nama_ws" "text",
    "kode_ws" "text",
    "nomor" bigint,
    "irigasi" bigint,
    "perikanan" bigint,
    "peternakan" "text",
    "rki" bigint,
    "aliran_pem" bigint,
    "updated" "text",
    "thn_dat" bigint,
    "objectid" bigint,
    "last_sync" "text",
    "st_area(shape)" "text",
    "st_perimeter(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Kebutuhan Air" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Ketersediaan Air" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" "text",
    "koord_y" "text",
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "nm_dat_das" "text",
    "thn_dat" bigint,
    "nama_ws" "text",
    "kode_ws" "text",
    "status" "text",
    "nama_wd" "text",
    "kode_wd" "text",
    "ktrs_air" bigint,
    "kbth_air" bigint,
    "pts_ktrs_kap" bigint,
    "ktrs_kap" bigint,
    "kls_ktrs" "text",
    "keterangan" "text",
    "fcode" "text",
    "ruleid_ksp" bigint,
    "metadata" "text",
    "shape_leng" "text",
    "kls_ncrair" "text",
    "kls_ipa" "text",
    "luas" "text",
    "populasi" bigint,
    "rki" bigint,
    "nrc_air" bigint,
    "ipa" bigint,
    "shape_length" "text",
    "shape_area" "text",
    "nm_inf" "text",
    "kls_nrcair" "text",
    "luas_km2" "text",
    "sta_hibah" "text",
    "st_area(shape)" "text",
    "st_perimeter(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Ketersediaan Air" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Lereng" (
    "objectid" bigint,
    "no_lereng" "text",
    "koordinat_x_awal" bigint,
    "koordinat_y_awal" bigint,
    "koordinat_x_tengah" bigint,
    "koordinat_y_tengah" bigint,
    "koordinat_x_akhir" bigint,
    "koordinat_y_akhir" bigint,
    "balai_code" bigint,
    "linkid" bigint,
    "jenis_lereng" bigint,
    "panjang_lereng" bigint,
    "tinggi_lereng" bigint,
    "pjg_miring_lereng" bigint,
    "sudut_lereng" bigint,
    "material_lereng" bigint,
    "tahun" bigint,
    "approved_by" bigint,
    "shape_len" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" bigint,
    "last_sync" "text",
    "update_date" "text",
    "kab_kota_id" bigint,
    "Column1" "text"
);


ALTER TABLE "public"."Lereng" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Madrasah" (
    "fid" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "metadata" "text",
    "wadmpr" "text",
    "wadmkk" "text",
    "npsn" bigint,
    "jenjang" "text",
    "wadmkd" "text",
    "wadmkc" "text",
    "objectid" "text",
    "thn_pngn" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Madrasah" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Mata Air" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "jaringan_irigasi_jumlah_box_bagi" "text",
    "jaringan_irigasi_jumlah_springkel" "text",
    "jaringan_irigasi_musim_tanam_mt_1" "text",
    "jaringan_irigasi_musim_tanam_mt_2" "text",
    "jaringan_irigasi_musim_tanam_mt_3" "text",
    "jaringan_irigasi_panjang" "text",
    "kecamatan" "text",
    "kelompok_data_dasar" "text",
    "kelurahan" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude" bigint,
    "longitude" bigint,
    "manfaat_manfaat_jiwa" bigint,
    "manfaat_sumber_penyediaan_air_baku_m3_detik" bigint,
    "nama_mata_air" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_pekerjaan" "text",
    "tahun_pembangunan" bigint,
    "teknis_cat" "text",
    "teknis_elevasi" "text",
    "teknis_head_pompa" "text",
    "teknis_jenis_pompa" "text",
    "teknis_kelembagaan" "text",
    "teknis_keterangan" "text",
    "teknis_nama_sistem" "text",
    "teknis_sistem_pengambilan" "text",
    "teknis_sungai" "text",
    "teknis_tahun_rehab_terakhir" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Mata Air" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Neraca Air" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" "text",
    "koord_y" "text",
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "nm_inf" "text",
    "thn_dat" bigint,
    "nama_ws" "text",
    "kode_ws" "text",
    "status" "text",
    "nama_wd" "text",
    "kode_wd" "text",
    "ktrs_air" bigint,
    "jml_pddk" "text",
    "rmh_tangga" bigint,
    "prkotaan" bigint,
    "industri" bigint,
    "rki" bigint,
    "irigasi" bigint,
    "ptrnakan" bigint,
    "prikan" "text",
    "ap" bigint,
    "kbth_air" bigint,
    "nrc_air" bigint,
    "kls_nrcair" "text",
    "ipa" bigint,
    "kls_ipa" "text",
    "keterangan" "text",
    "metadata" "text",
    "kls_ncrair" "text",
    "luas" "text",
    "populasi" bigint,
    "shape_length" "text",
    "shape_area" "text",
    "luas_km2" "text",
    "sta_hibah" "text",
    "st_area(shape)" "text",
    "st_perimeter(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Neraca Air" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Overpass Tol" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" "text",
    "koord_y" "text",
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "ruas" "text",
    "nama" "text",
    "jenis" "text",
    "sta" "text",
    "span_m" "text",
    "status_cro" "text",
    "desa" "text",
    "kecamatan" "text",
    "kabupaten" "text",
    "lbr_eks" "text",
    "lbr_ren" "text",
    "pjg_m" "text",
    "status" "text",
    "region" "text",
    "bujt" "text",
    "kodefikasi" "text",
    "sub_status" "text",
    "seksi" "text",
    "dimensi" "text",
    "shape_leng" "text",
    "span" "text",
    "panjang" "text",
    "jml_lajur" "text",
    "lbar_lajur" "text",
    "l_bhu_dlam" "text",
    "l_bhu_luar" "text",
    "stts_cross" "text",
    "lbr_eksist" "text",
    "lbr_rncna" "text",
    "spans" "text",
    "jalur" "text",
    "km" "text",
    "span_" "text",
    "strk_cross" "text",
    "keterangan" "text",
    "sync_state" "text",
    "provinsi" "text",
    "sta_hibah" "text",
    "st_length(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Overpass Tol" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."PAH ABSAH" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelompok_data_dasar" "text",
    "kelurahan" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude" bigint,
    "longitude" bigint,
    "nama_penampung_air_hujan" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_pekerjaan" "text",
    "tahun_pembangunan" bigint,
    "teknis_cat" "text",
    "teknis_durasi_terlama_curah_hujan_dalam_setahun" "text",
    "teknis_durasi_terlama_dalam_setahun" "text",
    "teknis_elevasi" "text",
    "teknis_kelembagaan" "text",
    "teknis_keterangan" "text",
    "teknis_rata_rat_curah_hujan_tahunan" bigint,
    "teknis_sistem_pengambilan" "text",
    "teknis_tahun_rehab_terakhir" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."PAH ABSAH" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."PKP" (
    "objectid" bigint,
    "sigi_postgis.sde.ast_pkp_v2.fid" bigint,
    "fid_" "text",
    "namobj" "text",
    "thn_data" bigint,
    "kondisi" "text",
    "wadmpr" "text",
    "wadmkk" "text",
    "wadmkc" "text",
    "wadmkd" "text",
    "kategori" "text",
    "jns_infr" "text",
    "v_infr" "text",
    "thn_bangun" bigint,
    "koord_x" bigint,
    "koord_y" "text",
    "koord_x_da" "text",
    "remarks" "text",
    "metadata" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."PKP" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."PLBN" (
    "fid" bigint,
    "thn_data" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "metadata" "text",
    "desa_kel" "text",
    "kab_kot" "text",
    "propinsi" "text",
    "jns_infr" "text",
    "kecamatan" "text",
    "thn_bangun" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "objectid" bigint,
    "Column1" "text"
);


ALTER TABLE "public"."PLBN" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."PTKIN" (
    "fid" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "metadata" "text",
    "wadmpr" "text",
    "wadmkk" "text",
    "wadmkc" "text",
    "objectid" bigint,
    "thn_pngn" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."PTKIN" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."PTN" (
    "fid" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "metadata" "text",
    "wadmpr" "text",
    "wadmkk" "text",
    "wadmkc" "text",
    "objectid" bigint,
    "thn_pngn" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."PTN" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Pasar" (
    "fid" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "metadata" "text",
    "wadmpr" "text",
    "wadmkk" "text",
    "wadmkd" "text",
    "wadmkc" "text",
    "objectid" bigint,
    "thn_pngn" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Pasar" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Pengaman Pantai" (
    "daerah_aliran_sungai" "text",
    "garis_koordinat_latitude_akhir" "text",
    "garis_koordinat_latitude_awal" "text",
    "garis_koordinat_longitude_akhir" "text",
    "garis_koordinat_longitude_awal" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude_akhir" "text",
    "latitude_awal" "text",
    "latitude_pos" "text",
    "lintas_kewenangan" "text",
    "longitude_akhir" "text",
    "longitude_awal" "text",
    "longitude_pos" "text",
    "manfaat_pelindung_fasilitas_umum" "text",
    "manfaat_lain_lain" "text",
    "manfaat_pelindung_jalan_raya" "text",
    "manfaat_pelindung_muara_sungai" "text",
    "manfaat_pelindung_permukiman" "text",
    "manfaat_pelindung_tempat_wisata" "text",
    "media_cover_aset" "text",
    "media_foto" "text",
    "media_plang_nama" "text",
    "media_prasasti_peresmian" "text",
    "media_video" "jsonb",
    "media_video_singkat_aset" "text",
    "nama_infrastruktur" "text",
    "op_oleh" "text",
    "panjang_infrastruktur_m" bigint,
    "pengelola" "text",
    "provinsi" "text",
    "status_infrastruktur" "text",
    "status_pemeliharaan" "text",
    "tagging_proyek" "text",
    "tahun_pembangunan" bigint,
    "teknis_elevasi_puncak_m" bigint,
    "teknis_jenis_bangunan" "text",
    "teknis_kemiringan_dalam" "text",
    "teknis_kemiringan_luar" "text",
    "teknis_kepentingan_pantai" "text",
    "teknis_koefisien_tingkat_kepentingan" bigint,
    "teknis_kondisi_infrastruktur" "text",
    "teknis_lebar_dasar_1_m" bigint,
    "teknis_lebar_dasar_2_m" bigint,
    "teknis_lebar_puncak_m" bigint,
    "teknis_material" "text",
    "teknis_panjang_m" bigint,
    "teknis_pergeseran_garis_pantai" "text",
    "teknis_struktur" "text",
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Pengaman Pantai" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Pengendali Sedimen" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude" "text",
    "lintas_kewenangan" "text",
    "longitude" "text",
    "media_cover_aset" "text",
    "media_foto" "jsonb",
    "media_gambar_desain" "jsonb",
    "media_gambar_teknis" "jsonb",
    "media_plang_nama" "text",
    "media_prasasti_peresmian" "text",
    "media_video" "jsonb",
    "media_video_singkat_aset" "text",
    "nama_infrastruktur" "text",
    "op_oleh" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_infrastruktur" "text",
    "status_pemeliharaan" "text",
    "tagging_proyek" "text",
    "tahun_pembangunan" bigint,
    "teknis_daya_tampung_m3" bigint,
    "teknis_jenis" "text",
    "teknis_jumlah_sabo" bigint,
    "teknis_kondisi_infrastruktur" "text",
    "teknis_lebar_m" bigint,
    "teknis_panjang_m" bigint,
    "teknis_sungai" "text",
    "teknis_tinggi_m" bigint,
    "tipe_infrastruktur" "text",
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Pengendali Sedimen" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Pompa Banjir" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude" "text",
    "lintas_kewenangan" "text",
    "longitude" "text",
    "media_cover_aset" "text",
    "media_foto" "jsonb",
    "media_plang_nama" "text",
    "media_prasasti_peresmian" "text",
    "media_video" "jsonb",
    "media_video_singkat_aset" "text",
    "nama_infrastruktur" "text",
    "op_oleh" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_pemeliharaan" "text",
    "teknis_keterangan" "text",
    "teknis_kondisi_infrastruktur" "text",
    "teknis_sungai" "text",
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Pompa Banjir" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Pos Curah Hujan" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" "text",
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" "text",
    "kota_kabupaten" "text",
    "latitude" bigint,
    "longitude" "text",
    "nama_hidrologi" "text",
    "pengelola" "text",
    "provinsi" "text",
    "teknis_jenis_pos" "text",
    "tipe_hidrologi" "text",
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Pos Curah Hujan" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Pos Duga Air" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kota_kabupaten" "text",
    "latitude" "text",
    "longitude" "text",
    "nama_hidrologi" "text",
    "pengelola" "text",
    "provinsi" "text",
    "teknis_jenis_pos" "text",
    "tipe_hidrologi" "text",
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Pos Duga Air" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Pos Klimatologi" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "kode" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kota_kabupaten" "text",
    "latitude" "text",
    "longitude" "text",
    "nama_hidrologi" "text",
    "pengelola" "text",
    "provinsi" "text",
    "teknis_jenis_pos" "text",
    "tipe_hidrologi" "text",
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Pos Klimatologi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Rest Area" (
    "fid" bigint,
    "objectid" bigint,
    "nama" "text",
    "objecti_km" "text",
    "objecti_k2" "text",
    "keterangan" "text",
    "lat" bigint,
    "long" bigint,
    "layer" "text",
    "foto" "text",
    "spbu" bigint,
    "restoran" bigint,
    "mushola" bigint,
    "toilet" bigint,
    "minimarket" bigint,
    "atm" bigint,
    "bengkel" bigint,
    "dftr_resto" "text",
    "dftr_musho" "text",
    "dftr_minim" "text",
    "dftr_atm" "text",
    "dftr_bengk" "text",
    "denah" "text",
    "spklu" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Rest Area" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Rumah Sakit" (
    "fid" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "metadata" "text",
    "wadmpr" "text",
    "wadmkk" "text",
    "wadmkd" "text",
    "wadmkc" "text",
    "objectid" bigint,
    "thn_pngn" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Rumah Sakit" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Sarana Olahraga" (
    "sigi_postgis.sde.ast_saranaolahraga_fulltable_v2.fid" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "jns_infr" "text",
    "wadmpr" "text",
    "wadmkk" "text",
    "koord_x_da" "text",
    "wadmkc" "text",
    "objectid" bigint,
    "thn_pngn" bigint,
    "remarks" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Sarana Olahraga" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Sekolah" (
    "fid" bigint,
    "koord_x" "text",
    "koord_y" "text",
    "namobj" "text",
    "metadata" "text",
    "desa_kel" "text",
    "npsn" bigint,
    "jenjang" "text",
    "kab_kot" "text",
    "propinsi" "text",
    "kecamatan" "text",
    "objectid" bigint,
    "thn_pngn" bigint,
    "remarks" "text",
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Sekolah" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Sekolah Rakyat" (
    "objectid" bigint,
    "no" bigint,
    "provinsi" "text",
    "namaobjek" "text",
    "kota_kabupaten" "text",
    "desa_keluarahan" "text",
    "kecamatan" "text",
    "alamat" "text",
    "namalokasimap" "text",
    "latitude" "text",
    "longitude" "text",
    "linklokasi" "text",
    "rombel" bigint,
    "siswa_i" bigint,
    "jenjang" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Sekolah Rakyat" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Simpang Susun Tol" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" "text",
    "koord_y" "text",
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "ruas" "text",
    "jalur" "text",
    "nama" "text",
    "jenis" "text",
    "sta" "text",
    "panjang" "text",
    "tipe_data" "text",
    "strktur_c" "text",
    "desa" "text",
    "kecamatan" "text",
    "kabupaten" "text",
    "lbr_eks" "text",
    "lbr_ren" "text",
    "status" "text",
    "region" "text",
    "bujt" "text",
    "kodefikasi" "text",
    "sub_status" "text",
    "seksi" "text",
    "spans" "text",
    "dimensi" "text",
    "shape_leng" "text",
    "keterangan" "text",
    "strk_cross" "text",
    "lbr_eksist" "text",
    "lbr_rncna" "text",
    "span" "text",
    "stts_cross" "text",
    "tipe" "text",
    "stktr_cros" "text",
    "l_eksist" "text",
    "l_rencana" "text",
    "shape_le_1" "text",
    "km" "text",
    "lbr_lajur" "text",
    "jml_lajur" "text",
    "lbahu_dlm" "text",
    "lbahu_luar" "text",
    "sync_state" "text",
    "provinsi" "text",
    "sta_hibah" "text",
    "st_length(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Simpang Susun Tol" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Situ" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "kecamatan" "text",
    "kelurahan" "text",
    "keterangan_lokasi" "text",
    "kewenangan" "text",
    "kode" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_kecamatan" bigint,
    "kode_kelurahan" bigint,
    "kode_kota_kabupaten" bigint,
    "kode_pengelola" "text",
    "kode_provinsi" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kota_kabupaten" "text",
    "latitude" "text",
    "lintas_kewenangan" "text",
    "longitude" "text",
    "manfaat_irigasi_ha" bigint,
    "manfaat_pariwisata" "text",
    "manfaat_penyediaan_air_baku_liter_detik" "text",
    "manfaat_perikanan" "text",
    "manfaat_plta_mw" "text",
    "manfaat_reduksi_m3_detik" "text",
    "manfaat_ternak" "text",
    "media_as_build_drwaing" "jsonb",
    "media_cover_aset" "text",
    "media_foto" "text",
    "media_geojson" "jsonb",
    "media_lain_lain" "jsonb",
    "media_video" "text",
    "media_video_singkat_aset" "text",
    "nama_aset" "text",
    "op_oleh" "text",
    "pengelola" "text",
    "provinsi" "text",
    "status_pemeliharaan" "text",
    "teknis_daerah_tangkapan_air_km2" bigint,
    "teknis_jenis_sedimentasi" "text",
    "teknis_jenis_tampungan" "text",
    "teknis_kapasitas_layanan_m3_detik" "text",
    "teknis_keterangan" "text",
    "teknis_kualitas_air" "text",
    "teknis_laju_sedimentasi_ton_tahun" bigint,
    "teknis_luas_genangan_ha" bigint,
    "teknis_luas_tampungan_ha" bigint,
    "teknis_rata_rata_kedalaman_m" bigint,
    "teknis_sedimentasi_mm_ha_tahun" bigint,
    "teknis_type_tampungan" "text",
    "teknis_volume_tampung_m3" bigint,
    "updated_at" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text"
);


ALTER TABLE "public"."Situ" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Sumur" (
    "daerah_aliran_sungai" "text",
    "id" "text",
    "jaringan_irigasi_jumlah_box_bagi" "text",
    "jaringan_irigasi_jumlah_springkel" "text",
    "jaringan_irigasi_musim_tanam_mt_1" "text",
    "jaringan_irigasi_musim_tanam_mt_2" "text",
    "jaringan_irigasi_musim_tanam_mt_3" "text",
    "jaringan_irigasi_panjang" bigint,
    "kecamatan" "text",
    "kelompok_data_dasar" "text",
    "kelurahan" "text",
    "kode_balai" "text",
    "kode_daerah_aliran_sungai" "text",
    "kode_daerah_aliran_sungai_lain" bigint,
    "kode_wilayah_sungai" "text",
    "kode_wilayah_sungai_lain" bigint,
    "kondisi_bangunan" "text",
    "kota_kabupaten" "text",
    "latitude" bigint,
    "longitude" bigint,
    "manfaat_manfaat_jiwa" "text",
    "manfaat_manfaat_luas_daerah_irigasi_awal" "text",
    "manfaat_manfaat_luas_daerah_irigasi_saat_ini" bigint,
    "nama_sumur" "text",
    "pengelola" "text",
    "provinsi" "text",
    "tahun_pembangunan" "text",
    "teknis_cat" "text",
    "teknis_debit_idle" "text",
    "teknis_debit_optimum" bigint,
    "teknis_debit_pompa" bigint,
    "teknis_elevasi" bigint,
    "teknis_fungsi_sumur" "text",
    "teknis_head_pompa" "text",
    "teknis_jenis_pipa" "text",
    "teknis_jenis_pompa" "text",
    "teknis_jenis_sumur" "text",
    "teknis_kedalaman_sumur" bigint,
    "teknis_kelembagaan" "text",
    "teknis_keterangan" "text",
    "teknis_tahun_rehab_terakhir" "text",
    "urut" bigint,
    "wilayah_sungai" "text",
    "objectid" bigint,
    "sync_state" bigint,
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Sumur" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."TPA" (
    "objectid" bigint,
    "koord_x" bigint,
    "koord_y" bigint,
    "namobj" "text",
    "jnssmp" "text",
    "stspng" "text",
    "metadata" "text",
    "kaptpa" bigint,
    "kab_kot" "text",
    "propinsi" "text",
    "ckplyn" bigint,
    "artpa" bigint,
    "thnpbn" bigint,
    "remarks" "text",
    "srs_id" bigint,
    "fcode" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "urut" "text",
    "sync_state" "text",
    "last_sync" "text",
    "Column1" "text"
);


ALTER TABLE "public"."TPA" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Underpass Tol" (
    "OBJECTID" bigint,
    "uid" "text",
    "creator" "text",
    "created" "text",
    "updater" "text",
    "updated" "text",
    "nm_balai" "text",
    "koord_x" "text",
    "koord_y" "text",
    "foto" "text",
    "data_src" "text",
    "last_sync" "text",
    "sync_notes" "text",
    "ruas" "text",
    "jenis" "text",
    "nama" "text",
    "sta" "text",
    "seksi" "text",
    "dimensi" "text",
    "span" "text",
    "status" "text",
    "sub_status" "text",
    "region" "text",
    "bujt" "text",
    "kodefikasi" "text",
    "shape_leng" "text",
    "shape_le_1" "text",
    "jalur" "text",
    "km" "text",
    "spans" "text",
    "panjang" "text",
    "span_" "text",
    "sync_state" "text",
    "provinsi" "text",
    "sta_hibah" "text",
    "st_length(shape)" "text",
    "Column1" "text"
);


ALTER TABLE "public"."Underpass Tol" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."aset_bim_pu_1__1762139389898" (
    "id" bigint NOT NULL,
    "objectid" "text",
    "nmpaket" "text",
    "alias_name" "text",
    "paket_category" "text",
    "latitude" "text",
    "longitude" "text",
    "unor" "text",
    "unker" "text",
    "balai" "text",
    "start_kontrak" "text",
    "end_kontrak" "text",
    "status" "text",
    "pagu_total" "text",
    "progress" "text",
    "location" "text",
    "year" "text",
    "budget_source" "text",
    "infra_category" "text",
    "type" "text",
    "kode_infrastruktur" "text",
    "is_publish" "text",
    "link_detail" "text",
    "last_sync" "text"
);


ALTER TABLE "public"."aset_bim_pu_1__1762139389898" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."aset_bim_pu_1__1762139389898_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."aset_bim_pu_1__1762139389898_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."aset_bim_pu_1__1762139389898_id_seq" OWNED BY "public"."aset_bim_pu_1__1762139389898"."id";



CREATE TABLE IF NOT EXISTS "public"."berita" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "excerpt" "text",
    "image_url" "text",
    "source_url" "text",
    "content" "text"
);


ALTER TABLE "public"."berita" OWNER TO "postgres";


ALTER TABLE "public"."berita" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."berita_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nama_kategori" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."data_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_name" "text" NOT NULL,
    "user_email" "text" NOT NULL,
    "organization" "text",
    "reason" "text" NOT NULL,
    "status" "public"."request_status_type" DEFAULT 'pending'::"public"."request_status_type" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_phone" "text",
    "response_link" "text"
);


ALTER TABLE "public"."data_requests" OWNER TO "postgres";


COMMENT ON TABLE "public"."data_requests" IS 'Menampung permintaan data umum yang tidak ada di katalog.';



COMMENT ON COLUMN "public"."data_requests"."user_phone" IS 'Nomor telepon pengguna yang mengajukan data.';



COMMENT ON COLUMN "public"."data_requests"."response_link" IS 'Link balasan atau data yang diberikan kepada pemohon.';



CREATE TABLE IF NOT EXISTS "public"."datasets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "unor_id" "uuid",
    "category_id" "uuid",
    "metadata" "jsonb",
    "sample_data" "jsonb",
    "data_url" "text",
    "click_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."datasets" OWNER TO "postgres";


COMMENT ON COLUMN "public"."datasets"."data_url" IS 'Berisi URL API yang di-generate oleh Supabase setelah impor data.';



CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_name" "text" NOT NULL,
    "gender" "text",
    "age_range" "text",
    "rating" integer,
    "suggestion" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."feedback" OWNER TO "postgres";


COMMENT ON TABLE "public"."feedback" IS 'Menyimpan data survei kepuasan dan feedback dari pengguna.';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "job_title" "text",
    "is_admin" boolean DEFAULT false
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."unors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nama_unor" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."unors" OWNER TO "postgres";


ALTER TABLE ONLY "public"."aset_bim_pu_1__1762139389898" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."aset_bim_pu_1__1762139389898_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."aset_bim_pu_1__1762139389898"
    ADD CONSTRAINT "aset_bim_pu_1__1762139389898_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."berita"
    ADD CONSTRAINT "berita_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."data_requests"
    ADD CONSTRAINT "data_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."datasets"
    ADD CONSTRAINT "datasets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."unors"
    ADD CONSTRAINT "unors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."datasets"
    ADD CONSTRAINT "datasets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."datasets"
    ADD CONSTRAINT "datasets_unor_id_fkey" FOREIGN KEY ("unor_id") REFERENCES "public"."unors"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin can delete data requests" ON "public"."data_requests" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "Admin can manage categories" ON "public"."categories" USING ("public"."is_admin"());



CREATE POLICY "Admin can manage data requests" ON "public"."data_requests" USING ("public"."is_admin"());



CREATE POLICY "Admin can manage datasets" ON "public"."datasets" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admin can manage feedback" ON "public"."feedback" USING ("public"."is_admin"());



CREATE POLICY "Admin can manage news" ON "public"."berita" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin can manage profiles" ON "public"."profiles" USING ("public"."is_admin"());



CREATE POLICY "Admin can manage unors" ON "public"."unors" USING ("public"."is_admin"());



CREATE POLICY "Admin can read data requests" ON "public"."data_requests" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admin can update data requests" ON "public"."data_requests" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "Anyone can create a data request" ON "public"."data_requests" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can create feedback" ON "public"."feedback" FOR INSERT WITH CHECK (true);



ALTER TABLE "public"."Aset Tanah PU" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."BPB" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Bendung" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Bendungan Konstruksi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Bendungan Operasi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Bendungan Rencana" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Daerah Irigasi Permukaan" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Danau" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Data Kepegawaian Kementrian PU" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Efektivitas Drainase" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Embung" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable read access for all users" ON "public"."Aset Tanah PU" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."BPB" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Bendung" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Bendungan Konstruksi" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Bendungan Operasi" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Bendungan Rencana" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Daerah Irigasi Permukaan" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Danau" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Data Kepegawaian Kementrian PU" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Efektivitas Drainase" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Embung" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Gerbang Tol" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."IPA Spam" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."IPAL" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."IPLT" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Intake Sungai" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jalan Daerah" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jalan Nasional" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jalan Perbatasan Kalimantan" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jalan Tol Konstruksi" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jalan Tol Operasi" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jembatan Gantung" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jembatan Khusus" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jembatan Nasional" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Jembatan Tol" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Kebutuhan Air" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Ketersediaan Air" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Lereng" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Madrasah" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Mata Air" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Neraca Air" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Overpass Tol" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PAH ABSAH" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PKP" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PLBN" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PTKIN" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PTN" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Pasar" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Pengaman Pantai" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Pengendali Sedimen" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Pompa Banjir" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Pos Curah Hujan" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Pos Duga Air" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Pos Klimatologi" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Rest Area" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Rumah Sakit" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Sarana Olahraga" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Sekolah" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Sekolah Rakyat" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Simpang Susun Tol" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Situ" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Sumur" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."TPA" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Underpass Tol" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."unors" FOR SELECT USING (true);



ALTER TABLE "public"."Gerbang Tol" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."IPA Spam" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."IPAL" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."IPLT" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Intake Sungai" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jalan Daerah" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jalan Nasional" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jalan Perbatasan Kalimantan" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jalan Tol Konstruksi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jalan Tol Operasi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jembatan Gantung" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jembatan Khusus" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jembatan Nasional" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Jembatan Tol" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Kebutuhan Air" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Ketersediaan Air" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Lereng" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Madrasah" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Mata Air" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Neraca Air" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Overpass Tol" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PAH ABSAH" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PKP" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PLBN" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PTKIN" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PTN" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Pasar" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Pengaman Pantai" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Pengendali Sedimen" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Pompa Banjir" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Pos Curah Hujan" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Pos Duga Air" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Pos Klimatologi" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Public can read categories" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Public can read datasets" ON "public"."datasets" FOR SELECT USING (true);



CREATE POLICY "Public can read news" ON "public"."berita" FOR SELECT USING (true);



CREATE POLICY "Public can read unors" ON "public"."unors" FOR SELECT USING (true);



CREATE POLICY "Public_Read_aset_bim_pu_1__1762139389898" ON "public"."aset_bim_pu_1__1762139389898" FOR SELECT USING (true);



ALTER TABLE "public"."Rest Area" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Rumah Sakit" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Sarana Olahraga" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Sekolah" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Sekolah Rakyat" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Simpang Susun Tol" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Situ" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Sumur" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."TPA" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Underpass Tol" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."aset_bim_pu_1__1762139389898" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."berita" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."data_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."datasets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feedback" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."unors" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Mata Air";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Neraca Air";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."PAH ABSAH";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."exec"("sql_query" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."exec"("sql_query" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."exec"("sql_query" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_total_clicks"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_total_clicks"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_total_clicks"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_click_count"("row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_click_count"("row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_click_count"("row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";


















GRANT ALL ON TABLE "public"."Aset Tanah PU" TO "anon";
GRANT ALL ON TABLE "public"."Aset Tanah PU" TO "authenticated";
GRANT ALL ON TABLE "public"."Aset Tanah PU" TO "service_role";



GRANT ALL ON TABLE "public"."BPB" TO "anon";
GRANT ALL ON TABLE "public"."BPB" TO "authenticated";
GRANT ALL ON TABLE "public"."BPB" TO "service_role";



GRANT ALL ON TABLE "public"."Bendung" TO "anon";
GRANT ALL ON TABLE "public"."Bendung" TO "authenticated";
GRANT ALL ON TABLE "public"."Bendung" TO "service_role";



GRANT ALL ON TABLE "public"."Bendungan Konstruksi" TO "anon";
GRANT ALL ON TABLE "public"."Bendungan Konstruksi" TO "authenticated";
GRANT ALL ON TABLE "public"."Bendungan Konstruksi" TO "service_role";



GRANT ALL ON TABLE "public"."Bendungan Operasi" TO "anon";
GRANT ALL ON TABLE "public"."Bendungan Operasi" TO "authenticated";
GRANT ALL ON TABLE "public"."Bendungan Operasi" TO "service_role";



GRANT ALL ON TABLE "public"."Bendungan Rencana" TO "anon";
GRANT ALL ON TABLE "public"."Bendungan Rencana" TO "authenticated";
GRANT ALL ON TABLE "public"."Bendungan Rencana" TO "service_role";



GRANT ALL ON TABLE "public"."Daerah Irigasi Permukaan" TO "anon";
GRANT ALL ON TABLE "public"."Daerah Irigasi Permukaan" TO "authenticated";
GRANT ALL ON TABLE "public"."Daerah Irigasi Permukaan" TO "service_role";



GRANT ALL ON TABLE "public"."Danau" TO "anon";
GRANT ALL ON TABLE "public"."Danau" TO "authenticated";
GRANT ALL ON TABLE "public"."Danau" TO "service_role";



GRANT ALL ON TABLE "public"."Data Kepegawaian Kementrian PU" TO "anon";
GRANT ALL ON TABLE "public"."Data Kepegawaian Kementrian PU" TO "authenticated";
GRANT ALL ON TABLE "public"."Data Kepegawaian Kementrian PU" TO "service_role";



GRANT ALL ON TABLE "public"."Efektivitas Drainase" TO "anon";
GRANT ALL ON TABLE "public"."Efektivitas Drainase" TO "authenticated";
GRANT ALL ON TABLE "public"."Efektivitas Drainase" TO "service_role";



GRANT ALL ON TABLE "public"."Embung" TO "anon";
GRANT ALL ON TABLE "public"."Embung" TO "authenticated";
GRANT ALL ON TABLE "public"."Embung" TO "service_role";



GRANT ALL ON TABLE "public"."Gerbang Tol" TO "anon";
GRANT ALL ON TABLE "public"."Gerbang Tol" TO "authenticated";
GRANT ALL ON TABLE "public"."Gerbang Tol" TO "service_role";



GRANT ALL ON TABLE "public"."IPA Spam" TO "anon";
GRANT ALL ON TABLE "public"."IPA Spam" TO "authenticated";
GRANT ALL ON TABLE "public"."IPA Spam" TO "service_role";



GRANT ALL ON TABLE "public"."IPAL" TO "anon";
GRANT ALL ON TABLE "public"."IPAL" TO "authenticated";
GRANT ALL ON TABLE "public"."IPAL" TO "service_role";



GRANT ALL ON TABLE "public"."IPLT" TO "anon";
GRANT ALL ON TABLE "public"."IPLT" TO "authenticated";
GRANT ALL ON TABLE "public"."IPLT" TO "service_role";



GRANT ALL ON TABLE "public"."Intake Sungai" TO "anon";
GRANT ALL ON TABLE "public"."Intake Sungai" TO "authenticated";
GRANT ALL ON TABLE "public"."Intake Sungai" TO "service_role";



GRANT ALL ON TABLE "public"."Jalan Daerah" TO "anon";
GRANT ALL ON TABLE "public"."Jalan Daerah" TO "authenticated";
GRANT ALL ON TABLE "public"."Jalan Daerah" TO "service_role";



GRANT ALL ON TABLE "public"."Jalan Nasional" TO "anon";
GRANT ALL ON TABLE "public"."Jalan Nasional" TO "authenticated";
GRANT ALL ON TABLE "public"."Jalan Nasional" TO "service_role";



GRANT ALL ON TABLE "public"."Jalan Perbatasan Kalimantan" TO "anon";
GRANT ALL ON TABLE "public"."Jalan Perbatasan Kalimantan" TO "authenticated";
GRANT ALL ON TABLE "public"."Jalan Perbatasan Kalimantan" TO "service_role";



GRANT ALL ON TABLE "public"."Jalan Tol Konstruksi" TO "anon";
GRANT ALL ON TABLE "public"."Jalan Tol Konstruksi" TO "authenticated";
GRANT ALL ON TABLE "public"."Jalan Tol Konstruksi" TO "service_role";



GRANT ALL ON TABLE "public"."Jalan Tol Operasi" TO "anon";
GRANT ALL ON TABLE "public"."Jalan Tol Operasi" TO "authenticated";
GRANT ALL ON TABLE "public"."Jalan Tol Operasi" TO "service_role";



GRANT ALL ON TABLE "public"."Jembatan Gantung" TO "anon";
GRANT ALL ON TABLE "public"."Jembatan Gantung" TO "authenticated";
GRANT ALL ON TABLE "public"."Jembatan Gantung" TO "service_role";



GRANT ALL ON TABLE "public"."Jembatan Khusus" TO "anon";
GRANT ALL ON TABLE "public"."Jembatan Khusus" TO "authenticated";
GRANT ALL ON TABLE "public"."Jembatan Khusus" TO "service_role";



GRANT ALL ON TABLE "public"."Jembatan Nasional" TO "anon";
GRANT ALL ON TABLE "public"."Jembatan Nasional" TO "authenticated";
GRANT ALL ON TABLE "public"."Jembatan Nasional" TO "service_role";



GRANT ALL ON TABLE "public"."Jembatan Tol" TO "anon";
GRANT ALL ON TABLE "public"."Jembatan Tol" TO "authenticated";
GRANT ALL ON TABLE "public"."Jembatan Tol" TO "service_role";



GRANT ALL ON TABLE "public"."Kebutuhan Air" TO "anon";
GRANT ALL ON TABLE "public"."Kebutuhan Air" TO "authenticated";
GRANT ALL ON TABLE "public"."Kebutuhan Air" TO "service_role";



GRANT ALL ON TABLE "public"."Ketersediaan Air" TO "anon";
GRANT ALL ON TABLE "public"."Ketersediaan Air" TO "authenticated";
GRANT ALL ON TABLE "public"."Ketersediaan Air" TO "service_role";



GRANT ALL ON TABLE "public"."Lereng" TO "anon";
GRANT ALL ON TABLE "public"."Lereng" TO "authenticated";
GRANT ALL ON TABLE "public"."Lereng" TO "service_role";



GRANT ALL ON TABLE "public"."Madrasah" TO "anon";
GRANT ALL ON TABLE "public"."Madrasah" TO "authenticated";
GRANT ALL ON TABLE "public"."Madrasah" TO "service_role";



GRANT ALL ON TABLE "public"."Mata Air" TO "anon";
GRANT ALL ON TABLE "public"."Mata Air" TO "authenticated";
GRANT ALL ON TABLE "public"."Mata Air" TO "service_role";



GRANT ALL ON TABLE "public"."Neraca Air" TO "anon";
GRANT ALL ON TABLE "public"."Neraca Air" TO "authenticated";
GRANT ALL ON TABLE "public"."Neraca Air" TO "service_role";



GRANT ALL ON TABLE "public"."Overpass Tol" TO "anon";
GRANT ALL ON TABLE "public"."Overpass Tol" TO "authenticated";
GRANT ALL ON TABLE "public"."Overpass Tol" TO "service_role";



GRANT ALL ON TABLE "public"."PAH ABSAH" TO "anon";
GRANT ALL ON TABLE "public"."PAH ABSAH" TO "authenticated";
GRANT ALL ON TABLE "public"."PAH ABSAH" TO "service_role";



GRANT ALL ON TABLE "public"."PKP" TO "anon";
GRANT ALL ON TABLE "public"."PKP" TO "authenticated";
GRANT ALL ON TABLE "public"."PKP" TO "service_role";



GRANT ALL ON TABLE "public"."PLBN" TO "anon";
GRANT ALL ON TABLE "public"."PLBN" TO "authenticated";
GRANT ALL ON TABLE "public"."PLBN" TO "service_role";



GRANT ALL ON TABLE "public"."PTKIN" TO "anon";
GRANT ALL ON TABLE "public"."PTKIN" TO "authenticated";
GRANT ALL ON TABLE "public"."PTKIN" TO "service_role";



GRANT ALL ON TABLE "public"."PTN" TO "anon";
GRANT ALL ON TABLE "public"."PTN" TO "authenticated";
GRANT ALL ON TABLE "public"."PTN" TO "service_role";



GRANT ALL ON TABLE "public"."Pasar" TO "anon";
GRANT ALL ON TABLE "public"."Pasar" TO "authenticated";
GRANT ALL ON TABLE "public"."Pasar" TO "service_role";



GRANT ALL ON TABLE "public"."Pengaman Pantai" TO "anon";
GRANT ALL ON TABLE "public"."Pengaman Pantai" TO "authenticated";
GRANT ALL ON TABLE "public"."Pengaman Pantai" TO "service_role";



GRANT ALL ON TABLE "public"."Pengendali Sedimen" TO "anon";
GRANT ALL ON TABLE "public"."Pengendali Sedimen" TO "authenticated";
GRANT ALL ON TABLE "public"."Pengendali Sedimen" TO "service_role";



GRANT ALL ON TABLE "public"."Pompa Banjir" TO "anon";
GRANT ALL ON TABLE "public"."Pompa Banjir" TO "authenticated";
GRANT ALL ON TABLE "public"."Pompa Banjir" TO "service_role";



GRANT ALL ON TABLE "public"."Pos Curah Hujan" TO "anon";
GRANT ALL ON TABLE "public"."Pos Curah Hujan" TO "authenticated";
GRANT ALL ON TABLE "public"."Pos Curah Hujan" TO "service_role";



GRANT ALL ON TABLE "public"."Pos Duga Air" TO "anon";
GRANT ALL ON TABLE "public"."Pos Duga Air" TO "authenticated";
GRANT ALL ON TABLE "public"."Pos Duga Air" TO "service_role";



GRANT ALL ON TABLE "public"."Pos Klimatologi" TO "anon";
GRANT ALL ON TABLE "public"."Pos Klimatologi" TO "authenticated";
GRANT ALL ON TABLE "public"."Pos Klimatologi" TO "service_role";



GRANT ALL ON TABLE "public"."Rest Area" TO "anon";
GRANT ALL ON TABLE "public"."Rest Area" TO "authenticated";
GRANT ALL ON TABLE "public"."Rest Area" TO "service_role";



GRANT ALL ON TABLE "public"."Rumah Sakit" TO "anon";
GRANT ALL ON TABLE "public"."Rumah Sakit" TO "authenticated";
GRANT ALL ON TABLE "public"."Rumah Sakit" TO "service_role";



GRANT ALL ON TABLE "public"."Sarana Olahraga" TO "anon";
GRANT ALL ON TABLE "public"."Sarana Olahraga" TO "authenticated";
GRANT ALL ON TABLE "public"."Sarana Olahraga" TO "service_role";



GRANT ALL ON TABLE "public"."Sekolah" TO "anon";
GRANT ALL ON TABLE "public"."Sekolah" TO "authenticated";
GRANT ALL ON TABLE "public"."Sekolah" TO "service_role";



GRANT ALL ON TABLE "public"."Sekolah Rakyat" TO "anon";
GRANT ALL ON TABLE "public"."Sekolah Rakyat" TO "authenticated";
GRANT ALL ON TABLE "public"."Sekolah Rakyat" TO "service_role";



GRANT ALL ON TABLE "public"."Simpang Susun Tol" TO "anon";
GRANT ALL ON TABLE "public"."Simpang Susun Tol" TO "authenticated";
GRANT ALL ON TABLE "public"."Simpang Susun Tol" TO "service_role";



GRANT ALL ON TABLE "public"."Situ" TO "anon";
GRANT ALL ON TABLE "public"."Situ" TO "authenticated";
GRANT ALL ON TABLE "public"."Situ" TO "service_role";



GRANT ALL ON TABLE "public"."Sumur" TO "anon";
GRANT ALL ON TABLE "public"."Sumur" TO "authenticated";
GRANT ALL ON TABLE "public"."Sumur" TO "service_role";



GRANT ALL ON TABLE "public"."TPA" TO "anon";
GRANT ALL ON TABLE "public"."TPA" TO "authenticated";
GRANT ALL ON TABLE "public"."TPA" TO "service_role";



GRANT ALL ON TABLE "public"."Underpass Tol" TO "anon";
GRANT ALL ON TABLE "public"."Underpass Tol" TO "authenticated";
GRANT ALL ON TABLE "public"."Underpass Tol" TO "service_role";



GRANT ALL ON TABLE "public"."aset_bim_pu_1__1762139389898" TO "anon";
GRANT ALL ON TABLE "public"."aset_bim_pu_1__1762139389898" TO "authenticated";
GRANT ALL ON TABLE "public"."aset_bim_pu_1__1762139389898" TO "service_role";



GRANT ALL ON SEQUENCE "public"."aset_bim_pu_1__1762139389898_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."aset_bim_pu_1__1762139389898_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."aset_bim_pu_1__1762139389898_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."berita" TO "anon";
GRANT ALL ON TABLE "public"."berita" TO "authenticated";
GRANT ALL ON TABLE "public"."berita" TO "service_role";



GRANT ALL ON SEQUENCE "public"."berita_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."berita_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."berita_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."data_requests" TO "anon";
GRANT ALL ON TABLE "public"."data_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."data_requests" TO "service_role";



GRANT ALL ON TABLE "public"."datasets" TO "anon";
GRANT ALL ON TABLE "public"."datasets" TO "authenticated";
GRANT ALL ON TABLE "public"."datasets" TO "service_role";



GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."unors" TO "anon";
GRANT ALL ON TABLE "public"."unors" TO "authenticated";
GRANT ALL ON TABLE "public"."unors" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































