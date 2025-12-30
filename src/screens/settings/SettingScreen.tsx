import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Grid,
    Settings,
    Folder,
    Wrench,
    HelpCircle,
    Info,
    QrCode,
    UserCircle2,
    ChevronRight,
    DollarSign
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootRoutes, RootStackParamList } from '../../navigation/routes';

export default function ProfileMenuScreen() {
    const username = "dspatel";
    const insets = useSafeAreaInsets();
    const contentPaddingBottom = 75 + insets.bottom;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleQRCode = () => {
        console.log('Open QR Code');
    };

    const handleProfile = () => {
        navigation.navigate(RootRoutes.AccountSetting);
    };

    const handleService = () => {
        console.log('Navigate to Service');
    };

    const handleSettings = () => {
        console.log('Navigate to Settings');
    };

    const handleMyFiles = () => {
        console.log('Navigate to My Files');
    };

    const handleTools = () => {
        console.log('Navigate to Tools');
    };

    const handleHelp = () => {
        console.log('Navigate to Help and Feedback');
    };

    const handleAbout = () => {
        console.log('Navigate to About & Legal');
    };

    const primaryMenu = [
        { label: 'Service', icon: Grid, onPress: handleService },
        { label: 'Value Added Service', icon: DollarSign, onPress: handleService },
        { label: 'Settings', icon: Settings, onPress: handleSettings },
    ];

    const secondaryMenu = [
        { label: 'My Files', icon: Folder, onPress: handleMyFiles },
        { label: 'Tools', icon: Wrench, onPress: handleTools },
        { label: 'Help and Feedback', icon: HelpCircle, onPress: handleHelp },
        { label: 'About & Legal', icon: Info, onPress: handleAbout },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: contentPaddingBottom }]}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#f5f5f5', '#f5f5f5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.hero]}
                >
                    <View style={styles.header}>
                        <View />
                        <TouchableOpacity style={styles.qrButton} onPress={handleQRCode} activeOpacity={0.8}>
                            <QrCode color="#233447" size={22} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.profileSection} onPress={handleProfile} activeOpacity={0.8}>
                        <View style={styles.avatarCircle}>
                            <UserCircle2 color="#c1c8d6" size={76} strokeWidth={1.2} />
                        </View>
                        <View style={styles.usernameRow}>
                            <Text style={styles.username}>{username}</Text>
                            <ChevronRight color="#6d7480" size={20} />
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.menuGroup}>
                    {primaryMenu.map((item, idx) => {
                        const Icon = item.icon;
                        const isLast = idx === primaryMenu.length - 1;
                        return (
                            <React.Fragment key={item.label}>
                                <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                                    <View style={styles.menuLeft}>
                                        <View style={styles.iconPill}>
                                            <Icon size={22} strokeWidth={2} />
                                        </View>
                                        <Text style={styles.menuText}>{item.label}</Text>
                                    </View>
                                    <ChevronRight color="#c5c9cf" size={20} />
                                </TouchableOpacity>
                                {!isLast && <View style={styles.divider} />}
                            </React.Fragment>
                        );
                    })}
                </View>

                <View style={[styles.menuGroup, {marginTop: 10}]}>
                    {secondaryMenu.map((item, idx) => {
                        const Icon = item.icon;
                        const isLast = idx === secondaryMenu.length - 1;
                        return (
                            <React.Fragment key={item.label}>
                                <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                                    <View style={styles.menuLeft}>
                                        <View style={styles.iconPill}>
                                            <Icon size={22} strokeWidth={2} />
                                        </View>
                                        <Text style={styles.menuText}>{item.label}</Text>
                                    </View>
                                    <ChevronRight color="#c5c9cf" size={20} />
                                </TouchableOpacity>
                                {!isLast && <View style={styles.divider} />}
                            </React.Fragment>
                        );
                    })}
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f3f7',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    hero: {
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        paddingTop: 12,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    qrButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    profileSection: {
        alignItems: 'center',
        // marginTop: 5,
    },
    avatarCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#f1f4fb',
        borderWidth: 1,
        borderColor: '#e1e8f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    usernameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    username: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0c1020',
    },
    menuGroup: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 18,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    iconPill: {
        width: 36,
        height: 36,
        borderRadius: 12,
        // backgroundColor: '#eff4ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        color: '#121826',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f3f6',
    },
});
