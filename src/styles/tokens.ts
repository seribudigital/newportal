/**
  Islamic Integrated School Portal Design Tokens
  Palet warna:
  - Hijau Zamrud / Emerald (Primary): Nuansa Islami & menenangkan
  - Emas / Gold (Accent): Kesan elegan & prestasi
  - Krem / Off-white (Background/Surface): Warm, bersih & lapang
*/

export const colorTokens = {
  emerald: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  cream: {
    50: '#fffdfa',
    100: '#fdfbf7',
    200: '#f7f4ec',
    300: '#efebe1',
    400: '#e2dcca',
  },
  jenjang: {
    tkit: { primary: '#10b981', accent: '#f59e0b', bg: '#ecfdf5' }, // Hijau muda Segar
    sdit: { primary: '#0284c7', accent: '#f59e0b', bg: '#f0f9ff' }, // Biru Cerdas
    mts: { primary: '#0f766e', accent: '#d97706', bg: '#f0fdfa' },  // Teal Berwawasan
    ma: { primary: '#15803d', accent: '#b45309', bg: '#f0fdf4' },   // Hijau Zamrud Matang
  },
} as const;

export const spacingTokens = {
  containerPadding: 'px-4 sm:px-6 lg:px-8',
  sectionGap: 'py-12 md:py-20',
} as const;
