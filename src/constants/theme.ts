import { Platform } from 'react-native';

export type Theme = {
  bg: string;
  card: string;
  tile: string;
  text: string;
  muted: string;
  primary: string; // gold
  onPrimary: string;
  accent: string;
  border: string;
  danger: string;
  success: string;
};

// Luxury dark "espresso & gold" palette. The app is always dark (see app.json).
const theme: Theme = {
  bg: '#0F0B09',
  card: '#1A1410',
  tile: '#2A1F17',
  text: '#F6EDE3',
  muted: '#A8998B',
  primary: '#D4A762',
  onPrimary: '#1A120C',
  accent: '#E9CF9F',
  border: '#2E241C',
  danger: '#E57373',
  success: '#7BC47F',
};

export const gradients = {
  hero: ['#3A2618', '#0F0B09'] as const,
  art: ['#3A2A1E', '#17110D'] as const,
  welcome: ['#3A2618', '#1A120C', '#0F0B09'] as const,
  // Dark fade placed on top of photos so text stays readable.
  photoFade: ['rgba(15,11,9,0)', 'rgba(15,11,9,0.55)', 'rgba(15,11,9,0.96)'] as const,
  photoFadeSoft: ['rgba(15,11,9,0.25)', 'rgba(15,11,9,0.2)', '#0F0B09'] as const,
};

/** Elegant serif for headlines (no font download needed). */
export const fonts = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, "Times New Roman", serif' }) as string,
};

export function useTheme(): Theme {
  return theme;
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 } as const;

export function formatPrice(n: number): string {
  return `Rs ${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
