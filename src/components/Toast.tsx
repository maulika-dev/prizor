import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Dimensions } from "react-native";

type ToastProps = {
    visible: boolean;
    message: string;
    durationMs?: number;      // auto hide time
    onHide?: () => void;      // called after hidden
    bottomOffset?: number;    // position from bottom
};

export default function Toast({
    visible,
    message,
    durationMs = 1500,
    onHide,
    bottomOffset = 400, // adjust to match your UI (PTZ area)
}: ToastProps) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(8)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (visible) {
            // show
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 140, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 140, useNativeDriver: true }),
            ]).start();

            // auto hide
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                hide();
            }, durationMs);
        } else {
            // if parent toggles visible=false
            if (timerRef.current) clearTimeout(timerRef.current);
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 8, duration: 120, useNativeDriver: true }),
            ]).start();
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, message]);

    const hide = () => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 8, duration: 120, useNativeDriver: true }),
        ]).start(() => onHide?.());
    };

    if (!visible) return null;

    return (
        <View pointerEvents="none" style={[styles.wrap, { bottom: bottomOffset }]}>
            <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
                <Text style={styles.text}>{message}</Text>
            </Animated.View>
        </View>
    );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrap: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 9999,
    },
    toast: {
        maxWidth: Math.min(width - 40, 320),
        backgroundColor: "rgba(0,0,0,0.75)",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    text: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});
