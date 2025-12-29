import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuthToken } from '../store/authStore';

import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingFlow from '../screens/OnboardingFlow';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import DeviceListScreen from '../screens/device/DeviceListScreen';
import PreviewScreen from '../screens/device/PreviewScreen';
import { RootRoutes, RootStackParamList } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		const initAuth = async () => {
			const token = await getAuthToken();
			setLoggedIn(!!token);
			setCheckingAuth(false);
		};
		initAuth();
	}, []);

	if (checkingAuth) return null; // or return <Splash />

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={loggedIn ? RootRoutes.Devices : RootRoutes.Welcome}
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name={RootRoutes.Welcome} component={WelcomeScreen} />
				<Stack.Screen name={RootRoutes.Onboarding} component={OnboardingFlow} />
				<Stack.Screen name={RootRoutes.Login} component={LoginScreen} />
				<Stack.Screen name={RootRoutes.Otp} component={OtpScreen} />
				<Stack.Screen name={RootRoutes.Devices} component={DeviceListScreen} />
				<Stack.Screen name={RootRoutes.Preview} component={PreviewScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
