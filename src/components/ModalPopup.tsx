import React, { useEffect, useRef } from "react";
import {
    Modal,
    View,
    Pressable,
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
    ViewStyle,
} from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;

    // optional
    sheetStyle?: ViewStyle;
    closeOnBackdrop?: boolean;

    // if you change backdropOpacity, notch will still match automatically
    backdropOpacity?: number; // default 0.55
};

const { width } = Dimensions.get("window");

const SHEET_RADIUS = 26;
const NOTCH = 56; // notch curve size
const CLOSE = 34; // X button size

export default function CommonModal({
    visible,
    onClose,
    children,
    sheetStyle,
    closeOnBackdrop = true,
    backdropOpacity = 0.55,
}: Props) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: visible ? 1 : 0,
            duration: visible ? 240 : 180,
            easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [visible, anim]);

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [70, 0],
    });

    const backdropAnimOpacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, backdropOpacity],
    });

    const notchColor = `rgba(0,0,0,${backdropOpacity})`; // MUST match backdrop

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: backdropAnimOpacity }]} />

            {/* Click outside to close */}
            {closeOnBackdrop && (
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            )}

            {/* Sheet */}
            <Animated.View
                style={[
                    styles.sheetWrap,
                    {
                        transform: [{ translateY }],
                        opacity: anim,
                    },
                ]}
                pointerEvents="box-none"
            >
                <View style={[styles.sheetOuter, sheetStyle]}>
                   
                    <View style={styles.sheetInner}>{children}</View>
                </View>
            </Animated.View>
        </Modal>
    );
}

function TextX() {
    return (
        <Animated.Text style={styles.closeText}>×</Animated.Text>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000",
    },

    sheetWrap: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        alignItems: "center",
    },

    // main sheet (important: overflow hidden to create cut notch)
    sheetOuter: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: SHEET_RADIUS,
        overflow: "hidden",
        paddingTop: 22,

        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 14 },
        elevation: 10,
    },

    // this circle is the "hole" cut into the top edge
    notchHole: {
        position: "absolute",
        top: -NOTCH / 2, // half outside, half inside = notch cut
        alignSelf: "center",
        width: NOTCH,
        height: NOTCH,
        borderRadius: NOTCH / 2,
        zIndex: 5,
    },

    // close button sits inside notch
    closeBtn: {
        position: "absolute",
        top: -CLOSE / 2,
        alignSelf: "center",
        width: CLOSE,
        height: CLOSE,
        borderRadius: CLOSE / 2,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,

        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },

    closeText: {
        fontSize: 22,
        fontWeight: "900",
        color: "#111",
        marginTop: -2,
    },

    sheetInner: {
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 18,
    },
});
