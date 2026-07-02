import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Prestasi, Pengurus, JenjangId } from '@/types';

export async function getPrestasiList(jenjangId?: JenjangId): Promise<Prestasi[]> {
  let q = collection(db, 'prestasi');
  if (jenjangId) {
    const customQuery = query(q, where('jenjangId', '==', jenjangId));
    const snap = await getDocs(customQuery);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prestasi));
  }
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prestasi));
}

export async function getPengurusYayasan(): Promise<Pengurus[]> {
  const q = collection(db, 'pengurus');
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Pengurus));
}

export interface PesanKontak {
  id?: string;
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  createdAt?: Date;
}

export async function submitPesanKontak(pesan: Omit<PesanKontak, 'id' | 'createdAt'>): Promise<string> {
  const newPesan = {
    ...pesan,
    createdAt: new Date(),
  };
  const docRef = await addDoc(collection(db, 'pesanKontak'), newPesan);
  return docRef.id;
}
