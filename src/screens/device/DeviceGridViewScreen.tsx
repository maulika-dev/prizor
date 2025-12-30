import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Webcam, MoreHorizontal, Wifi } from "lucide-react-native";
import DeviceActionSheet  from '../../components/DeviceOptionModal';

export type DeviceItem = {
    id: string;
    name: string;
    status: "Online" | "Offline";
    qualityText: string;
    battery: number;
    fw: string;
    isLive?: boolean;
    thumb: any;
};

export default function DeviceListItem({ item }: { item: DeviceItem }) {

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.card}>
            {/* Header row */}
            <View style={styles.cardHeader}>
                <View style={styles.leftHeader}>
                    <View style={styles.iconCircle}>
                        <Webcam size={18} color="#4b5563" />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.deviceTitle} numberOfLines={1}>
                            {item.name}
                        </Text>

                        {/* <Text style={styles.subText}>NX001SN001</Text> */}

                        <View style={styles.subRow}>
                            <View
                                style={[
                                    styles.dot,
                                    { backgroundColor: item.status === "Online" ? "#2ecc71" : "#bdbdbd" },
                                ]}
                            />
                            <Text style={styles.subText}>{item.status} • 4K HDR</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.moreBtn} onPress={() => setModalVisible(true)}>
                    <MoreHorizontal size={18} color="#111" />
                </TouchableOpacity>
            </View>

            {/* Preview */}
            <View style={styles.previewWrap}>
                <ImageBackground
                    source={item.thumb}
                    style={styles.previewImg}
                    imageStyle={styles.previewImgRadius}
                    resizeMode="cover"
                />
            </View>

            {/* Footer row */}
            <View style={styles.footerRow}>
                <View style={styles.footerLeft}>
                    <Wifi size={16} color="#8b8b8b" />
                    <Text style={styles.footerText}>{item.qualityText}</Text>

                    <View style={styles.footerSep} />

                    <View style={styles.batteryPill}>
                        <View style={styles.batteryBar} />
                        <Text style={styles.footerText}>{item.battery}%</Text>
                    </View>
                </View>

                <Text style={styles.footerRight}>{item.fw}</Text>
            </View>

            {/* Modal popup */}

            <DeviceActionSheet
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title="BERYL 1"
                subtitle="From User vin****@gmail.com"
                items={[
                {
                    key: "details",
                    title: "Device Details",
                    onPress: () => console.log("Details"),
                },
            ]}
      />

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginBottom: 10,
        overflow: "hidden",
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
    deviceTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111",
        // textTransform: "uppercase",
    },
    subRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
    dot: { width: 7, height: 7, borderRadius: 3.5 },
    subText: { fontSize: 12, color: "#6f6f6f", fontWeight: "400" },
    moreBtn: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },

    previewWrap: { paddingHorizontal: 14, paddingBottom: 10 },
    previewImg: { height: 150, width: "100%" },
    previewImgRadius: { borderRadius: 14 },

    footerRow: {
        paddingHorizontal: 14,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    footerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    footerText: { fontSize: 10, color: "#8b8b8b", fontWeight: "400" },
    footerSep: { width: 1, height: 14, backgroundColor: "rgba(0,0,0,0.10)" },
    batteryPill: { flexDirection: "row", alignItems: "center", gap: 6 },
    batteryBar: {
        width: 14,
        height: 8,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.25)",
    },
    footerRight: { fontSize: 10, color: "#b0b0b0", fontWeight: "400" },
});
