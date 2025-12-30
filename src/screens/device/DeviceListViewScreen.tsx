import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Play, ChevronRight, MoreHorizontal, CirclePlay } from "lucide-react-native";

export type DeviceItem = {
    id: string;
    name: string;
    status: boolean;
    thumb: any;
};

export default function DeviceListItem({
    item,
    onView,
    onMore,
}: {
    item: DeviceItem;
    onView: () => void;
    onMore: () => void;
}) {
    return (
        <View style={s.card}>
            {/* Left thumbnail */}
            <Image source={item.thumb} style={s.thumb} />

            {/* Right content */}
            <View style={s.right}>
                {/* Top row: title + 3 dots */}
                <View style={s.topRow}>
                    <Text style={s.title} numberOfLines={1}>
                        {item.name}
                    </Text>
                   
                    <TouchableOpacity onPress={onMore} style={s.menuBtn} activeOpacity={0.7}>
                        <CirclePlay strokeWidth={1.5} size={24} color="#000" />
                        
                    </TouchableOpacity>

                     <TouchableOpacity onPress={onMore} style={s.menuBtn} activeOpacity={0.7}>
                        <MoreHorizontal size={24} color="#000" />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}


const s = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
        marginBottom:10,
    },

    // ✅ match screenshot: small rounded thumb on left
    thumb: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: "#e5e7eb",
    },

    right: {
        flex: 1,
        marginLeft: 10,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    menuBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginRight:10
    },

    statusRow: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        color: "#6b7280",
        fontWeight: "600",
    },

    // ✅ buttons row like screenshot (two pills)
    actionsRow: {
        marginTop: 10,
        flexDirection: "row",
        gap: 10,
    },

    viewBtn: {
        flex: 1,
        height: 34,
        borderRadius: 18,
        // backgroundColor: "#eef0ff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    viewText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#111827",
    },

    moreBtn: {
        width: 88,
        height: 34,
        borderRadius: 18,
        backgroundColor: "#eef0ff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    moreText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#111827",
    },
    moreArrow: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        marginTop: -1,
    },
});
