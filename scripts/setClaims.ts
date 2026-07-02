import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import type { Role, JenjangId } from '../src/types';

dotenv.config({ path: '.env.local' });

if (!getApps().length) {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountEnv) {
    try {
      const sa = JSON.parse(serviceAccountEnv);
      initializeApp({ credential: cert(sa) });
    } catch {
      initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
    }
  } else {
    initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-portal-sekolah' });
  }
}

const auth = getAuth();
const db = getFirestore();

async function main() {
  const args = process.argv.slice(2);
  const identifier = args[0]; // email or uid
  const role = args[1] as Role;
  const jenjangId = args[2] as JenjangId | undefined;

  if (!identifier || !role) {
    console.error('Usage: npx tsx scripts/setClaims.ts <email|uid> <admin_yayasan|admin_jenjang> [jenjangId]');
    process.exit(1);
  }

  if (role !== 'admin_yayasan' && role !== 'admin_jenjang') {
    console.error("Role must be 'admin_yayasan' or 'admin_jenjang'");
    process.exit(1);
  }

  if (role === 'admin_jenjang' && !jenjangId) {
    console.error("jenjangId (tkit | sdit | mts | ma) is required when role is 'admin_jenjang'");
    process.exit(1);
  }

  try {
    let user;
    if (identifier.includes('@')) {
      user = await auth.getUserByEmail(identifier);
    } else {
      user = await auth.getUser(identifier);
    }

    const claims: { role: Role; jenjangId?: JenjangId } = { role };
    if (role === 'admin_jenjang' && jenjangId) {
      claims.jenjangId = jenjangId;
    }

    // Set custom Auth claims
    await auth.setCustomUserClaims(user.uid, claims);

    // Sync to Firestore UserProfile document
    await db.collection('users').doc(user.uid).set(
      {
        uid: user.uid,
        email: user.email,
        nama: user.displayName || user.email?.split('@')[0] || 'Admin',
        role,
        ...(role === 'admin_jenjang' && jenjangId ? { jenjangId } : {}),
      },
      { merge: true }
    );

    console.log(`✅ Successfully set claims for user ${user.email} (${user.uid}):`, claims);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting claims:', error);
    process.exit(1);
  }
}

main();
