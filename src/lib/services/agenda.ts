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
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Agenda, JenjangId } from '@/types';

const COLLECTION_NAME = 'agenda';

export async function getAgendaList(jenjangId?: JenjangId, onlyUpcoming = true): Promise<Agenda[]> {
  let q = query(collection(db, COLLECTION_NAME), orderBy('tanggalMulai', 'asc'));
  
  if (jenjangId) {
    q = query(collection(db, COLLECTION_NAME), where('jenjangId', '==', jenjangId), orderBy('tanggalMulai', 'asc'));
  }

  const snap = await getDocs(q);
  const results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agenda));
  
  const filtered = results.filter(a => a.status === 'published');

  if (onlyUpcoming) {
    const now = new Date();
    return filtered.filter(a => {
      if (!a.tanggalMulai) return true;
      const date = a.tanggalMulai.toDate ? a.tanggalMulai.toDate() : new Date(a.tanggalMulai as unknown as string);
      return date >= new Date(now.setHours(0, 0, 0, 0));
    });
  }

  return filtered;
}

export async function createAgenda(data: Omit<Agenda, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
  return docRef.id;
}
