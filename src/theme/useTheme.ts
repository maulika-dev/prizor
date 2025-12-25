import { useColorScheme } from 'react-native';

import { getThemeColors, ThemeColors } from './colors';

export const useThemeColors = (): ThemeColors => {
  const scheme = useColorScheme();

  return getThemeColors(scheme ?? 'light');
};
