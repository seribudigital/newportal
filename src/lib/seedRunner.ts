import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { INITIAL_JENJANG } from './seedData';

export async function runSeed(): Promise<{ success: boolean; message: string }> {
  try {
    for (const item of INITIAL_JENJANG) {
      const docRef = doc(db, 'jenjang', item.id);
      await setDoc(docRef, item, { merge: true });
    }
    return { success: true, message: 'Seed data 4 jenjang berhasil dimasukkan ke Firestore.' };
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    return { success: false, message: (error as Error).message };
  }
}
