import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Berita, JenjangId } from '@/types';

const COLLECTION_NAME = 'berita';

export async function getBeritaList(jenjangId?: JenjangId, onlyPublished = true): Promise<Berita[]> {
  let q = query(collection(db, COLLECTION_NAME), orderBy('tanggal', 'desc'));
  
  if (jenjangId) {
    q = query(collection(db, COLLECTION_NAME), where('jenjangId', '==', jenjangId), orderBy('tanggal', 'desc'));
  }

  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Berita));
  
  if (onlyPublished) {
    return results.filter(b => b.status === 'published');
  }
  return results;
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Berita;
  }
  return null;
}

export async function createBerita(data: Omit<Berita, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
  return docRef.id;
}

export async function updateBerita(id: string, data: Partial<Berita>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
}

export async function deleteBerita(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
