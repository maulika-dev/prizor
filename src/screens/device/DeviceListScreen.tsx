import React, { useMemo } from 'react';
import {
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import {
  Bell,
  CalendarDays,
  Grid,
  Home,
  Menu,
  Mic,
  Play,
  Search,
  Settings,
  Share2,
  Video,
} from 'lucide-react-native';

import ThemedText from '../../components/ThemedText';
import { useThemeColors } from '../../theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeviceState = 'recording' | 'idle' | 'motion' | 'offline' | 'error';

export type Device = {
  id: string;
  name: string;
  status: string;
  state: DeviceState;
  image: string;
};

const DEVICES: Device[] = [
  {
    id: '8C293A10',
    name: 'Driveway Cam',
    status: 'Recording • 10:42 AM',
    state: 'recording',
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '5B142D99',
    name: 'Living Room',
    status: 'Offline • Last seen 2h ago',
    state: 'offline',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '9F728B44',
    name: 'Backyard',
    status: 'Motion Detected',
    state: 'motion',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'A4556C71',
    name: 'Garage',
    status: 'Idle • 10:42 AM',
    state: 'idle',
    image: 'https://images.unsplash.com/photo-1582719478248-3dd3c2b64c2e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2E991A03',
    name: 'Porch',
    status: 'Person Detected',
    state: 'motion',
    image: 'https://images.unsplash.com/photo-1523419400524-223f97e5c783?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '6D442E11',
    name: 'Baby Monitor',
    status: 'Error • Check Connection',
    state: 'error',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  },
];

type Props = {
  onDevicePress?: (device: Device) => void;
};

const DeviceListScreen: React.FC<Props> = ({ onDevicePress }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const statusColor = (state: DeviceState) => {
    switch (state) {
      case 'recording':
      case 'motion':
        return colors.success;
      case 'offline':
      case 'error':
        return colors.danger;
      default:
        return colors.warning;
    }
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
      <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={styles.cardImageStyle}>
        <View style={styles.overlay} />
        <View style={styles.cardHeader}>
          <View style={styles.nameRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor(item.state) }]} />
            <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
          </View>
          <View style={[styles.iconBadge, { backgroundColor: colors.overlayMedium }]}>
            <Settings color={colors.primaryText} size={18} strokeWidth={2.2} />
          </View>
        </View>

        <ThemedText muted style={styles.cardSubtitle}>
          {item.status}
        </ThemedText>

        <View style={styles.centerPlay}>
          <Pressable onPress={() => onDevicePress?.(item)}>
            <View style={[styles.playButton, { backgroundColor: colors.primary }]}>
              <Play color={colors.primaryText} size={28} />
            </View>
          </Pressable>
        </View>

        <View style={styles.sideActions}>
          <View style={[styles.actionIcon, { backgroundColor: colors.overlayMedium }]}>
            <Mic color={colors.primaryText} size={18} />
          </View>
          <View style={[styles.actionIcon, { backgroundColor: colors.overlayMedium }]}>
            <Bell color={colors.primaryText} size={18} />
          </View>
          <View style={[styles.actionIcon, { backgroundColor: colors.overlayMedium }]}>
            <Video color={colors.primaryText} size={18} />
          </View>
          <View style={[styles.actionIcon, { backgroundColor: colors.overlayMedium }]}>
            <Share2 color={colors.primaryText} size={18} />
          </View>
        </View>
      </ImageBackground>
      <ThemedText muted style={styles.deviceId}>
        ID: {item.id}
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={DEVICES}
        keyExtractor={item => item.id}
        renderItem={renderDevice}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <ThemedText variant="title" style={styles.headerTitle}>
                My Devices
              </ThemedText>
              <View style={styles.headerIcons}>
                <Grid color={colors.text} size={22} />
                <Menu color={colors.text} size={22} />
              </View>
            </View>

            <View style={[styles.searchBar, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
              <Search color={colors.mutedText} size={18} />
              <TextInput
                placeholder="Search devices..."
                placeholderTextColor={colors.placeholder}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>

            <View style={styles.tabsRow}>
              <ThemedText style={[styles.tabText, { color: colors.primary }]}>All</ThemedText>
              <ThemedText style={[styles.tabTextMuted, { color: colors.mutedText }]}>Favorites</ThemedText>
              <ThemedText style={[styles.tabTextMuted, { color: colors.mutedText }]}>Offline</ThemedText>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={styles.bottomNav}>
            <View style={styles.navItem}>
              <Home color={colors.primary} size={22} />
              <ThemedText style={[styles.navLabel, { color: colors.primary }]}>Home</ThemedText>
            </View>
            <View style={styles.navItem}>
              <CalendarDays color={colors.mutedText} size={22} />
              <ThemedText muted style={styles.navLabel}>Events</ThemedText>
            </View>
            <View style={styles.navItem}>
              <Settings color={colors.mutedText} size={22} />
              <ThemedText muted style={styles.navLabel}>Settings</ThemedText>
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    listContent: { paddingHorizontal: 14, paddingBottom: 16 },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 14,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 15,
    },
    tabsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingVertical: 12,
      gap: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '700',
    },
    tabTextMuted: {
      fontSize: 14,
      fontWeight: '600',
    },
    card: {
      borderRadius: 16,
      marginTop: 14,
      overflow: 'hidden',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    cardImage: {
      height: 210,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    cardImageStyle: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlayStrong,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingTop: 10,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.primaryText,
    },
    cardSubtitle: {
      color: colors.primaryText,
      paddingHorizontal: 12,
      marginTop: 2,
    },
    iconBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerPlay: {
      alignItems: 'center',
      marginTop: 22,
    },
    playButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideActions: {
      position: 'absolute',
      right: 8,
      top: 64,
      gap: 8,
      alignItems: 'center',
    },
    actionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deviceId: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    bottomNav: {
      marginTop: 18,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    navItem: {
      alignItems: 'center',
      gap: 4,
    },
    navLabel: {
      fontSize: 12,
      fontWeight: '600',
    },
  });

export default DeviceListScreen;
