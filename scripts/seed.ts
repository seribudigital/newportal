import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { INITIAL_JENJANG } from '../src/lib/seedData';

dotenv.config({ path: '.env.local' });

if (!admin.apps.length) {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountEnv) {
    try {
      const sa = JSON.parse(serviceAccountEnv);
      admin.initializeApp({ credential: admin.credential.cert(sa) });
    } catch {
      admin.initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
    }
  } else {
    admin.initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-portal-sekolah' });
  }
}

const auth = admin.auth();
const db = admin.firestore();

async function seed() {
  console.log('🌱 Starting idempotent seed process via Admin SDK...');

  // Hardening: Ensure bootstrap credentials come strictly from environment variables
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('❌ FATAL ERROR: ADMIN_BOOTSTRAP_EMAIL or ADMIN_BOOTSTRAP_PASSWORD is missing in .env.local!');
    console.error('   Please define both variables before running the seed script.');
    process.exit(1);
  }

  try {
    // 1. Seed 4 Jenjang
    for (const jenjang of INITIAL_JENJANG) {
      await db.collection('jenjang').doc(jenjang.id).set(jenjang, { merge: true });
      console.log(`  - Jenjang ${jenjang.id.toUpperCase()} synced.`);
    }

    // 2. Seed Sample Berita Published & Draft
    const sampleBerita = [
      {
        id: 'berita-selamat-datang',
        judul: 'Selamat Datang di Web Portal Resmi Yayasan Islam Terpadu',
        slug: 'selamat-datang-portal-resmi',
        tanggal: admin.firestore.Timestamp.now(),
        gambarUtamaUrl: '/images/hero-yayasan.jpg',
        ringkasan: 'Portal terpadu penyedia informasi 4 jenjang pendidikan Islam unggulan.',
        isi: '<p>Alhamdulillah, portal resmi sekolah yayasan Islam terpadu telah resmi dibuka untuk umum.</p>',
        status: 'published',
        createdBy: 'system_bootstrap',
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        id: 'berita-tkit-parenting',
        judul: 'Seminar Parenting Islam Terpadu untuk Orang Tua Murid TKIT',
        slug: 'seminar-parenting-tkit',
        jenjangId: 'tkit',
        tanggal: admin.firestore.Timestamp.now(),
        gambarUtamaUrl: '/images/tkit-parenting.jpg',
        ringkasan: 'Mengedukasi orang tua dalam membangun kemandirian dan karakter Rabbani anak usia dini.',
        isi: '<p>Kegiatan parenting diikuti oleh seluruh wali santri TKIT dengan antusiasme tinggi.</p>',
        status: 'published',
        createdBy: 'system_bootstrap',
        updatedAt: admin.firestore.Timestamp.now(),
      }
    ];

    for (const b of sampleBerita) {
      await db.collection('berita').doc(b.id).set(b, { merge: true });
    }

    // 3. Seed Sample Galeri Agregat
    const sampleGaleri = [
      {
        id: 'galeri-yayasan-1',
        judul: 'Upacara Peringatan Hari Pendidikan Islam',
        imageUrl: '/images/galeri-1.jpg',
        tanggal: admin.firestore.Timestamp.now(),
      },
      {
        id: 'galeri-tkit-1',
        judul: 'Manasik Haji Cilik Santri TKIT',
        imageUrl: '/images/galeri-tkit.jpg',
        jenjangId: 'tkit',
        tanggal: admin.firestore.Timestamp.now(),
      }
    ];

    for (const g of sampleGaleri) {
      await db.collection('galeri').doc(g.id).set(g, { merge: true });
    }

    // 4. Seed Sample Prestasi
    const samplePrestasi = [
      {
        id: 'prestasi-ma-1',
        judul: 'Juara 1 Musabaqah Tilawatil Qur’an (MTQ) Nasional',
        pemenang: 'Ahmad Raihan (Santri MA Class XII)',
        tingkat: 'Nasional',
        tahun: '2025',
        jenjangId: 'ma',
      }
    ];

    for (const p of samplePrestasi) {
      await db.collection('prestasi').doc(p.id).set(p, { merge: true });
    }

    // 5. Bootstrap Super Admin securely using ENV vars
    let userRecord: admin.auth.UserRecord;

    try {
      userRecord = await auth.getUserByEmail(adminEmail);
      console.log(`  - Bootstrap Admin ${adminEmail} already exists (${userRecord.uid}).`);
    } catch {
      userRecord = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: 'Super Admin Yayasan',
      });
      console.log(`  - Created new Bootstrap Admin ${adminEmail} (${userRecord.uid}).`);
    }

    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin_yayasan' });
    await db.collection('users').doc(userRecord.uid).set(
      {
        uid: userRecord.uid,
        email: adminEmail,
        nama: 'Super Admin Yayasan',
        role: 'admin_yayasan',
      },
      { merge: true }
    );

    console.log('\n✅ Full Seeding completed securely!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
