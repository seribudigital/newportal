import { 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PendaftaranPPDB, JenjangId, StatusPPDB, DataCalonSiswa, DataOrangTua, BerkasPPDB } from '@/types';

const COLLECTION_NAME = 'pendaftaranPPDB';

/**
 * Generate nomor pendaftaran unik format: PPDB-{JENJANG}-{YYYYMMDD}-{RANDOM4}
 */
export function generateNomorPendaftaran(jenjangId: JenjangId): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random4 = Math.floor(1000 + Math.random() * 9000).toString();
  return `PPDB-${jenjangId.toUpperCase()}-${dateStr}-${random4}`;
}

export interface SubmitPPDBPayload {
  jenjangId: JenjangId;
  calonSiswa: DataCalonSiswa;
  orangTua: DataOrangTua;
  berkas: BerkasPPDB[];
  catatanPendaftar?: string;
}

export async function submitPendaftaran(payload: SubmitPPDBPayload): Promise<{ id: string; nomorPendaftaran: string }> {
  const nomorPendaftaran = generateNomorPendaftaran(payload.jenjangId);

  // Fallback / backwards compatibility fields
  const namaCalon = payload.calonSiswa.namaLengkap;
  const dataOrangTuaMap: Record<string, string> = {
    namaAyah: payload.orangTua.namaAyah,
    namaIbu: payload.orangTua.namaIbu,
    nomorWhatsApp: payload.orangTua.nomorWhatsApp,
    email: payload.orangTua.email || '',
    pekerjaanAyah: payload.orangTua.pekerjaanAyah || '',
  };
  const berkasUrls = payload.berkas.map(b => b.url);

  const newRecord = {
    nomorPendaftaran,
    jenjangId: payload.jenjangId,
    status: 'baru' as StatusPPDB,
    calonSiswa: payload.calonSiswa,
    orangTua: payload.orangTua,
    berkas: payload.berkas,
    catatanPendaftar: payload.catatanPendaftar || '',
    catatanAdmin: '',
    submitterType: 'public',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    // Legacy fields
    namaCalon,
    dataOrangTua: dataOrangTuaMap,
    berkasUrls,
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newRecord);
  return { id: docRef.id, nomorPendaftaran };
}

export async function getPendaftaranList(jenjangId?: JenjangId, statusFilter?: StatusPPDB): Promise<PendaftaranPPDB[]> {
  let q;
  if (jenjangId && statusFilter) {
    q = query(
      collection(db, COLLECTION_NAME), 
      where('jenjangId', '==', jenjangId),
      where('status', '==', statusFilter),
      orderBy('createdAt', 'desc')
    );
  } else if (jenjangId) {
    q = query(
      collection(db, COLLECTION_NAME), 
      where('jenjangId', '==', jenjangId),
      orderBy('createdAt', 'desc')
    );
  } else if (statusFilter) {
    q = query(
      collection(db, COLLECTION_NAME), 
      where('status', '==', statusFilter),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  }

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PendaftaranPPDB));
}

export async function getPendaftaranById(id: string): Promise<PendaftaranPPDB | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as PendaftaranPPDB;
}

export async function updateStatusPendaftaran(
  id: string, 
  status: StatusPPDB, 
  catatanAdmin?: string
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { 
    status,
    catatanAdmin: catatanAdmin || '',
    updatedAt: serverTimestamp()
  });

  // Trigger notification stub
  getPendaftaranById(id).then(doc => {
    if (doc) sendPPDBStatusNotificationStub(doc);
  }).catch(err => console.error("Error notification trigger:", err));
}

/**
 * Stub Notifikasi Email / WhatsApp Status PPDB (Opsional)
 * TODO: Integrasi dengan SendGrid / Firebase Cloud Function / WhatsApp Gateway jika sudah disiapkan serverless backend.
 */
export async function sendPPDBStatusNotificationStub(pendaftaran: PendaftaranPPDB): Promise<boolean> {
  console.log(`[STUB NOTIFIKASI PPDB] Status pendaftaran ${pendaftaran.nomorPendaftaran} (${pendaftaran.calonSiswa?.namaLengkap}) diubah menjadi: ${pendaftaran.status}. WA Destination: ${pendaftaran.orangTua?.nomorWhatsApp}`);
  return true;
}

