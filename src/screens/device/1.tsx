import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Image,
    Dimensions,
    TextInput
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SmartHomeDevicesScreen() {
    const [selectedTab, setSelectedTab] = useState('All');
    const [searchText, setSearchText] = useState('');

    const devices = [
        {
            id: 1,
            name: 'Living Room',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
            status: 'Live',
            time: 'Now',
            online: true,
            signal: 'Good',
            battery: '84%',
            quality: '4K HDR'
        },
        {
            id: 2,
            name: 'Front Door',
            image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&q=80',
            status: 'Live',
            time: 'Now',
            online: true,
            signal: 'Good',
            battery: '84%',
            quality: '4K HDR'
        },
        {
            id: 3,
            name: 'Nursery',
            image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
            status: 'Live',
            time: 'Now',
            online: true,
            signal: 'Good',
            battery: '72%',
            quality: '4K HDR'
        },
        {
            id: 4,
            name: 'Backyard',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            status: 'Live',
            time: 'Now',
            online: true,
            signal: 'Good',
            battery: '91%',
            quality: '4K HDR'
        },
        {
            id: 5,
            name: 'Office',
            image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
            status: 'Live',
            time: 'Now',
            online: true,
            signal: 'Good',
            battery: '68%',
            quality: '4K HDR'
        },
        {
            id: 6,
            name: 'Kitchen',
            image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
            status: 'Live',
            time: 'Now',
            online: true,
            signal: 'Good',
            battery: '95%',
            quality: '4K HDR'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.homeIcon}>🏠</Text>
                    <Text style={styles.headerTitle}>My Devices</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addIcon}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search devices"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'All' && styles.tabActive]}
                        onPress={() => setSelectedTab('All')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'All' && styles.tabTextActive]}>
                            All (8)
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'Favorites' && styles.tabActive]}
                        onPress={() => setSelectedTab('Favorites')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'Favorites' && styles.tabTextActive]}>
                            Favorites
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
            </View>

            {/* Devices Grid - Single Column */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {devices.map((device) => (
                    <View key={device.id} style={styles.deviceCard}>
                        {/* Device Image */}
                        <View style={styles.deviceImageContainer}>
                            <Image
                                source={{ uri: device.image }}
                                style={styles.deviceImage}
                                resizeMode="cover"
                            />

                            {/* Live Badge */}
                            

                            {/* Device Name Overlay */}
                            <View style={styles.deviceNameOverlay}>
                                <View style={styles.deviceNameLeft}>
                                    <Text style={styles.cameraIcon}>📹</Text>
                                    <View>
                                        <Text style={styles.deviceName}>{device.name}</Text>
                                        <Text style={styles.deviceStatus}>
                                            {device.online ? 'Online' : 'Offline'} • {device.quality}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.moreButton}>
                                    <Text style={styles.moreIcon}>⋯</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Device Info Footer */}
                        <View style={styles.deviceFooter}>
                            <View style={styles.deviceInfo}>
                                <Text style={styles.infoIcon}>📶</Text>
                                <Text style={styles.infoText}>{device.signal}</Text>
                            </View>
                            <View style={styles.deviceInfo}>
                                <Text style={styles.infoIcon}>🔋</Text>
                                <Text style={styles.infoText}>{device.battery}</Text>
                            </View>
                            <Text style={styles.deviceModel}>FW 21.0</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>🏠</Text>
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                    <Text style={[styles.navIcon, styles.navIconActive]}>💜</Text>
                    <Text style={[styles.navText, styles.navTextActive]}>Devices</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>▶️</Text>
                    <Text style={styles.navText}>Activity</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>⚙️</Text>
                    <Text style={styles.navText}>Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Home Indicator */}
            <View style={styles.homeIndicator} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    homeIcon: {
        fontSize: 28,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    addButton: {
        width: 40,
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: 24,
        color: '#666',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    tabs: {
        flexDirection: 'row',
        gap: 12,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    tabActive: {
        backgroundColor: '#8B7FF5',
    },
    tabText: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    menuButton: {
        padding: 8,
    },
    menuIcon: {
        fontSize: 20,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    deviceCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    deviceImageContainer: {
        width: '100%',
        height: 200,
        position: 'relative',
    },
    deviceImage: {
        width: '100%',
        height: '100%',
    },
    liveBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
    liveText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    liveLabel: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    liveLabelText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    timeBadge: {
        position: 'absolute',
        top: 12,
        right: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    timeText: {
        color: '#333',
        fontSize: 12,
        fontWeight: '600',
    },
    deviceNameOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    deviceNameLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    cameraIcon: {
        fontSize: 20,
    },
    deviceName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    deviceStatus: {
        color: '#ccc',
        fontSize: 11,
        marginTop: 2,
    },
    moreButton: {
        padding: 4,
    },
    moreIcon: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    deviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoIcon: {
        fontSize: 14,
    },
    infoText: {
        fontSize: 13,
        color: '#666',
    },
    deviceModel: {
        fontSize: 13,
        color: '#999',
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
        paddingVertical: 8,
        paddingBottom: 4,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
    },
    navItemActive: {},
    navIcon: {
        fontSize: 24,
        marginBottom: 4,
        opacity: 0.5,
    },
    navIconActive: {
        opacity: 1,
    },
    navText: {
        fontSize: 11,
        color: '#999',
    },
    navTextActive: {
        color: '#8B7FF5',
        fontWeight: '600',
    },
    homeIndicator: {
        width: 140,
        height: 5,
        backgroundColor: '#000',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 8,
    },
});