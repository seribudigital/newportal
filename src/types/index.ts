import type { Timestamp } from 'firebase/firestore';

export type Role = 'admin_yayasan' | 'admin_jenjang';
export type JenjangId = 'tkit' | 'sdit' | 'mts' | 'ma';
export type StatusKonten = 'draft' | 'published';
export type StatusPPDB = 'baru' | 'diverifikasi' | 'diterima' | 'ditolak';
export type KategoriProgram = 'kurikulum' | 'unggulan' | 'jurusan' | 'ekskul';

export interface UserProfile {
  uid: string;
  nama: string;
  email: string;
  role: Role;
  jenjangId?: JenjangId;
}

export interface GlobalSettings {
  namaYayasan: string;
  alamat: string;
  telepon: string;
  email: string;
  singkatanYayasan?: string;
  tagline?: string;
}

export interface Jenjang {
  id: JenjangId;
  nama: string;
  slug: string;
  deskripsi: string;
  visiMisi: string; // rich text
  warnaAksen: string;
  logoUrl: string;
  kepalaSekolah: string;
  akreditasi: string;
}

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  jenjangId?: JenjangId; // kosong = berita yayasan
  tanggal: Timestamp;
  gambarUtamaUrl: string;
  ringkasan: string;
  isi: string; // rich text
  status: StatusKonten;
  createdBy: string;
  updatedAt: Timestamp;
}

export interface Guru {
  id: string;
  nama: string;
  fotoUrl: string;
  jabatan: string;
  jenjangId: JenjangId;
  mataPelajaran: string;
}

export interface Siswa {
  id: string;
  nama: string;
  fotoUrl: string;
  jenjangId: JenjangId;
  kelas: string;
  tahunAjaran: string;
}

export interface Pengurus {
  id: string;
  nama: string;
  fotoUrl: string;
  organisasi: string; // misal: Yayasan, OSIS, Pramuka
  jabatan: string;
  jenjangId?: JenjangId; // kosong = pengurus yayasan
  periode: string;
}

export interface Program {
  id: string;
  nama: string;
  jenjangId: JenjangId;
  kategori: KategoriProgram;
  deskripsi: string;
  ikonUrl: string;
}

export interface Agenda {
  id: string;
  judul: string;
  tanggalMulai: Timestamp;
  tanggalSelesai?: Timestamp;
  lokasi: string;
  jenjangId?: JenjangId;
  deskripsi: string;
  status: StatusKonten;
}

export interface Galeri {
  id: string;
  judul: string;
  imageUrl: string;
  jenjangId?: JenjangId; // kosong = galeri yayasan
  tanggal: Timestamp;
  keterangan?: string;
}

export interface Prestasi {
  id: string;
  judul: string;
  pemenang: string; // nama siswa/tim
  tingkat: 'Kecamatan' | 'Kota/Kab' | 'Provinsi' | 'Nasional' | 'Internasional';
  tahun: string;
  jenjangId: JenjangId;
  imageUrl?: string;
}

export interface BerkasPPDB {
  nama: string;         // e.g. "Kartu Keluarga", "Akta Kelahiran", "Pas Foto", "Ijazah / Rapor"
  url: string;          // Download URL dari Firebase Storage
  path: string;         // Storage reference path
  fileSize?: number;    // Ukuran file dalam bytes
  fileType?: string;    // MIME type
}

export interface DataCalonSiswa {
  namaLengkap: string;
  namaPanggilan?: string;
  nisn?: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: string;
  alamatLengkap: string;
  sekolahAsal?: string;
}

export interface DataOrangTua {
  namaAyah: string;
  pekerjaanAyah?: string;
  namaIbu: string;
  pekerjaanIbu?: string;
  namaWali?: string;
  nomorWhatsApp: string;
  email?: string;
  alamatOrtu?: string;
}

export interface PendaftaranPPDB {
  id: string;
  nomorPendaftaran: string;
  jenjangId: JenjangId;
  status: StatusPPDB;
  calonSiswa: DataCalonSiswa;
  orangTua: DataOrangTua;
  berkas: BerkasPPDB[];
  catatanPendaftar?: string;
  catatanAdmin?: string;
  submitterType: 'public';
  createdAt: Timestamp;
  updatedAt?: Timestamp;

  // Backwards compatibility helpers
  namaCalon?: string;
  dataOrangTua?: Record<string, string>;
  berkasUrls?: string[];
}

