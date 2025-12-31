import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuthToken } from "../store/authStore";

import WelcomeScreen from "../screens/WelcomeScreen";
import OnboardingFlow from "../screens/OnboardingFlow";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";
import PreviewScreen from "../screens/device/PreviewScreen";
import DeviceDetailScreen from "../screens/device/DeviceDetail";
import AppTabs from "./AppTabs"; //your bottom tabs navigator
import AccountSetting from "../screens/settings/AccountSetting";
import { RootRoutes, RootStackParamList } from "./routes";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		(async () => {
			const token = await getAuthToken();
			setLoggedIn(!!token);
			setCheckingAuth(false);
		})();
	}, []);

	if (checkingAuth) return null; // or Splash

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{loggedIn ? (
					// ✅ LOGGED-IN FLOW
					<>
						<Stack.Screen name={RootRoutes.AppTabs} component={AppTabs} />
						<Stack.Screen name={RootRoutes.Preview} component={PreviewScreen} />
						<Stack.Screen name={RootRoutes.DeviceDetails} component={DeviceDetailScreen}
						/>
						<Stack.Screen name={RootRoutes.AccountSetting} component={AccountSetting} />
					</>
				) : (
					// ✅ AUTH FLOW
					<>
						<Stack.Screen name={RootRoutes.Welcome} component={WelcomeScreen} />
						<Stack.Screen name={RootRoutes.Onboarding} component={OnboardingFlow} />
						<Stack.Screen name={RootRoutes.Login} component={LoginScreen} />
						<Stack.Screen name={RootRoutes.Otp} component={OtpScreen} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
