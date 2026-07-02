import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { GlobalSettings } from '@/types';

export const DEFAULT_SETTINGS: GlobalSettings = {
  namaYayasan: 'Yayasan Islam Terpadu Al-Khoir',
  alamat: 'Perum Cikande Permai Blok T9 Bandung Serang Banten',
  telepon: '(021) 7890-1234',
  email: 'info@alkhoir.sch.id',
  singkatanYayasan: 'Al-Khoir',
  tagline: 'Mewujudkan generasi Rabbani yang berakhlak mulia, unggul dalam sains & Qur’an, serta siap menjadi pemimpin masa depan.',
};

export async function getGlobalSettings(): Promise<GlobalSettings> {
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...DEFAULT_SETTINGS,
        ...(docSnap.data() as Partial<GlobalSettings>),
      };
    }
  } catch (error) {
    console.warn('Error fetching global settings from Firestore, using defaults:', error);
  }

  return DEFAULT_SETTINGS;
}

export async function updateGlobalSettings(settings: GlobalSettings): Promise<void> {
  const docRef = doc(db, 'settings', 'global');
  await setDoc(docRef, settings, { merge: true });
}
