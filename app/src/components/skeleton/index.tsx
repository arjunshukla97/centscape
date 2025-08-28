import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, ViewStyle, Dimensions} from 'react-native';
import {THEME} from '../../utils/constants';
import normalize from '../../utils/functions';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ShimmerProps {
  style?: ViewStyle;
}

export const AnimatedSkeleton = ({style}: ShimmerProps) => {
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerTranslate]);

  const translateX = shimmerTranslate.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{translateX}],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.skeleton,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: normalize(4),
  },
  shimmer: {
    position: 'absolute',
    width: '60%',
    height: '100%',
    backgroundColor: THEME.white,
    opacity: 0.4,
  },
});
