import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
	Image,
	Dimensions,
	TextInput,
	Animated,
	ImageBackground,
	ImageSourcePropType
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import bg1 from '../../../assets/img/bg3.png';
import camImg from '../../../assets/img/a.jpeg';
import { CirclePlay, Ellipsis, Search, MessageCircleMore, CirclePlus, Menu } from "lucide-react-native";
import { RootRoutes, RootStackParamList } from '../../navigation/routes';

const { width } = Dimensions.get('window');

export type Camera = {
	id: number;
	name: string;
	thumbnail: ImageSourcePropType;
};

export type Device = {
	id: number;
	name: string;
	cameras: Camera[];
	totalCameras: number;
};

type Props = NativeStackScreenProps<RootStackParamList, RootRoutes.Devices>;

export default function DeviceListScreen({ navigation }: Props) {
	const [selectedTab, setSelectedTab] = useState('All');
	const [activeBottomTab, setActiveBottomTab] = useState('Home');
	const [searchText, setSearchText] = useState('');

	const scrollY = useRef(new Animated.Value(0)).current;
	const HEADER_SEARCH_HEIGHT = 120;

	const headerHeight = scrollY.interpolate({
		inputRange: [0, 80],
		outputRange: [HEADER_SEARCH_HEIGHT, 0],
		extrapolate: 'clamp',
	});

	const headerOpacity = scrollY.interpolate({
		inputRange: [0, 40, 80],
		outputRange: [1, 0.3, 0],
		extrapolate: 'clamp',
	});


	const devices: Device[] = [
		{
			id: 1,
			name: 'BERYL 1',
			cameras: [
				{ id: 1, name: 'DHI-NVR42381A...', thumbnail: camImg },
			],
			totalCameras: 28
		},
		{
			id: 2,
			name: 'BERYL 1',
			cameras: [
				{ id: 1, name: 'DHI-NVR42381A...', thumbnail: camImg },
			],
			totalCameras: 28
		},
		{
			id: 3,
			name: 'BERYL 1',
			cameras: [
				{ id: 1, name: 'DHI-NVR42381A...', thumbnail: camImg },
			],
			totalCameras: 28
		},
	];

	return (

		<ImageBackground
			source={bg1} // change path
			style={styles.bg}
			resizeMode="cover"
		>

			<SafeAreaView style={styles.container}>
				<StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

				<Animated.View
					style={[
						styles.collapsibleHeader,
						{
							height: headerHeight,
							opacity: headerOpacity,
						},
					]}
				>
					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.headerTitle}>My Device</Text>
						<View style={styles.headerRight}>
							<TouchableOpacity style={styles.headerIconButton}>
								<MessageCircleMore />
							</TouchableOpacity>
							<TouchableOpacity style={styles.headerIconButton}>
								<CirclePlus />
							</TouchableOpacity>
						</View>
					</View>

					{/* Search Bar */}
					<View style={styles.searchContainer}>
						<View style={styles.searchBar}>
							<Search color="#c3c1c1" size={20} />
							<TextInput
								style={styles.searchInput}
								placeholder="Search for devices by name or SN"
								placeholderTextColor="#aaa"
								value={searchText}
								onChangeText={setSearchText}
							/>
						</View>
					</View>
				</Animated.View>

				{/* Tabs and Controls */}
				<View style={styles.tabsRow}>
					<View style={styles.tabs}>
						<TouchableOpacity
							style={styles.tab}
							onPress={() => setSelectedTab('All')}
						>
							<Text style={[styles.tabText, selectedTab === 'All' && styles.tabTextActive]}>
								All
							</Text>
							{selectedTab === 'All' && <View style={styles.tabIndicator} />}
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.tab}
							onPress={() => setSelectedTab('Favorites')}
						>
							<Text style={[styles.tabText, selectedTab === 'Favorites' && styles.tabTextInactive]}>
								Favorites
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.controls}>
						{/* <TouchableOpacity style={styles.multiWindowBtn}>
							<Text style={styles.playIconSmall}>▶</Text>
							<Text style={styles.multiWindowText}>Multi-Window</Text>
						</TouchableOpacity> */}
						<TouchableOpacity style={styles.hamburgerBtn}>
							<Menu />
						</TouchableOpacity>
					</View>
				</View>

				{/* Device List */}

				<Animated.ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					scrollEventThrottle={16}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: scrollY } } }],
						{ useNativeDriver: false } // must be false because we animate height
					)}
				>

					{devices.map((device) => (
						<View key={device.id} style={styles.deviceCardShadow}>
							<View style={styles.deviceCard}>
								{/* Device Header */}
								<View style={styles.deviceHeader}>
									<Text style={styles.deviceName}>{device.cameras[0].name}</Text>

									<View style={styles.deviceHeaderActions}>
										<TouchableOpacity style={styles.deviceMoreBtn}>
											<CirclePlay size={28} strokeWidth={1.50} />
										</TouchableOpacity>
										<TouchableOpacity style={styles.deviceMoreBtn}>
											<Ellipsis strokeWidth={1.50} />
										</TouchableOpacity>
									</View>
								</View>
								<View style={styles.sectionDivider} />

								{/* Camera Grid - Single Column */}
								<View style={styles.cameraList}>
									{device.cameras.map((camera) => (
										<View key={camera.id} style={styles.cameraItem}>
											<View style={styles.cameraThumbnailContainer}>
												<Image
													source={camera.thumbnail}
													style={styles.cameraThumbnail}
													resizeMode="cover"
												/>
												<TouchableOpacity
													style={styles.cameraPlayOverlay}
													onPress={() => navigation.navigate(RootRoutes.Preview)}
												>
													<View style={styles.cameraPlayButton}>
														<Text style={styles.cameraPlayIcon}>▶</Text>
													</View>
												</TouchableOpacity>
											</View>
										</View>
									))}
								</View>

							</View>
						</View>
					))}

					<View style={styles.footerTextContainer}>
						<Text style={styles.footerText}>Security at Fingertips</Text>
					</View>

					{/* </ScrollView> */}
				</Animated.ScrollView>


				{/* Bottom Navigation */}
				<View style={styles.bottomNav}>
					<TouchableOpacity
						style={styles.bottomNavItem}
						onPress={() => setActiveBottomTab('Home')}
					>
						<Text style={styles.bottomNavIcon}>🏠</Text>
						<Text style={[
							styles.bottomNavLabel,
							activeBottomTab === 'Home' && styles.bottomNavLabelActive
						]}>
							Home
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.bottomNavItem}
						onPress={() => setActiveBottomTab('Events')}
					>
						<Text style={[styles.bottomNavIcon, styles.bottomNavIconInactive]}>📅</Text>
						<Text style={styles.bottomNavLabel}>Events</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.bottomNavItem}
						onPress={() => setActiveBottomTab('Me')}
					>
						<Text style={[styles.bottomNavIcon, styles.bottomNavIconInactive]}>👤</Text>
						<Text style={styles.bottomNavLabel}>Me</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ImageBackground>


	);
}

