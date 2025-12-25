import { ColorSchemeName } from 'react-native';

export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  cardShadow: string;
  primary: string;
  primaryText: string;
  secondary: string;
  secondaryText: string;
  success: string;
  warning: string;
  danger: string;
  overlayStrong: string;
  overlayMedium: string;
  text: string;
  mutedText: string;
  border: string;
  inputBackground: string;
  placeholder: string;
  icon: string;
  accentBackground: string;
  divider: string;
};

export const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#ffffff',
  card: '#ffffff',
  cardShadow: 'rgba(16, 24, 40, 0.08)',
  primary: '#f7931a',
  primaryText: '#ffffff',
  secondary: '#4b82d3',
  secondaryText: '#ffffff',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#ef4444',
  overlayStrong: 'rgba(0,0,0,0.55)',
  overlayMedium: 'rgba(0,0,0,0.2)',
  text: '#1c2433',
  mutedText: '#6b7280',
  border: '#e5e7eb',
  inputBackground: '#f9fafb',
  placeholder: '#9ca3af',
  icon: '#f7931a',
  accentBackground: '#fff2e0',
  divider: '#e5e7eb',
};

export const darkColors: ThemeColors = {
  background: '#0f172a',
  surface: '#111827',
  card: '#1f2937',
  cardShadow: 'rgba(0, 0, 0, 0.4)',
  primary: '#f7b046',
  primaryText: '#0b0f1a',
  secondary: '#6ea2ff',
  secondaryText: '#0b0f1a',
  success: '#22c55e',
  warning: '#fbbf24',
  danger: '#f87171',
  overlayStrong: 'rgba(0,0,0,0.65)',
  overlayMedium: 'rgba(255,255,255,0.08)',
  text: '#e5e7eb',
  mutedText: '#9ca3af',
  border: '#334155',
  inputBackground: '#111827',
  placeholder: '#94a3b8',
  icon: '#f7b046',
  accentBackground: '#1b2838',
  divider: '#334155',
};

export const getThemeColors = (scheme: ColorSchemeName): ThemeColors =>
  scheme === 'dark' ? darkColors : lightColors;
