import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Query 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Berita, JenjangId } from '@/types';

const COLLECTION_NAME = 'berita';

export async function getBeritaList(jenjangId?: JenjangId, onlyPublished = true): Promise<Berita[]> {
  try {
    let q: Query = collection(db, COLLECTION_NAME);
    if (jenjangId) {
      q = query(collection(db, COLLECTION_NAME), where('jenjangId', '==', jenjangId));
    }

    const querySnapshot = await getDocs(q);
    const results: Berita[] = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as object) } as unknown as Berita));
    
    // Sort in memory by date descending safely without requiring composite index
    results.sort((a, b) => {
      const timeA = a.tanggal?.seconds ? a.tanggal.seconds * 1000 : (a.tanggal ? new Date(a.tanggal as any).getTime() : 0);
      const timeB = b.tanggal?.seconds ? b.tanggal.seconds * 1000 : (b.tanggal ? new Date(b.tanggal as any).getTime() : 0);
      return timeB - timeA;
    });

    if (onlyPublished) {
      return results.filter(b => b.status === 'published');
    }
    return results;
  } catch (err) {
    console.error('Error fetching berita list:', err);
    return [];
  }
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...(docSnap.data() as object) } as unknown as Berita;
    }
  } catch (err) {
    console.error('Error fetching berita by slug:', err);
  }
  return null;
}

export async function createBerita(data: Omit<Berita, 'id'>): Promise<string> {
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );
  const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanData);
  return docRef.id;
}

export async function updateBerita(id: string, data: Partial<Berita>): Promise<void> {
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, cleanData);
}

export async function deleteBerita(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
