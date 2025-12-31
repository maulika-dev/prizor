import React, { useMemo, useRef, useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { sendLoginOtp, verifyOtpAndSetPassword } from '../api/authApi';
import ThemedButton from '../components/ThemedButton';
import ThemedText from '../components/ThemedText';
import { useThemeColors } from '../theme/useTheme';
import { RootRoutes, RootStackParamList } from '../navigation/routes';
import { setAuthToken } from '../store/authStore';
import { resetToAddTab } from '../navigation/navigationRef';
import { CommonActions } from "@react-navigation/native";

type OtpScreenProps = NativeStackScreenProps<RootStackParamList, RootRoutes.Otp>;

const OTP_LENGTH = 6;

const OtpScreen: React.FC<OtpScreenProps> = ({ navigation, route }) => {
	const colors = useThemeColors();
	const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
	const inputs = useRef<Array<TextInput | null>>([]);
	const styles = useMemo(() => createStyles(colors), [colors]);
	const { mobile } = route.params;
	const [resendLoading, setResendLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// const [otp, setOtp] = useState('');
	const hiddenInputRef = useRef<TextInput>(null);

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

	const onResend = async () => {
		if (resendLoading || loading) return;

		try {
			setResendLoading(true);
			setError(null);

			const res = await sendLoginOtp({
				mobile,
				type: 'register',
			});

			if (!res.success) {
				setError(res.message || 'Failed to resend OTP');
			}
		} catch {
			setError('Failed to resend OTP. Please try again.');
		} finally {
			setResendLoading(false);
		}
	};

	const onSubmit = async () => {
		const joinedOtp = otp.join('');

		if (joinedOtp.length < OTP_LENGTH) {
			setError('Please enter the complete OTP');
			return;
		}

		try {
			setLoading(true);
			setError(null);

			console.log(joinedOtp);

			const res = await verifyOtpAndSetPassword({
				otp: joinedOtp,
				mobile,
				// email,
			});

			if (!res.success || !res.authToken) {
				setError(res.message || 'OTP verification failed');
				return;
			}

			if (res.authToken) {
				await setAuthToken(res.authToken);
			}

			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: RootRoutes.AppTabs }],
				})
			);

			// resetToAddTab();
		} catch {
			setError('Something went wrong. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
			<StatusBar barStyle="dark-content" />
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.select({ ios: 24, android: 0 })}
			>
				<ScrollView contentContainerStyle={styles.content} bounces={false} keyboardShouldPersistTaps="handled">
					{/* Top bar */}
					<View style={styles.header}>
						<TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
							<ArrowLeft color={colors.text} size={24} strokeWidth={2.4} />
						</TouchableOpacity>
					</View>

					{/* Title + description */}
					<View style={styles.titleBlock}>
						<ThemedText variant="title" style={styles.titleText}>
							Verify OTP
						</ThemedText>

						<ThemedText muted style={styles.subTitle}>
							Enter the 6-digit code sent to
						</ThemedText>

						<ThemedText style={styles.phoneText}>
							+91 {mobile}
						</ThemedText>

						<ThemedText muted style={styles.helperText}>
							We sent a code to your mobile number.{'\n'}Please enter it below.
						</ThemedText>
					</View>

					{/* OTP row */}
					<View style={styles.otpRow}>
						{otp.map((digit, idx) => (
							<TextInput
								key={idx}
								ref={(ref) => {
									inputs.current[idx] = ref;
								}}
								value={digit}
								onChangeText={(val) => handleChange(val, idx)}
								keyboardType="number-pad"
								maxLength={1}
								style={[
									styles.otpBox,
									{
										borderColor: digit ?'#000' : 'rgba(0,0,0,0.08)',
										color: colors.text,
									},
								]}
								placeholder=" "
								placeholderTextColor="transparent"
								textAlign="center"
								onKeyPress={({ nativeEvent }) => {
									if (nativeEvent.key === 'Backspace') handleBackspace(idx);
								}}
							/>
						))}
					</View>


					{/* Resend */}
					<View style={styles.resendRow}>
						<ThemedText muted style={styles.resendText}>
							Didn&apos;t receive the code?{' '}
						</ThemedText>
						<TouchableOpacity onPress={onResend} activeOpacity={0.7}>
							<ThemedText style={[styles.resendLink, { color: colors.text }]}>
								Resend
							</ThemedText>
						</TouchableOpacity>
					</View>

					{/* Verify button */}
					<ThemedButton
						label="Verify"
						onPress={onSubmit}
						disabled={!canVerify}
						style={[
							styles.verifyButton,
							{
								backgroundColor: canVerify ? '#111' : 'rgba(0,0,0,0.25)',
							},
						]}
					/>
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
			paddingHorizontal: 22,
			paddingBottom: 32,
		},

		header: {
			paddingTop: 8,
			paddingBottom: 10,
		},

		titleBlock: {
			alignItems: 'center',
			marginTop: 8,
			marginBottom: 20,
		},

		titleText: {
			fontSize: 35,
			fontWeight: '600',
			marginBottom: 10,
		},

		subTitle: {
			fontSize: 13,
			marginBottom: 10,
		},

		phoneText: {
			fontSize: 18,
			fontWeight: '700',
			marginBottom: 10,
		},

		helperText: {
			fontSize: 13,
			textAlign: 'center',
			lineHeight: 18,
			opacity: 0.7,
		},

		otpRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginTop: 8,
			marginBottom: 16,
		},

		otpBox: {
			width: 50,
			height: 50,
			borderWidth: 1,
			borderRadius: 10,
			fontSize: 20,
			fontWeight: '700',
			backgroundColor: '#fff',

			// soft shadow like reference
			shadowColor: '#000',
			shadowOpacity: 0.06,
			shadowRadius: 10,
			shadowOffset: { width: 0, height: 6 },
			elevation: 3,
		},

		resendRow: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: 18,
		},

		resendText: {
			fontSize: 12,
			opacity: 0.75,
		},

		resendLink: {
			fontSize: 12,
			fontWeight: '800',
		},

		verifyButton: {
			height: 54,
			borderRadius: 28, // pill
			justifyContent: 'center',
			alignItems: 'center',

			shadowColor: '#000',
			shadowOpacity: 0.16,
			shadowRadius: 18,
			shadowOffset: { width: 0, height: 10 },
			elevation: 8,
		},
	});

export default OtpScreen;
