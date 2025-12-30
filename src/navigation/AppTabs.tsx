import React, {useEffect} from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, Bell, Settings } from "lucide-react-native";

import DeviceListScreen from "../screens/device/DeviceScreen";
import SystemNavigationBar from 'react-native-system-navigation-bar';
import SettingScreen from "../screens/settings/SettingScreen";

// Create these placeholders (or your real screens)
const ActivityScreen = () => <View style={{ flex: 1 }} />;
// const SettingsScreen = () => <View style={{ flex: 1 }} />;

export type AppTabParamList = {
    Devices: undefined;
    Activity: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppTabs() {
    const insets = useSafeAreaInsets();

    const TAB_HEIGHT = 62;
    const bottomPad = Math.max(insets.bottom, 10);

    useEffect(() => {
        // Android bottom system navigation bar
        SystemNavigationBar.setNavigationColor('#fff', 'dark');
    }, []);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: "#111",
                tabBarInactiveTintColor: "rgba(0,0,0,0.35)",

                tabBarLabelStyle: styles.label,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: TAB_HEIGHT + bottomPad,
                        paddingBottom: bottomPad,
                    },
                ],
            }}
        >
            <Tab.Screen
                name="Devices"
                component={DeviceListScreen}
                options={{
                    tabBarLabel: "Devices",
                    tabBarIcon: ({ focused, color }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <Camera size={22} color={focused ? "#111" : color} />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Activity"
                component={ActivityScreen}
                options={{
                    tabBarLabel: "Events",
                    tabBarIcon: ({ focused, color }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <Bell size={22} color={focused ? "#111" : color} />
                          
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Settings"
                component={SettingScreen}
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ focused, color }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <Settings size={22} color={focused ? "#111" : color} />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        left: 16,
        right: 16,
        paddingTop: 5,

        // Shadow (iOS)
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },

        // Shadow (Android)
        elevation: 10,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 0,
    },

    iconWrap: {
        width: 46,
        height: 30,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    iconWrapActive: {
        // backgroundColor: "rgba(140,120,255,0.25)",
    },
});
