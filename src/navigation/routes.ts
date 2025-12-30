export enum RootRoutes {
	Welcome = 'Welcome',
	Onboarding = 'Onboarding',
	Login = 'Login',
	Otp = 'Otp',
	Devices = 'Devices',
	Preview = 'Preview',
	AppTabs = "AppTabs",
	DeviceDetails= "DeviceDetails",
	AccountSetting = "AccountSetting",
}

export type RootStackParamList = {
	[RootRoutes.Welcome]: undefined;
	[RootRoutes.Onboarding]: undefined;
	[RootRoutes.Login]: undefined;
	[RootRoutes.Otp]: { mobile: string };
	[RootRoutes.Devices]: undefined;
	[RootRoutes.Preview]: undefined;
	[RootRoutes.AppTabs]: undefined;

	[RootRoutes.DeviceDetails]: {
		deviceId: string;
		name: string;
		status: "online" | "offline";
		thumbnailUrl?: string;
	};
	[RootRoutes.AccountSetting]: undefined;
};
