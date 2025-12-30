import React, { useMemo, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Image,
	ImageBackground,
	TextInput,
	StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CirclePlus, Search, List as ListIcon, LayoutGrid, Play, RotateCcw } from "lucide-react-native";
import camImg from '../../../assets/img/a.jpeg';
import DropdownMenu from '../../components/DropdownMenu';
import DeviceGridItem from './DeviceGridViewScreen';
import DeviceListItem from './DeviceListViewScreen';
import SmartHomeDevicesScreen from './1';

type DeviceItem = {
	id: string;
	name: string;
	status: "Online" | "Offline";
	qualityText: string; // "Good"
	battery: number; // 84
	fw: string; // "FW 2.1.0"
	isLive?: boolean;
	thumb: any; // require(...) or {uri:""}
};

type ViewMode = "list" | "grid";

export default function DeviceListScreen() {
	const [tab, setTab] = useState<"all" | "fav">("all");
	const [search, setSearch] = useState("");
	const insets = useSafeAreaInsets();
	const BG = "#f5f5f5";
	const TAB_BAR_HEIGHT = 74;
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	const devices: DeviceItem[] = useMemo(
		() => [
			{
				id: "1",
				name: "Front Door",
				status: "Online",
				qualityText: "Good",
				battery: 84,
				fw: "FW 2.1.0",
				isLive: true,
				thumb: camImg,
			},
			{
				id: "2",
				name: "Driveway",
				status: "Online",
				qualityText: "Good",
				battery: 72,
				fw: "FW 2.1.0",
				isLive: true,
				thumb: camImg,
			},
			{
				id: "3",
				name: "Backyard",
				status: "Offline",
				qualityText: "Weak",
				battery: 54,
				fw: "FW 2.0.8",
				isLive: false,
				thumb: camImg,
			},
		],
		[]
	);

	const filtered = devices.filter((d) => {
		const match = d.name.toLowerCase().includes(search.toLowerCase());
		if (tab === "fav") return match; // later you can filter favorites
		return match;
	});


	return (

		<View style={[styles.safe, { backgroundColor: BG }]}>
			<StatusBar
				barStyle="dark-content"
				translucent
				backgroundColor="transparent"
			/>

			<SafeAreaView style={styles.safe} edges={["top"]}>

				{/* Header */}
				<View style={styles.headerSection}>
					<View style={styles.topBar}>
						<View style={styles.titleRow}>
							<Text style={styles.pageTitle}>My Device</Text>
						</View>

						<TouchableOpacity style={styles.addBtn}>
							<CirclePlus size={25} color="#111" />
						</TouchableOpacity>

					</View>

					{/* Search */}
					<View style={styles.searchWrap}>
						<View style={styles.searchBox}>
							<Search size={18}  />
							<TextInput
								value={search}
								onChangeText={setSearch}
								placeholder="Search for devices by names and SN"
								style={styles.searchInput}
							/>
						</View>
					</View>

					{/* Tabs */}
					<View style={styles.tabsRow}>
						<View style={styles.tabs}>
							<TouchableOpacity
								onPress={() => setTab("all")}
								style={[styles.tabPill, tab === "all" && styles.tabPillActive]}
							>
								<Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>
									All ({devices.length})
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => setTab("fav")}
								style={[styles.tabPill, tab === "fav" && styles.tabPillActive]}
							>
								<Text style={[styles.tabText, tab === "fav" && styles.tabTextActive]}>
									Favorites
								</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={styles.filterBtn}>


							<DropdownMenu
								width={160}
								trigger={({ open }) => (
									<TouchableOpacity onPress={open} style={{ padding: 8 }}>
										{/* your 3-line menu icon */}
										<ListIcon size={22} color="#111" />
									</TouchableOpacity>
								)}
								items={[
									{
										key: "live",
										label: "Live View",
										icon: <Play size={20} color="#111" />,
										onPress: () => console.log("Live View"),
									},
									{
										key: "playback",
										label: "Playback",
										icon: <RotateCcw size={20} color="#111" />,
										onPress: () => console.log("Playback"),
									},
									...(viewMode === "grid"
										? [
											{
											key: "list",
											label: "List View",
											icon: <ListIcon size={20} color="#111" />,
											onPress: () => setViewMode("list"),
											},
										]
										: [
											{
											key: "grid",
											label: "Grid View",
											icon: <LayoutGrid size={20} color="#111" />,
											onPress: () => setViewMode("grid"),
											},
									]),
								]}
							/>

						</TouchableOpacity>
					</View>
				</View>

				{/* List (1 column) */}
				<FlatList
					data={filtered}
					keyExtractor={(i) => i.id}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={[
						styles.listContent,
						{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 16 },
					]}
					renderItem={({ item }) =>
						viewMode === "grid" ? <DeviceGridItem item={item} /> : <DeviceListItem item={item} />
					}
				/>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		// f3f4f6
		// f5f5f5
		backgroundColor: "#f5f5f5", // light gray like your screenshot
	},

	headerSection: {
		backgroundColor: '#f5f5f5',
		borderBottomLeftRadius: 26,
		borderBottomRightRadius: 26,
	},

	topBar: {
		paddingHorizontal: 18,
		paddingTop: 6,
		paddingBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	titleRow: { flexDirection: "row", alignItems: "center" },
	pageTitle: { fontSize: 20, fontWeight: "500", color: "#111" },
	addBtn: {
		width: 36,
		height: 36,
		alignItems: "center",
		justifyContent: "center",
	},

	searchWrap: { paddingHorizontal: 20, paddingBottom: 20 },
	searchBox: {
		flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        height: 48,
		borderWidth:1,
		borderColor: '#e2e2e2',
	},
	searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: "#111" },

	tabsRow: {
		paddingHorizontal: 18,
		paddingBottom: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	tabs: { flexDirection: "row", gap: 10 },
	tabPill: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 18,
		backgroundColor: "rgba(0,0,0,0.06)",
	},
	tabPillActive: {
		backgroundColor: "#000",
	},
	tabText: { fontSize: 13, fontWeight: "400", color: "#111" },
	tabTextActive: { color: "#fff" },

	filterBtn: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	filterIcon: { fontSize: 10, color: "#111" },

	listContent: {
		paddingHorizontal: 18,
		paddingBottom: 24,
	},

	// CARD
	card: {
		backgroundColor: "#fff",
		borderRadius: 30,
		marginBottom: 14,
		overflow: "hidden", // IMPORTANT: makes bottom radius work + clips preview
		shadowColor: "#000",
		shadowOpacity: 0.07,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 8 },
		elevation: 3,
	},

	cardHeader: {
		paddingHorizontal: 14,
		paddingTop: 12,
		paddingBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	leftHeader: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
	iconCircle: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: "#f3f4f6",
		alignItems: "center",
		justifyContent: "center",
	},
	deviceTitle: { fontSize: 14, fontWeight: "800", color: "#111", textTransform: "uppercase" },
	subRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
	dot: { width: 7, height: 7, borderRadius: 3.5 },
	subText: { fontSize: 12, color: "#6f6f6f", fontWeight: "400" },
	moreBtn: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
	},

	previewWrap: { paddingHorizontal: 14, paddingBottom: 10 },
	previewImg: {
		height: 150, // 👈 change this to make image smaller/bigger
		width: "100%",
		justifyContent: "flex-start",
		alignItems: "flex-end",
	},
	previewImgRadius: {
		borderRadius: 14,
	},

	livePill: {
		marginTop: 10,
		marginRight: 10,
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 14,
		backgroundColor: "rgba(0,0,0,0.55)",
	},
	liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#ff3b30" },
	liveText: { color: "#fff", fontWeight: "800", fontSize: 11 },

	footerRow: {
		paddingHorizontal: 14,
		paddingBottom: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	footerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
	footerText: { fontSize: 12, color: "#8b8b8b", fontWeight: "700" },
	footerSep: { width: 1, height: 14, backgroundColor: "rgba(0,0,0,0.10)" },
	batteryPill: { flexDirection: "row", alignItems: "center", gap: 6 },
	batteryBar: {
		width: 14,
		height: 8,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: "rgba(0,0,0,0.25)",
	},
	footerRight: { fontSize: 12, color: "#b0b0b0", fontWeight: "700" },
});
