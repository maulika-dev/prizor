import React from 'react';
import {
	ImageBackground,
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield } from 'lucide-react-native';

import ThemedButton from '../components/ThemedButton';
import ThemedText from '../components/ThemedText';
import { useThemeColors } from '../theme/useTheme';

type Props = {
	onGetStarted: () => void;
	onHaveAccount: () => void;
};

const heroImage =
	'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80';

const WelcomeScreen: React.FC<Props> = ({ onGetStarted, onHaveAccount }) => {
	const colors = useThemeColors();

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
			<StatusBar barStyle="dark-content" />
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				bounces={false}
				showsVerticalScrollIndicator={false}>
				<View style={styles.heroContainer}>
					<ImageBackground
						source={{ uri: heroImage }}
						style={styles.heroImage}
						resizeMode="cover"
					/>
				</View>

				<View style={styles.content}>
					<View
						style={[
							styles.iconBadge,
							{
								backgroundColor: colors.primary,
								shadowColor: colors.cardShadow,
							},
						]}>
						<Shield color={colors.primaryText} size={32} strokeWidth={2.2} />
					</View>

					<ThemedText variant="title" style={styles.title}>
						Sentinel View
					</ThemedText>
					<ThemedText muted style={styles.subtitle} numberOfLines={2}>
						Smart monitoring for peace of mind. Secure your world, anywhere.
					</ThemedText>

					<ThemedButton
						label="Get Started"
						onPress={onGetStarted}
						variant="primary"
						style={styles.primaryCta}
					/>
					<ThemedButton
						label="I have an account"
						variant="secondary"
						onPress={onHaveAccount}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 32,
	},
	heroContainer: {
		height: 370,
		overflow: 'hidden',
		borderBottomLeftRadius: 36,
		borderBottomRightRadius: 36,
	},
	heroImage: {
		flex: 1,
		width: '100%',
	},
	content: {
		alignItems: 'center',
		paddingHorizontal: 28,
		paddingTop: 18,
	},
	iconBadge: {
		width: 80,
		height: 80,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 18,
		shadowOpacity: 0.2,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 8 },
		elevation: 6,
	},
	title: {
		textAlign: 'center',
	},
	subtitle: {
		textAlign: 'center',
		marginTop: 10,
		fontSize: 16,
		lineHeight: 24,
	},
	primaryCta: {
		marginTop: 28,
		marginBottom: 12,
		alignSelf: 'stretch',
	},
});

export default WelcomeScreen;
