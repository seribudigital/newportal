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
import type { Program, Siswa, Pengurus, Agenda, Prestasi, JenjangId } from '@/types';

// Generic helper for straightforward Firestore collections
export async function getCollectionByJenjang<T>(collectionName: string, jenjangId?: JenjangId): Promise<T[]> {
  let q = collection(db, collectionName);
  if (jenjangId) {
    const customQuery = query(q, where('jenjangId', '==', jenjangId));
    const snap = await getDocs(customQuery);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
  }
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
}

export async function createDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), data);
  return ref.id;
}

export async function updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
  await updateDoc(doc(db, collectionName, id), data);
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}
