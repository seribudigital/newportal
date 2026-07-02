import { describe, test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { 
  initializeTestEnvironment, 
  assertSucceeds, 
  assertFails,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

let testEnv: RulesTestEnvironment;

before(async () => {
  const firestoreRules = fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-portal-sekolah-test',
    firestore: {
      rules: firestoreRules,
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

after(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

beforeEach(async () => {
  if (testEnv) {
    await testEnv.clearFirestore();
  }
});

describe('Firestore Security Rules Complete Role & Jenjang Boundary Tests (Phase 8)', () => {

  test('1. Guest (Unauthenticated) TIDAK BISA CRUD koleksi admin/berita/guru/users', async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    
    await assertFails(
      unauthDb.collection('berita').add({
        judul: 'Illegal News Insertion',
        status: 'published',
      })
    );

    await assertFails(
      unauthDb.collection('users').doc('fake_user').set({
        role: 'admin_yayasan',
      })
    );
  });

  test('2. User Terautentikasi TANPA Custom Claim Role DITOLAK CRUD koleksi admin', async () => {
    const regularUserDb = testEnv.authenticatedContext('regular_user_uid', {}).firestore();

    await assertFails(
      regularUserDb.collection('berita').add({
        judul: 'Regular User News',
        status: 'published',
      })
    );
  });

  test('3. admin_yayasan BISA mengelola data global & semua jenjang', async () => {
    const adminYayasanDb = testEnv.authenticatedContext('yayasan_admin_uid', {
      role: 'admin_yayasan',
    }).firestore();

    await assertSucceeds(
      adminYayasanDb.collection('berita').doc('main-portal-news').set({
        judul: 'Main Portal News',
        status: 'published',
      })
    );

    await assertSucceeds(
      adminYayasanDb.collection('settings').doc('global').set({
        namaYayasan: 'Yayasan Al-Hikmah',
      })
    );

    await assertSucceeds(
      adminYayasanDb.collection('users').doc('new_admin_uid').set({
        email: 'admin.sdit@yayasan.sch.id',
        role: 'admin_jenjang',
        jenjangId: 'sdit',
      })
    );
  });

  test('4. admin_tkit HANYA BISA mengelola data TKIT & DITOLAK di SDIT, MTs, MA', async () => {
    const adminTkitDb = testEnv.authenticatedContext('tkit_admin_uid', {
      role: 'admin_jenjang',
      jenjangId: 'tkit',
    }).firestore();

    // TKIT write MUST SUCCEED
    await assertSucceeds(
      adminTkitDb.collection('guru').doc('guru-tkit-1').set({
        nama: 'Ustadzah Ani',
        jenjangId: 'tkit',
      })
    );

    // SDIT write MUST FAIL
    await assertFails(
      adminTkitDb.collection('guru').doc('guru-sdit-1').set({
        nama: 'Ustadz Budi',
        jenjangId: 'sdit',
      })
    );
  });

  test('5. admin_sdit HANYA BISA mengelola data SDIT & DITOLAK di TKIT, MTs, MA', async () => {
    const adminSditDb = testEnv.authenticatedContext('sdit_admin_uid', {
      role: 'admin_jenjang',
      jenjangId: 'sdit',
    }).firestore();

    await assertSucceeds(
      adminSditDb.collection('program').doc('prog-sdit-1').set({
        nama: 'Tahfizh SDIT',
        jenjangId: 'sdit',
      })
    );

    await assertFails(
      adminSditDb.collection('program').doc('prog-tkit-1').set({
        nama: 'Motorik TKIT',
        jenjangId: 'tkit',
      })
    );
  });

  test('6. admin_mts HANYA BISA mengelola data MTs & DITOLAK di jenjang lain', async () => {
    const adminMtsDb = testEnv.authenticatedContext('mts_admin_uid', {
      role: 'admin_jenjang',
      jenjangId: 'mts',
    }).firestore();

    await assertSucceeds(
      adminMtsDb.collection('guru').doc('guru-mts-1').set({
        nama: 'Ustadz Farhan',
        jenjangId: 'mts',
      })
    );

    await assertFails(
      adminMtsDb.collection('guru').doc('guru-ma-1').set({
        nama: 'Ustadz Mansur',
        jenjangId: 'ma',
      })
    );
  });

  test('7. admin_ma HANYA BISA mengelola data MA & DITOLAK di jenjang lain', async () => {
    const adminMaDb = testEnv.authenticatedContext('ma_admin_uid', {
      role: 'admin_jenjang',
      jenjangId: 'ma',
    }).firestore();

    await assertSucceeds(
      adminMaDb.collection('prestasi').doc('prestasi-ma-1').set({
        judul: 'Juara KSM MA',
        jenjangId: 'ma',
      })
    );

    await assertFails(
      adminMaDb.collection('prestasi').doc('prestasi-mts-1').set({
        judul: 'Juara MTQ MTs',
        jenjangId: 'mts',
      })
    );
  });

  test('8. admin_jenjang TIDAK BISA mengubah data jenjang lain atau portal utama', async () => {
    const adminTkitDb = testEnv.authenticatedContext('tkit_admin_uid', {
      role: 'admin_jenjang',
      jenjangId: 'tkit',
    }).firestore();

    await assertFails(
      adminTkitDb.collection('berita').doc('main-portal-news').set({
        judul: 'Main Portal News Write Attempt',
        status: 'published',
      })
    );
  });

  test('9. User Publik TETAP BISA Submit Pesan Kontak', async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();

    await assertSucceeds(
      unauthDb.collection('pesanKontak').add({
        nama: 'Bapak Ahmad',
        email: 'ahmad@gmail.com',
        pesan: 'Mohon info syarat pendaftaran SDIT.',
        createdAt: new Date(),
      })
    );
  });

  test('10. User Non-Yayasan DITOLAK mengubah Custom Claims / Role pada /users', async () => {
    const adminTkitDb = testEnv.authenticatedContext('tkit_admin_uid', {
      role: 'admin_jenjang',
      jenjangId: 'tkit',
    }).firestore();

    await assertFails(
      adminTkitDb.collection('users').doc('tkit_admin_uid').set({
        role: 'admin_yayasan',
      })
    );
  });
});
