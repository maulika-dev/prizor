import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    Image
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import {ChevronLeft, Octagon, ChevronRight, Image as ImgIcon } from "lucide-react-native";
import lens from '../../../assets/img/lens.png';

export default function DeviceDetailsScreen({ navigation }) {
    const deviceName = "DHI-NVR42381A6-2";
    const isOnline = true;

    const handleBack = () => {
        navigation.goBack();
        // console.log('Go back');
    };

    const handleDeviceInfo = () => {
        console.log('Navigate to device info');
    };

    const handleAI = () => {
        console.log('Navigate to AI settings');
    };

    const handleImageAdjustment = () => {
        console.log('Navigate to Image Adjustment');
    };

    const handleMore = () => {
        console.log('Navigate to More options');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack} >
                        <ChevronLeft />
                    </TouchableOpacity>
                </View>

                {/* Device Info Section */}
                <TouchableOpacity
                    style={styles.deviceInfoCard}
                    onPress={handleDeviceInfo}
                    activeOpacity={0.7}
                >
                    <View style={styles.deviceInfoLeft}>    
                        <Image style={styles.cameraIcon} source={lens} />
                            
                        <View style={styles.deviceDetails}>
                            <Text style={styles.deviceName}>{deviceName}</Text>
                            <View style={styles.statusContainer}>
                                <View style={styles.onlineDot} />
                                <Text style={styles.statusText}>Online</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.chevronRight}>
                        <ChevronRight color={'#ccc'} />
                    </Text>
                </TouchableOpacity>

                {/* Function Settings Section */}
                <Text style={styles.sectionTitle}>Function Settings</Text>

                <View style={styles.settingsCard}>
                    {/* AI Option */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleAI}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIconContainer}>
                                <Text style={styles.settingIconText}>AI</Text>
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingTitle}>AI</Text>
                                <Text style={styles.settingDescription}>
                                    Configure AI detection rules and linkage rules for cameras.
                                </Text>
                            </View>
                            <Text style={styles.chevronRight}>
                                <ChevronRight color={'#ccc'} />
                            </Text>
                        </View>
                        
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Image Adjustment Option */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleImageAdjustment}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingLeft}>
                            <View>
                                <ImgIcon size={25} color="#1a1a1a" />
                            </View>
                            <Text style={styles.settingTitle}>Image Adjustment</Text>
                        </View>
                        <Text style={styles.chevronRight}>
                            <ChevronRight color={'#ccc'} />
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* More Option */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleMore}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingLeft}>
                            <View>
                                <Octagon size={25} />
                            </View>
                            <Text style={styles.settingTitle}>More</Text>
                        </View>
                        <Text style={styles.chevronRight}>
                            <ChevronRight color={'#ccc'} />
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 5,
    },
    backButton: {
        marginTop:20,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    deviceInfoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 20,
        
    },
    deviceInfoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 16,
    },
    cameraIconContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#f5f5f5',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#333',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraLens: {
        width: 20,
        height: 20,
        backgroundColor: '#666',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#888',
    },
    deviceDetails: {
        flex: 1,
    },
    deviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
    },
    statusText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
    chevronRight: {
        fontSize: 28,
        color: '#ccc',
        fontWeight: '300',
    },
    sectionTitle: {
        fontSize: 16,
        color: '#999',
        marginLeft: 16,
        marginBottom: 12,
        fontWeight: '400',
    },
    settingsCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 16,
    },
    settingIconContainer: {
        width: 25,
        height: 25,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingIconText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
    },
    imageIcon: {
        fontSize: 24,
    },
    moreIcon: {
        fontSize: 24,
        color: '#000',
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#999',
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0', 
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
    },
    navButton: {
        padding: 8,
    },
    navIcon: {
        fontSize: 22,
        color: '#999',
    },
});