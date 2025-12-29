export enum RootRoutes {
	Welcome = 'Welcome',
	Onboarding = 'Onboarding',
	Login = 'Login',
	Otp = 'Otp',
	Devices = 'Devices',
	Preview = 'Preview',
}

export type RootStackParamList = {
	[RootRoutes.Welcome]: undefined;
	[RootRoutes.Onboarding]: undefined;
	[RootRoutes.Login]: undefined;
	[RootRoutes.Otp]: { mobile: string };
	[RootRoutes.Devices]: undefined;
	[RootRoutes.Preview]: undefined;
};
