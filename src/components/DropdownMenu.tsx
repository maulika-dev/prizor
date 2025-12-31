import React, { useMemo, useRef, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
    LayoutChangeEvent,
    Dimensions,
} from "react-native";

type MenuItem = {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onPress: () => void;
    danger?: boolean;
};

type Props = {
    trigger: (p: { open: () => void; ref: React.RefObject<View> }) => React.ReactNode;
    items: MenuItem[];
    width?: number; // default 190
    offsetX?: number; // default 0
    offsetY?: number; // default 8
    containerStyle?: ViewStyle;
};

export default function DropdownMenu({
    trigger,
    items,
    width = 190,
    offsetX = 0,
    offsetY = 8,
    containerStyle,
}: Props) {
    const anchorRef = useRef<View>(null);
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

    const open = () => {
        anchorRef.current?.measureInWindow((x, y, w, h) => {
            setPos({ x, y, w, h });
            setVisible(true);
        });
    };

    const close = () => setVisible(false);

    const { screenW, screenH } = useMemo(() => {
        const d = Dimensions.get("window");
        return { screenW: d.width, screenH: d.height };
    }, [visible]);

    // position: dropdown right aligned to trigger (like screenshot)
    const left = Math.min(
        Math.max(8, pos.x + pos.w - width + offsetX),
        screenW - width - 8
    );

    // prefer below, if not enough space then show above
    const estimatedH = 12 + items.length * 46;
    const belowY = pos.y + pos.h + offsetY;
    const aboveY = pos.y - estimatedH - offsetY;
    const top = belowY + estimatedH < screenH - 8 ? belowY : Math.max(8, aboveY);

    return (
        <>
            {/* Anchor wrapper */}
            <View ref={anchorRef} collapsable={false} style={containerStyle}>
                {trigger({ open, ref: anchorRef })}
            </View>

            <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
                {/* Backdrop */}
                <Pressable style={styles.backdrop} onPress={close}>
                    {/* Stop closing when pressing menu */}
                    <Pressable style={[styles.menu, { width, left, top }]} onPress={() => { }}>
                        {items.map((it, idx) => (
                            <Pressable
                                key={it.key}
                                style={({ pressed }) => [
                                    styles.row,
                                    pressed && styles.rowPressed,
                                    idx === items.length - 1 && { borderBottomWidth: 0 },
                                ]}
                                onPress={() => {
                                    close();
                                    it.onPress();
                                }}
                            >
                                <View style={styles.iconBox}>{it.icon}</View>
                                <Text style={[styles.label, it.danger && { color: "#e11d48" }]}>
                                    {it.label}
                                </Text>
                            </Pressable>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)", // dim like screenshot
    },
    menu: {
        position: "absolute",
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 6,
        overflow: "hidden",
        // shadow
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    row: {
        height: 46,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.06)",
    },
    rowPressed: {
        backgroundColor: "rgba(0,0,0,0.04)",
    },
    iconBox: {
        width: 30,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111",
    },
});
