import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import ThemedButton from '../components/ThemedButton';
import ThemedText from '../components/ThemedText';
import { useThemeColors } from '../theme/useTheme';

type OtpScreenProps = {
  mobile: string;
  onBack: () => void;
  onVerify: (otp: string) => void;
};

const OTP_LENGTH = 6;

const OtpScreen: React.FC<OtpScreenProps> = ({ mobile, onBack, onVerify }) => {
  const colors = useThemeColors();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleChange = (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = sanitized;
    setOtp(nextOtp);

    if (sanitized && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const joinedOtp = otp.join('');
  const canVerify = joinedOtp.length === OTP_LENGTH;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 24, android: 0 })}>
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <View style={styles.header}>
            <ArrowLeft color={colors.text} size={26} strokeWidth={2.4} onPress={onBack} />
          </View>

          <View style={styles.logoShell}>
            <ThemedText variant="title" style={styles.brandText}>
              PRIZOR
            </ThemedText>
            <ThemedText muted style={styles.tagline}>
              The Future of Smart Living
            </ThemedText>
          </View>

          <View style={styles.card}>
            <View style={styles.titleRow}>
              <ThemedText variant="title">Enter OTP</ThemedText>
              <View style={[styles.titleLine, { backgroundColor: colors.divider }]} />
            </View>

            <ThemedText muted style={styles.sentText}>
              OTP has been sent to{' '}
              <ThemedText style={styles.boldText}>+91-{mobile}</ThemedText>
            </ThemedText>

            <View style={styles.otpRow}>
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={ref => {
                    inputs.current[idx] = ref;
                  }}
                  value={digit}
                  onChangeText={val => handleChange(val, idx)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.otpBox,
                    {
                      borderColor: digit ? colors.secondary : colors.divider,
                    },
                  ]}
                  textAlign="center"
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(idx);
                    }
                  }}
                />
              ))}
            </View>

            <View style={styles.timerRow}>
              <ThemedText style={[styles.timerText, { color: colors.secondary }]}>
                118s
              </ThemedText>
            </View>

            <ThemedButton
              label="Verify"
              onPress={() => onVerify(joinedOtp)}
              disabled={!canVerify}
              style={[styles.verifyButton, { backgroundColor: colors.secondary }]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    flex: { flex: 1 },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    header: {
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    logoShell: {
      alignItems: 'center',
      marginBottom: 10,
    },
    brandText: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    tagline: {
      marginTop: 6,
      fontSize: 14,
    },
    card: {
      marginTop: 10,
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 20,
      shadowColor: colors.cardShadow,
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    titleLine: {
      flex: 1,
      height: 1,
      marginLeft: 10,
    },
    sentText: {
      marginBottom: 18,
      fontSize: 16,
    },
    boldText: {
      fontWeight: '700',
    },
    otpRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    otpBox: {
      width: 52,
      height: 60,
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 22,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    timerRow: {
      alignItems: 'flex-end',
      marginTop: 6,
      marginBottom: 18,
    },
    timerText: {
      fontSize: 14,
      fontWeight: '600',
    },
    verifyButton: {
      marginTop: 4,
      borderRadius: 12,
    },
  });

export default OtpScreen;