const styles = StyleSheet.create({
	bg: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 12,
		paddingBottom: 12,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '400',
		color: '#000',
	},
	headerRight: {
		flexDirection: 'row',
		gap: 10,
	},
	headerIconButton: {
		paddingHorizontal: 5,
		justifyContent: 'center',
		alignItems: 'center',
		
	},
	headerIconText: {
		fontSize: 18,
	},
	searchContainer: {
		paddingHorizontal: 20,
		paddingVertical: 5,
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 25,
		paddingHorizontal: 16,
		height: 38,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	searchIcon: {

		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		fontSize: 13,
		color: '#333',
		paddingLeft: 5
	},
	tabsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	tabs: {
		flexDirection: 'row',
		gap: 24,
	},
	tab: {
		paddingBottom: 4,
		position: 'relative',
	},
	tabText: {
		fontSize: 16,
		fontWeight: '600',
	},
	tabTextActive: {
		color: '#000',
	},
	tabTextInactive: {
		color: '#999',
	},
	tabIndicator: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 2.5,
		backgroundColor: '#2196F3',
	},
	controls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	multiWindowBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f0f0f0',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 5,
		gap: 5,
	},
	playIconSmall: {
		fontSize: 10,
		color: '#000',
	},
	multiWindowText: {
		fontSize: 13,
		color: '#000',
		fontWeight: '500',
	},
	hamburgerBtn: {
		padding: 4,
	},
	hamburgerIcon: {
		fontSize: 24,
		color: '#000',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 20,
	},

	deviceCardShadow: {
		marginHorizontal: 16,
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 3,
		backgroundColor: 'transparent',
		marginTop: 15,
	},

	deviceCard: {
		backgroundColor: '#fff',
		borderRadius: 16,
		overflow: 'hidden',  // ✅ clips corners perfectly
	},

	deviceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
	},
	deviceName: {
		fontSize: 15,
		fontWeight: '500',
		color: '#000',
	},
	deviceHeaderActions: {
		flexDirection: 'row',
		gap: 12,
	},

	devicePlayIcon: {
		fontSize: 12,
		// color: '#000',
		marginLeft: 2,
	},
	deviceMoreBtn: {
		width: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	deviceMoreIcon: {
		fontSize: 22,
		color: '#000',
		fontWeight: 'bold',
	},
	cameraList: {
		gap: 12,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 10
	},
	cameraItem: {
		overflow: 'hidden',
		backgroundColor: 'transparent',
		elevation: 0,
		padding: 0,
	},
	cameraThumbnailContainer: {
		position: 'relative',
		width: '100%',
		height: width * 0.5,
	},
	cameraThumbnail: {
		width: '100%',
		height: '100%',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
	},
	cameraPlayOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cameraPlayButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cameraPlayIcon: {
		fontSize: 20,
		color: '#fff',
		marginLeft: 3,
	},
	cameraInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
		backgroundColor: '#fff',
	},
	cameraName: {
		fontSize: 14,
		color: '#333',
		flex: 1,
	},
	cameraMoreBtn: {
		padding: 4,
	},
	cameraMoreIcon: {
		fontSize: 18,
		color: '#666',
	},
	showMoreBtn: {
		alignItems: 'center',
		paddingVertical: 12,
		marginTop: 8,
	},
	showMoreText: {
		fontSize: 14,
		color: '#999',
	},
	bottomNav: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#e0e0e0',
		paddingVertical: 8,
	},
	bottomNavItem: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 4,
	},
	bottomNavIcon: {
		fontSize: 24,
		marginBottom: 2,
	},
	bottomNavIconInactive: {
		opacity: 0.4,
	},
	bottomNavLabel: {
		fontSize: 11,
		color: '#999',
	},
	bottomNavLabelActive: {
		color: '#ff6b35',
		fontWeight: '600',
	},
	systemNav: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#fff',
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: '#e0e0e0',
	},
	systemNavBtn: {
		padding: 8,
	},
	systemNavIcon: {
		fontSize: 20,
		color: '#888',
	},

	collapsibleHeader: {
		overflow: 'hidden',
	},
	sectionDivider: {
		height: 1,
		backgroundColor: 'rgba(0,0,0,0.08)',
		marginHorizontal: 0,
		marginBottom: 12,
	},
	slogan: {
		alignItems: 'center',
		justifyContent: 'center',

	},
	footerTextContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10
	},

	footerText: {
		fontSize: 12,
		color: '#9e9e9e',
		fontWeight: '400',
	},

});
