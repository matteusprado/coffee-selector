import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SelectionStep } from '../../types';

interface StepIndicatorProps {
  steps: SelectionStep[];
  currentStep: SelectionStep;
  style?: ViewStyle;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, style }) => {
  const progress = useSharedValue(0);
  const currentIndex = steps.indexOf(currentStep);

  useEffect(() => {
    progress.value = withSpring(currentIndex / (steps.length - 1));
  }, [currentIndex, steps.length]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [0, 100]);
    return {
      width: `${width}%`,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <Animated.View style={[styles.progress, animatedProgressStyle]} />
      </View>
      <View style={styles.dots}>
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <View
              key={step}
              style={[
                styles.dot,
                isActive && styles.activeDot,
                isCurrent && styles.currentDot,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '80%',
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(139, 115, 85, 0.3)',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#D4A574',
    borderRadius: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(139, 115, 85, 0.3)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeDot: {
    backgroundColor: '#D4A574',
  },
  currentDot: {
    borderColor: '#F5DEB3',
    backgroundColor: '#D4A574',
    transform: [{ scale: 1.2 }],
  },
});

export default StepIndicator; 