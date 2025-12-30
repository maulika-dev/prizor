import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ImageBackground,
	StatusBar,
	Pressable
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import l2 from "../../assets/img/l2.png";
import { Mail } from "lucide-react-native";
import { sendLoginOtp } from '../api/authApi';
import { RootRoutes, RootStackParamList } from '../navigation/routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ModalPopup from '../components/ModalPopup';

type Props = NativeStackScreenProps<RootStackParamList, RootRoutes.Login>;

export default function LoginScreen({ navigation }: Props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mobile, setMobile] = useState("");
	const [agree, setAgree] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [showAgreementModal, setShowAgreementModal] = useState<boolean>(false);
	
	const onContinue = async () => {
		const trimmed = mobile.trim();

		if (trimmed.length < 10) {
			setError('Please enter a valid mobile number');
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// 👇 call API
			const res = await sendLoginOtp({
				mobile: trimmed,
				type: "register"
			});

			if (!res.success) {
				console.log(res.success)
				setError(res.message || 'Failed to send OTP');
				return;
			}
			
			navigation.navigate(RootRoutes.Otp, { mobile: trimmed });
		} catch (err: any) {
			console.error('check-auth unexpected error:', err?.message || err);
			setError('Network error. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const attemptContinue = () => {
		if (!agree) {
			setShowAgreementModal(true);
			return;
		}
		onContinue();
	};

	const handleAgreeAndContinue = () => {
		setAgree(true);
		setShowAgreementModal(false);
		onContinue();
	};

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

			{/* ✅ FULL SCREEN BACKGROUND IMAGE */}
			<ImageBackground
				source={l2} // your image
				style={styles.bg}
				resizeMode="cover"
			>
				<SafeAreaView style={{ flex: 1 }}>
					{/* ✅ This creates exact bottom gray look */}
					<LinearGradient
						colors={[
							"rgba(255,255,255,0)",   // transparent top
							"rgba(255,255,255,0.30)",// fade
							"#f3f3f5",
							"#efeff4",
						]}
						locations={[0, 0.35, 0.65, 1]}
						start={{ x: 0, y: 0 }}
						end={{ x: 0, y: 1 }}
						style={StyleSheet.absoluteFillObject}
					/>

					{/* ✅ CONTENT OVERLAY */}
					<View style={styles.content}>
						<View style={styles.textBlock}>
							<Text style={styles.title}>Welcome Back!</Text>
							<Text style={styles.subtitle}>
								Log in or Register to your account to monitor your
								cameras anytime, anywhere.
							</Text>
						</View>


						<View style={styles.phonePill}>
							{/* Flag circle */}
							<Text style={styles.flagCircle}>🇮🇳</Text>
							{/* Country code */}
							<Text style={styles.countryCode}>+91</Text>

							{/* Divider */}
							<View style={styles.divider} />

							{/* Input */}
							<TextInput
								value={mobile}
								onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ""))}
								placeholder="Enter mobile number"
								placeholderTextColor="#9aa0a6"
								keyboardType="number-pad"
								maxLength={10}
								style={styles.phoneInput}
							/>

							{mobile.length > 0 && (
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() => setMobile("")}
									style={styles.clearBtn}
									hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
								>
									<Text style={styles.clearIcon}>×</Text>
								</TouchableOpacity>
							)}

						</View>

						{/* Login Button */}
						<TouchableOpacity activeOpacity={0.9} style={styles.loginBtn} onPress={attemptContinue}>
							<Text style={styles.loginText}>Log In</Text>
						</TouchableOpacity>
						
						<Pressable onPress={() => setAgree((v) => !v)}>
							<View style={styles.agreeRow}>
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={() => setAgree((v) => !v)}
									style={styles.radioOuter}
								>
									{agree && <View style={styles.radioInner} />}
								</TouchableOpacity>

								<Text style={styles.agreeText}>
									Please note that by Logging in, you hereby agree to our{" "}
									<Text style={styles.agreeLink} onPress={() => console.log("User Agreement")}>
										User Agreement
									</Text>
									{" "}and{" "}
									<Text style={styles.agreeLink} onPress={() => console.log("Privacy Policy")}>
										Privacy Policy
									</Text>
								</Text>
							</View>
						</Pressable>

						<View style={styles.dividerRow}>
							<View style={styles.dividerLine} />
							<View style={styles.dividerPill}>
								<Text style={styles.dividerDots}>•••</Text>
							</View>
							<View style={styles.dividerLine} />
						</View>

						{/* Face ID + Fingerprint buttons */}
						<View style={styles.bioSingleWrap}>
							<TouchableOpacity activeOpacity={0.9} style={styles.bioBtnSingle}>
								<Mail size={24} strokeWidth={1.5} />
								<View>
									<Text style={styles.bioTop}>Continue with</Text>
									<Text style={styles.bioBottom}>Email</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</SafeAreaView>

				<ModalPopup 
					visible={showAgreementModal} 
					onClose={() => setShowAgreementModal(false)}
				>
					<View>
						<Text style={styles.modalTitle}>
							Guidelines such as Service Agreement and Privacy Policy
						</Text>
						<Text style={styles.modalBody}>
							Before logging in, please read and agree to our policies.
						</Text>
						<View style={styles.modalLinksRow}>
							<Text style={styles.modalLink}>User Agreement</Text>
							<Text style={styles.modalDivider}>•</Text>
							<Text style={styles.modalLink}>Privacy Policy</Text>
						</View>
						<View style={styles.modalButtonsRow}>
							<TouchableOpacity
								style={styles.modalCancel}
								onPress={() => setShowAgreementModal(false)}
								activeOpacity={0.85}
							>
								<Text style={styles.modalCancelText}>Take another look</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.modalConfirm}
								onPress={handleAgreeAndContinue}
								activeOpacity={0.9}
							>
								<Text style={styles.modalConfirmText}>Agree and continue</Text>
							</TouchableOpacity>
						</View>
					</View>

					


					

				</ModalPopup>

			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	bg: {
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: "flex-end",
		paddingHorizontal: 22,
		paddingBottom: 70,
	},

	textBlock: {          // ⬅ pushes text into fade area
		marginBottom: 24,
	},

	title: {
		fontSize: 25,             // matches reference
		fontWeight: '800',
		color: '#111111',
		letterSpacing: -0.5,      // subtle premium look
		textAlign: "center",
	},

	subtitle: {
		marginTop: 10,
		marginLeft: 10,
		fontSize: 15,
		color: '#6B7280',         // exact soft gray
		lineHeight: 22,
		maxWidth: '92%',
	},

	phonePill: {
		height: 54,
		borderRadius: 30,
		backgroundColor: "rgba(255,255,255,0.92)",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 14,
		borderWidth: 1,
		borderColor: "rgba(0,0,0,0.06)",
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 10 },
		elevation: 4,
	},

	flagCircle: {
		marginRight: 5,
	},

	countryCode: {
		fontSize: 15,
		fontWeight: "700",
		color: "#111",
		marginRight: 10,
	},

	divider: {
		width: 1,
		height: 22,
		backgroundColor: "rgba(0,0,0,0.12)",
		marginRight: 10,
	},

	phoneInput: {
		flex: 1,
		fontSize: 15,
		color: "#111",
		fontWeight: "500",
	},

	clearBtn: {
		width: 22,
		height: 22,
		borderRadius: 11,
		backgroundColor: "rgba(0,0,0,0.18)", // ✅ gray circle
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 10,
	},
	clearIcon: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "900",
		lineHeight: 18,
		marginTop: -1, // centers "×" better
	},

	inputIcon: { fontSize: 18, marginRight: 10 },

	loginBtn: {
		marginTop: 18,
		height: 58,
		borderRadius: 30,
		backgroundColor: "#1f1f1f",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.22,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 10 },
		elevation: 7,
	},
	loginText: { color: "#fff", fontSize: 18, fontWeight: "500" },

	signupRow: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 14,
		alignItems: "center",
	},
	signupMuted: { color: "#6b7280", fontWeight: "600" },
	signupLink: { color: "#111", fontWeight: "800" },

	agreeRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginTop: 14,
		gap: 10,
	},

	radioOuter: {
		width: 18,
		height: 18,
		borderRadius: 9,
		borderWidth: 2,
		borderColor: "#1f1f1f",      // orange ring
		justifyContent: "center",
		alignItems: "center",
		marginTop: 2,
	},

	radioInner: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#1f1f1f",  // orange dot
	},

	agreeText: {
		flex: 1,
		fontSize: 12.5,
		lineHeight: 18,
		color: "#8b8f97",
	},

	agreeLink: {
		color: "#1f1f1f",
		fontWeight: "700",
	},

	dividerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 16,
		gap: 12,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: "rgba(219, 220, 225)",
	},
	dividerPill: {
		width: 44,
		height: 20,
		borderRadius: 5,
		backgroundColor: "rgba(255,255,255,0.95)",
		borderWidth: 1,
		borderColor: "rgba(0,0,0,0.08)",
		justifyContent: "center",
		alignItems: "center",
	},
	dividerDots: {
		color: "#9ca3af",
		fontWeight: "800",
		letterSpacing: 2,
	},


	bioSingleWrap: {
		alignItems: "center",
		marginTop: 16,
	},

	bioBtnSingle: {
		width: "60%",          // ✅ adjust: 65% to 80%
		height: 64,
		borderRadius: 22,
		backgroundColor: "rgba(255,255,255,0.92)",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",  // ✅ centers icon+text group
		gap: 10,
		paddingHorizontal: 14,

		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 10 },
		elevation: 4,

		borderWidth: 1,
		borderColor: "rgba(0,0,0,0.05)",
	},



	bioRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 16,

	},
	bioBtn: {
		flex: 1,
		height: 64,
		borderRadius: 22,
		backgroundColor: "rgba(254, 254, 254)",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 14,
		gap: 10,
		textAlign: "center",
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 10 },
		elevation: 4,
		borderWidth: 1,
		borderColor: "rgba(0,0,0,0.05)",
	},

	bioTop: {
		fontSize: 12,
		color: "#949495",
		fontWeight: "500",
	},
	bioBottom: {
		fontSize: 14,
		color: "#111",
		fontWeight: "700",
	},

	// modal css

		modalTitle: {
			fontSize: 16,
			fontWeight: '700',
			
			textAlign: 'center',
			marginBottom: 10,
		},
		modalBody: {
			fontSize: 13,
			
			textAlign: 'center',
			marginBottom: 10,
		},
		modalLinksRow: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: 14,
		},
		modalLink: {
			color:'#000',
			fontSize: 15,
			fontWeight: '900',
			marginHorizontal: 4,
		},
		modalDivider: {
			color: '#C4C4C4',
			fontSize: 12,
		},
		modalButtonsRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		modalCancel: {
			flex: 1,
			backgroundColor: '#f0f0f0',
			borderRadius: 12,
			height: 46,
			alignItems: 'center',
			justifyContent: 'center',
			marginRight: 10,
		},
		modalCancelText: {
			
			fontSize: 14,
			fontWeight: '600',
		},
		modalConfirm: {
			flex: 1,
			backgroundColor: '#000',
			borderRadius: 12,
			height: 46,
			alignItems: 'center',
			justifyContent: 'center',
			marginLeft: 10,
		},
		modalConfirmText: {
			color: '#fff',
			fontSize: 14,
			fontWeight: '700',
		},

});
