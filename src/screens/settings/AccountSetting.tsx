import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootRoutes, RootStackParamList } from '../../navigation/routes';

type Props = NativeStackScreenProps<RootStackParamList, RootRoutes.AccountSetting>;

const AccountSetting: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const infoRows = [
        { label: 'Profile Photo', value: 'avatar' as const },
        { label: 'Username', value: 'dspatel' },
        { label: 'Email', value: 'con****@gmail.com' },
        { label: 'Phone Number', value: 'not_bound' as const },
        { label: 'Region', value: 'India' },
    ];

    const secondaryRows = [
        { label: 'Account Security' },
        { label: 'Export Account Information' },
        { label: 'Delete Account' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            <View style={[styles.header, { paddingTop: Math.max(insets.top - 6, 10) }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
                    <ArrowLeft size={22} color="#2f2f32" />
                </TouchableOpacity>
                <Text style={styles.title}>Account</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    {infoRows.map((row, idx) => (
                        <React.Fragment key={row.label}>
                            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                                <Text style={styles.rowLabel}>{row.label}</Text>
                                <View style={styles.rowRight}>
                                    {row.value === 'avatar' ? (
                                        <View style={styles.avatar}>
                                            <View style={styles.avatarInner} />
                                        </View>
                                    ) : row.value === 'not_bound' ? (
                                        <View style={styles.tag}>
                                            <Text style={styles.tagText}>Not Bound</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.rowValue}>{row.value}</Text>
                                    )}
                                    <ChevronRight size={18} color="#c2c4c8" />
                                </View>
                            </TouchableOpacity>
                            {idx !== infoRows.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>

                {secondaryRows.map((row) => (
                    <View style={styles.card} key={row.label}>
                        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                            <Text style={styles.rowLabel}>{row.label}</Text>
                            <ChevronRight size={18} color="#c2c4c8" />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    backBtn: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2f2f32',
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    rowLabel: {
        fontSize: 16,
        color: '#121212',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    rowValue: {
        fontSize: 15,
        color: '#5a5a5f',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#ededf1',
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: '#d9dbe1',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f8fb',
    },
    avatarInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#d8dbe1',
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: '#fff2e7',
        borderWidth: 1,
        borderColor: '#f3c39c',
    },
    tagText: {
        color: '#e67a2e',
        fontSize: 13,
        fontWeight: '600',
    },
    logoutBtn: {
        marginTop: 18,
        marginHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 14,
        alignItems: 'center',
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    logoutText: {
        color: '#f25546',
        fontSize: 17,
        fontWeight: '700',
    },
});

export default AccountSetting;
