import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { PreparationMethod } from '../../types';

interface PreparationSelectorProps {
  methods: PreparationMethod[];
  selectedMethod: PreparationMethod | null;
  onSelectMethod: (method: PreparationMethod) => void;
  onNext: () => void;
  onPrevious: () => void;
  onScroll?: any;
}

const PreparationSelector = ({
  methods,
  selectedMethod,
  onSelectMethod,
  onNext,
  onPrevious,
  onScroll,
}: PreparationSelectorProps) => {
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {methods.map((method) => {
          const isSelected = selectedMethod?.id === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, isSelected && styles.selectedMethod]}
              onPress={() => onSelectMethod(method)}
            >
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
              <Text style={styles.methodDetails}>
                {method.brewTime}s • {method.temperature}°C
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onPrevious}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        {selectedMethod && (
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
  methodCard: {
    backgroundColor: 'rgba(245, 222, 179, 0.1)',
    borderRadius: 16,
    borderColor: '#8B7355',
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedMethod: { 
    borderColor: '#D4A574', 
    borderWidth: 3, 
    backgroundColor: 'rgba(212, 165, 116, 0.2)',
  },
  methodIcon: { 
    fontSize: 40, 
    marginBottom: 12,
  },
  methodName: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#F5DEB3', 
    marginBottom: 8,
  },
  methodDescription: { 
    fontSize: 14, 
    color: '#D4A574', 
    marginBottom: 8, 
    textAlign: 'center',
  },
  methodDetails: { 
    fontSize: 12, 
    color: '#8B7355',
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20,
  },
  backButton: { 
    backgroundColor: '#8B7355', 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 20,
  },
  backButtonText: { 
    color: '#F5DEB3', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  nextButton: { 
    backgroundColor: '#D4A574', 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 20,
  },
  nextButtonText: { 
    color: '#2C1810', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
});

export default PreparationSelector; 