import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { useThemeColors } from '../theme/useTheme';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'button' | 'link';

type Props = TextProps & {
  variant?: TextVariant;
  muted?: boolean;
};

export const ThemedText: React.FC<Props> = ({
  variant = 'body',
  muted = false,
  style,
  children,
  ...rest
}) => {
  const colors = useThemeColors();
  const variantStyle = styles[variant];
  const color = muted ? colors.mutedText : colors.text;

  return (
    <Text
      {...rest}
      style={[
        { color },
        variantStyle,
        variant === 'link' && styles.link,
        style,
      ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default ThemedText;
