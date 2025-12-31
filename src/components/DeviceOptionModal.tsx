// DeviceActionSheet.tsx (Reusable Bottom Sheet Modal - like your screenshot)
import React, { useEffect, useMemo, useRef } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Easing,
    Platform,
    Image
} from "react-native";

import { X, ChevronRight, Webcam } from "lucide-react-native";
import lens from '../../assets/img/lens.png';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes, RootStackParamList } from "../navigation/routes";

export type DeviceSheetItem = {
    key: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    disabled?: boolean;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    title: string;           // "BERYL 1"
    subtitle?: string;       // "From User vin****@gmail.com"
    items: DeviceSheetItem[];

    // optional fine-tuning
    closeOnBackdropPress?: boolean;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;


export default function DeviceActionSheet({
    visible,
    onClose,
    title,
    subtitle,
    items,
    closeOnBackdropPress = true,
}: Props) {
    const slide = useRef(new Animated.Value(0)).current; // 0 hidden, 1 shown
    const overlay = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation<Nav>();

    const sheetTranslateY = useMemo(() => {
        return slide.interpolate({
            inputRange: [0, 1],
            outputRange: [280, 0], // slide-up distance
        });
    }, [slide]);

    const onDeviceDetailClick = async () => {
        onClose();
        navigation.navigate(RootRoutes.DeviceDetails, {
            deviceId: 'NX001SN001',
            name: 'Front Door',
            status: 'online', // "online" | "offline"
        });
    }

    

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(overlay, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
                Animated.timing(slide, {
                    toValue: 1,
                    duration: 220,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(overlay, {
                    toValue: 0,
                    duration: 140,
                    useNativeDriver: true,
                }),
                Animated.timing(slide, {
                    toValue: 0,
                    duration: 160,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, overlay, slide]);

    const handleClose = () => onClose();

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
            <View style={styles.root}>
                {/* Backdrop */}
                <Animated.View style={[styles.backdrop, { opacity: overlay }]}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closeOnBackdropPress ? handleClose : undefined}
                    />
                </Animated.View>

                {/* Sheet */}
                <Animated.View style={[{ transform: [{ translateY: sheetTranslateY }] }]}>
                    <View style={styles.sheet}>
                        {/* Header */}
                        <View style={styles.headerRow}>
                            <View style={styles.headerLeft}>
                                <Image source={lens} style={styles.headerIconWrap} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title} numberOfLines={1}>
                                        {title}
                                    </Text>
                                    {subtitle ? (
                                        <Text style={styles.subtitle} numberOfLines={1}>
                                            {subtitle}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>

                            <Pressable onPress={handleClose} hitSlop={10}>
                                <X color="#b4b4b4" />

                            </Pressable>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Items */}
                        <View style={styles.itemsCard}>
                            {items.map((it, idx) => {
                                const isLast = idx === items.length - 1;
                                return (
                                    <Pressable
                                        key={it.key}
                                        onPress={onDeviceDetailClick}
                                        style={({ pressed }) => [
                                            styles.itemRow,
                                            pressed && !it.disabled ? styles.itemPressed : null,
                                            it.disabled ? styles.itemDisabled : null,
                                            !isLast ? styles.itemBorder : null,
                                        ]}
                                    >
                                        <View style={styles.itemLeft}>
                                            <Webcam />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.itemTitle} numberOfLines={1}>
                                                    {it.title}
                                                </Text>
                                                {it.subtitle ? (
                                                    <Text style={styles.itemSub} numberOfLines={1}>
                                                        {it.subtitle}
                                                    </Text>
                                                ) : null}
                                            </View>
                                        </View>

                                        <View style={styles.itemRight}>
                                            <ChevronRight color="#b4b4b4" />
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* Safe bottom space */}
                        <View style={{ height: Platform.OS === "ios" ? 10 : 6 }} />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

/** Simple chevron without icon library */

const styles = StyleSheet.create({
    root: { flex: 1, justifyContent: "flex-end" },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
    },

    sheet: {
        backgroundColor: "#f3f3f3",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },

    headerLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    headerIconWrap: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "#F2F3F5",
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontSize: 16,
        fontWeight: "500",
        color: "#101114",
    },

    subtitle: {
        marginTop: 2,
        fontSize: 12,
        color: "#8A8F98",
        fontWeight: "500",
    },

    xLine: {
        position: "absolute",
        width: 14,
        height: 2,
        borderRadius: 2,
        backgroundColor: "#6B7280",
        transform: [{ rotate: "45deg" }],
    },

    divider: {
        marginTop: 20,
        marginBottom: 10,
    },

    itemsCard: {
        borderRadius: 14,
        backgroundColor: "#fff",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ECEEF1",
        marginLeft: 10,
        marginRight: 10
    },

    itemRow: {
        paddingHorizontal: 12,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#ECEEF1",
    },

    itemPressed: {
        backgroundColor: "#F7F8FA",
    },

    itemDisabled: {
        opacity: 0.5,
    },

    itemLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    itemIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#F2F3F5",
        alignItems: "center",
        justifyContent: "center",
    },

    itemTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: "#101114",
    },

    itemSub: {
        marginTop: 2,
        fontSize: 12,
        color: "#8A8F98",
        fontWeight: "500",
    },

    itemRight: {
        paddingLeft: 10,
        alignItems: "flex-end",
        justifyContent: "center",
    },
});
