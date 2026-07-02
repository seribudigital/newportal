import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Guru, JenjangId } from '@/types';

const COLLECTION_NAME = 'guru';

export async function getGuruList(jenjangId?: JenjangId): Promise<Guru[]> {
  let q = collection(db, COLLECTION_NAME);
  if (jenjangId) {
    const customQuery = query(q, where('jenjangId', '==', jenjangId));
    const snap = await getDocs(customQuery);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guru));
  }
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guru));
}

export async function createGuru(data: Omit<Guru, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION_NAME), data);
  return ref.id;
}

export async function updateGuru(id: string, data: Partial<Guru>): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), data);
}

export async function deleteGuru(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
