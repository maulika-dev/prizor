import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
	ImageBackground,
	Dimensions,
	Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootRoutes, RootStackParamList } from '../navigation/routes';

const { width, height } = Dimensions.get('window');
import bgImg from "../../assets/img/wbg1.png";
// import { Image } from 'react-native-svg';
import logo from "../../assets/img/logo.png";
type Props = NativeStackScreenProps<RootStackParamList, RootRoutes.Welcome>;

export default function WelcomeScreen({ navigation }: Props) {
	const handleNext = () => {
		navigation.navigate(RootRoutes.Login);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

			{/* Full Screen Background Image */}
			<ImageBackground
				source={bgImg}
				style={styles.backgroundImage}
				resizeMode="cover"
			>
				{/* Overlay Gradient for better text readability */}
				<View style={styles.overlay}>

					{/* Content Overlay */}
					<SafeAreaView style={styles.safeArea}>
						<View style={styles.contentContainer}>

							{/* Spacer to push content to bottom */}
							<View style={styles.spacer} />

							{/* Text Content */}
							<View style={styles.textContainer}>
								{/* <Text style={styles.title}>Welcome to</Text> */}
								<Image style={styles.logo} source={logo} />
								{/* <Text style={styles.subtitle}>Prizor</Text> */}
								
							</View>

							{/* Next Button */}
							<TouchableOpacity
								style={styles.nextButton}
								onPress={handleNext}
								activeOpacity={0.8}
							>
								<Text style={styles.nextButtonText}>Get Started</Text>
							</TouchableOpacity>

							{/* Home Indicator */}
							<View style={styles.homeIndicator} />
						</View>
					</SafeAreaView>
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	logo:{
		width:130,
		height:120
	},
	backgroundImage: {
		flex: 1,
		width: width,
		height: height,
	},
	overlay: {
		flex: 1,
		// backgroundColor: 'rgba(255, 255, 255, 0.7)', // White overlay for better text visibility
	},
	safeArea: {
		flex: 1,
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: 24,
		paddingBottom: 20,
		justifyContent: 'flex-end',
	},
	spacer: {
		flex: 1,
	},
	textContainer: {
		alignItems: 'center',
		marginBottom: 0,
		// backgroundColor: 'rgba(255, 255, 255, 0.9)',
		paddingVertical: 20,
		paddingHorizontal: 20,
		borderRadius: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: '400',
		color: '#333',
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 36,
		fontWeight: '700',
		color: '#000',
		textAlign: 'center',
		marginTop: 4,
	},
	description: {
		fontSize: 15,
		color: '#666',
		textAlign: 'center',
		lineHeight: 22,
		marginTop: 12,
		paddingHorizontal: 10,
	},
	nextButton: {
		width: '100%',
		backgroundColor: '#000',
		paddingVertical: 18,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	nextButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
		letterSpacing: 0.5,
	},
	homeIndicator: {
		width: 140,
		height: 2,
		backgroundColor: '#000',
		borderRadius: 3,
		alignSelf: 'center',
		marginBottom: 8,
	},
});
