import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';

import ThemedText from '../components/ThemedText';
import InputField from '../components/InputField';
import ThemedButton from '../components/ThemedButton';
import { useThemeColors } from '../theme/useTheme';

type LoginScreenProps = {
  onContinue: (mobile: string) => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onContinue }) => {
  const scheme = useColorScheme();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [mobileNumber, setMobileNumber] = useState('');
  const [agree, setAgree] = useState(false);

  const statusBarStyle = scheme === 'dark' ? 'light-content' : 'dark-content';
  const canContinue = mobileNumber.replace(/\D/g, '').length >= 10 && agree;
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={[styles.safeArea, styles.screenBackground]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={statusBarStyle} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 24, android: 0 })}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 32 },
          ]}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoShell}>
            <ThemedText variant="title" style={styles.brandText}>
              PRIZOR
            </ThemedText>
            <ThemedText muted style={styles.tagline}>
              A Spy You Can Trust
            </ThemedText>
          </View>

          <View style={styles.cardShadowWrapper}>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, shadowColor: colors.cardShadow },
              ]}>
              <View style={styles.loginRow}>
                <ThemedText variant="title" style={styles.loginHeading}>
                  Login
                </ThemedText>
                <View style={styles.loginLineContainer}>
                  <View style={[styles.loginLine, { backgroundColor: colors.divider }]} />
                  <View style={[styles.loginDot, { backgroundColor: colors.divider }]} />
                </View>
              </View>

              <InputField
                label="Mobile number"
                placeholder="9974432111"
                keyboardType="number-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                containerStyle={styles.inputContainer}
                leftAdornment={
                  <View style={styles.countryCode}>
                    <ThemedText style={styles.cc}>+91</ThemedText>
                    <ChevronDown
                      color={colors.mutedText}
                      size={18}
                      strokeWidth={2}
                      style={styles.chevron}
                    />
                  </View>
                }
                rightAdornment={
                  mobileNumber.length > 0 ? (
                    <Pressable onPress={() => setMobileNumber('')}>
                      <ThemedText style={styles.clear}>✕</ThemedText>
                    </Pressable>
                  ) : null
                }
              />

              <Pressable style={styles.emailLink}>
                <ThemedText style={[styles.linkText, { color: colors.primary }]}>
                  By Email
                </ThemedText>
              </Pressable>

              <ThemedButton
                label="Continue"
                onPress={() => onContinue(mobileNumber)}
                disabled={!canContinue}
                style={[styles.primaryButton, { backgroundColor: colors.secondary }]}
              />

              <View style={styles.noteRow}>
                <Pressable
                  style={[
                    styles.checkbox,
                    { borderColor: colors.primary },
                  ]}
                  onPress={() => setAgree(prev => !prev)}>
                  {agree ? (
                    <View
                      style={[
                        styles.checkboxInner,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  ) : null}
                </Pressable>
                <ThemedText muted style={styles.noteText}>
                  Please note that by Logging in, you hereby agree to our{' '}
                  <ThemedText style={[styles.linkText, styles.inlineLink, { color: colors.primary }]}>
                    User Agreement
                  </ThemedText>{' '}
                  and{' '}
                  <ThemedText style={[styles.linkText, styles.inlineLink, { color: colors.primary }]}>
                    Privacy Policy
                  </ThemedText>
                </ThemedText>
              </View>

              <View style={styles.termsRow}>
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                <View style={[styles.orCircle, { borderColor: colors.divider }]}>
                  <ThemedText muted>or</ThemedText>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              </View>

              <View style={styles.actionsRow}>
                <View style={[styles.circleButtonDark, { backgroundColor: colors.text }]}>
                  <ThemedText style={styles.circleText}>👤</ThemedText>
                </View>
                <View style={[styles.circleButtonAccent, { backgroundColor: colors.primary }]}>
                  <ThemedText style={styles.circleText}>👥</ThemedText>
                </View>
              </View>

              <View style={styles.actionsLabels}>
                <ThemedText style={styles.actionLabel}>Other Login</ThemedText>
                <ThemedText style={styles.actionLabel}>Guest Login</ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    screenBackground: { backgroundColor: colors.background },
    flex: { flex: 1 },
    content: { paddingHorizontal: 20, paddingTop: 24 },
    logoShell: { alignItems: 'center', marginBottom: 16 },
    brandText: { marginTop: 8, fontSize: 26, fontWeight: '700', letterSpacing: 1 },
    tagline: { marginTop: 4, fontSize: 14 },
    cardShadowWrapper: { flex: 1 },
    card: {
      borderWidth: 0,
      borderRadius: 24,
      padding: 22,
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      marginTop: 10,
    },
    inputContainer: { marginTop: 6 },
    loginRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    loginHeading: { fontSize: 22, fontWeight: '700', marginRight: 12 },
    loginLineContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    loginLine: { width: 50, height: 1, marginTop: -10 },
    loginDot: { width: 4, height: 4, borderRadius: 2, marginLeft: 2, marginTop: -10 },
    cc: { color: colors.text, fontWeight: '700', fontSize: 16, marginRight: 4 },
    chevron: { marginLeft: 2 },
    clear: { color: colors.mutedText, fontSize: 16, paddingLeft: 6 },
    emailLink: { alignSelf: 'flex-end', marginTop: 6, marginBottom: 12 },
    linkText: { fontWeight: '600' },
    inlineLink: { textDecorationLine: 'none' },
    primaryButton: { borderRadius: 10, marginTop: 4 },
    noteRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
      marginRight: 10,
    },
    checkboxInner: { width: 10, height: 10, borderRadius: 5 },
    noteText: { flex: 1, fontSize: 13, lineHeight: 20 },
    termsRow: { marginTop: 22, flexDirection: 'row', alignItems: 'center' },
    divider: { flex: 1, height: 1 },
    orCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
    },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 18 },
    circleButtonDark: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleButtonAccent: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleText: { color: colors.primaryText, fontSize: 22 },
    actionsLabels: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 },
    actionLabel: { fontSize: 13, fontWeight: '600' },
  });

export default LoginScreen;
