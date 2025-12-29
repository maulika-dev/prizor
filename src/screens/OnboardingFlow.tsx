import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ThemedButton from '../components/ThemedButton';
import ThemedText from '../components/ThemedText';
import { useThemeColors } from '../theme/useTheme';
import { RootRoutes, RootStackParamList } from '../navigation/routes';

type Slide = {
  id: string;
  title: string;
  description: string;
  image: string;
  accent?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, RootRoutes.Onboarding>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides: Slide[] = [
  {
    id: 'monitor',
    title: 'Monitor Your World',
    description:
      'Keep an eye on what matters most with crystal-clear live feeds and instant motion alerts, right from your pocket.',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'realtime',
    title: 'Real-Time Monitoring',
    description:
      'Watch live video feeds anytime, anywhere. Receive instant notifications the moment motion is detected.',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    accent: '#f9dec9',
  },
  {
    id: 'manage',
    title: 'Manage All Cameras in One Place',
    description:
      'Switch between feeds instantly and access secure cloud storage. Keep an eye on what matters most, from anywhere.',
    image:
      'https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=1200&q=80',
    accent: '#e3f2fb',
  },
];

const OnboardingFlow: React.FC<Props> = ({ navigation }) => {
  const colors = useThemeColors();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === slides.length - 1;

  const indicatorDots = useMemo(
    () =>
      slides.map((slide, i) => ({
        id: slide.id,
        active: i === index,
      })),
    [index],
  );

  const handleNext = () => {
    if (isLast) {
      navigation.navigate(RootRoutes.Login);
      return;
    }

    const nextIndex = Math.min(slides.length - 1, index + 1);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setIndex(nextIndex);
  };

  const handleBack = () => {
    if (index === 0) {
      navigation.goBack();
      return;
    }

    const prevIndex = Math.max(0, index - 1);
    listRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    setIndex(prevIndex);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const current = Math.round(offsetX / SCREEN_WIDTH);
    if (current !== index) {
      setIndex(current);
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={styles.skipRow}>
        {!isLast ? (
          <Pressable onPress={onDone} hitSlop={12}>
            <ThemedText
              style={[styles.skipText, { color: colors.primary }]}
              variant="button">
              Skip
            </ThemedText>
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      <View
        style={[
          styles.imageCard,
          {
            backgroundColor: item.accent ?? '#fff',
            shadowColor: colors.cardShadow,
          },
        ]}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      <ThemedText variant="title" style={styles.title}>
        {item.title}
      </ThemedText>
      <ThemedText muted style={styles.description}>
        {item.description}
      </ThemedText>

      <View style={styles.indicatorRow}>
        {indicatorDots.map(dot => (
          <View
            key={dot.id}
            style={[
              styles.indicator,
              {
                backgroundColor: dot.active
                  ? colors.primary
                  : colors.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ref={listRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.actions}>
        <View style={styles.backWrapper}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <ThemedText variant="button" style={styles.backText}>
              {index === 0 ? 'Back' : 'Back'}
            </ThemedText>
          </Pressable>
        </View>
        <ThemedButton
          label={isLast ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.nextButton}
          rightIcon={<ArrowRight color={colors.primaryText} size={18} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  slide: {
    paddingHorizontal: 24,
    paddingTop: 12,
    flex: 1,
    alignItems: 'center',
  },
  skipRow: {
    width: '100%',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
  },
  imageCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  image: {
    width: '100%',
    height: SCREEN_WIDTH * 0.9,
    resizeMode: 'cover',
  },
  title: {
    marginTop: 22,
    textAlign: 'center',
  },
  description: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  indicatorRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 10,
  },
  indicator: {
    width: 26,
    height: 10,
    borderRadius: 8,
  },
  actions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backWrapper: {
    flex: 1,
  },
  backText: {
    textAlign: 'left',
  },
  nextButton: {
    flex: 1.4,
  },
});

export default OnboardingFlow;
