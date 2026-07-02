import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Galeri, JenjangId } from '@/types';

const COLLECTION_NAME = 'galeri';

export async function getGaleriList(jenjangId?: JenjangId, limitCount?: number): Promise<Galeri[]> {
  let q = query(collection(db, COLLECTION_NAME), orderBy('tanggal', 'desc'));
  
  if (jenjangId) {
    q = query(collection(db, COLLECTION_NAME), where('jenjangId', '==', jenjangId), orderBy('tanggal', 'desc'));
  }

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Galeri));
}

export async function createGaleri(data: Omit<Galeri, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION_NAME), data);
  return ref.id;
}

export async function deleteGaleri(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
