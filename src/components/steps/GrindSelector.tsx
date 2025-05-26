import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from 'react-native-reanimated';
import { GrindLevel } from '../../types';

interface GrindSelectorProps {
  grindLevels: GrindLevel[];
  selectedGrind: GrindLevel | null;
  onSelectGrind: (grind: GrindLevel) => void;
  onNext: () => void;
  onPrevious: () => void;
  onScroll?: any;
}

const GrindSelector = ({
  grindLevels,
  selectedGrind,
  onSelectGrind,
  onNext,
  onPrevious,
  onScroll,
}: GrindSelectorProps) => {
  const animatedValues = grindLevels.map(() => useSharedValue(0));

  React.useEffect(() => {
    grindLevels.forEach((_, index) => {
      animatedValues[index].value = withDelay(index * 100, withSpring(1));
    });
  }, []);

  return (
    <View style={styles.container}>
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={17}
      >
        {grindLevels.map((grind, index) => {
          const isSelected = selectedGrind?.id === grind.id;
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: animatedValues[index].value }],
            opacity: animatedValues[index].value,
          }));
          
          return (
            <Animated.View key={grind.id} style={[styles.grindCard, animatedStyle]}>
              <TouchableOpacity
                style={[styles.grindButton, isSelected && styles.selectedGrind]}
                onPress={() => onSelectGrind(grind)}
              >
                <Text style={styles.grindName}>{grind.name}</Text>
                <Text style={styles.grindDescription}>{grind.description}</Text>
                <Text style={styles.brewMethods}>{grind.brewMethods.join(', ')}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onPrevious}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        {selectedGrind && (
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F5DEB3', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8B7355', textAlign: 'center', marginBottom: 20 },
  grindCard: { marginBottom: 16 },
  grindButton: {
    backgroundColor: 'rgba(245, 222, 179, 0.1)',
    borderRadius: 16,
    borderColor: '#8B7355',
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  selectedGrind: { borderColor: '#D4A574', borderWidth: 3, backgroundColor: 'rgba(212, 165, 116, 0.2)' },
  grindName: { fontSize: 20, fontWeight: 'bold', color: '#F5DEB3', marginBottom: 8 },
  grindDescription: { fontSize: 14, color: '#D4A574', marginBottom: 8 },
  brewMethods: { fontSize: 12, color: '#8B7355', textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  backButton: { backgroundColor: '#8B7355', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20 },
  backButtonText: { color: '#F5DEB3', fontSize: 16, fontWeight: 'bold' },
  nextButton: { backgroundColor: '#D4A574', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20 },
  nextButtonText: { color: '#2C1810', fontSize: 16, fontWeight: 'bold' },
});

export default GrindSelector; 