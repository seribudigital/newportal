import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  query,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Jenjang, JenjangId } from '@/types';
import { INITIAL_JENJANG } from '@/lib/seedData';

const COLLECTION_NAME = 'jenjang';

export async function getSemuaJenjang(): Promise<Jenjang[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id as JenjangId, ...doc.data() } as Jenjang));
    }
  } catch (err) {
    console.warn("Firestore fetch error for getSemuaJenjang, using default fallback data:", err);
  }
  return INITIAL_JENJANG;
}

export async function getJenjangById(id: JenjangId): Promise<Jenjang | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id as JenjangId, ...docSnap.data() } as Jenjang;
    }
  } catch (err) {
    console.warn(`Firestore fetch error for getJenjangById(${id}), using fallback:`, err);
  }
  return INITIAL_JENJANG.find(j => j.id === id) || null;
}

export async function getJenjangBySlug(slug: string): Promise<Jenjang | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id as JenjangId, ...docSnap.data() } as Jenjang;
    }
  } catch (err) {
    console.warn(`Firestore fetch error for getJenjangBySlug(${slug}), using fallback:`, err);
  }
  return INITIAL_JENJANG.find(j => j.slug === slug || j.id === slug) || null;
}

export async function upsertJenjang(data: Jenjang): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, data.id);
  await setDoc(docRef, data, { merge: true });
}
