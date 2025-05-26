import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Topping } from '../../types';

interface ToppingSelectorProps {
  toppings: Topping[];
  selectedToppings: Topping[];
  onToggleTopping: (topping: Topping) => void;
  onNext: () => void;
  onPrevious: () => void;
  onScroll?: any;
}

const ToppingSelector = ({
  toppings,
  selectedToppings,
  onToggleTopping,
  onNext,
  onPrevious,
  onScroll,
}: ToppingSelectorProps) => {
  const groupedToppings = toppings.reduce((groups, topping) => {
    if (!groups[topping.category]) {
      groups[topping.category] = [];
    }
    groups[topping.category].push(topping);
    return groups;
  }, {} as Record<string, Topping[]>);

  const renderToppingGroup = (category: string, toppings: Topping[]) => (
    <View key={category} style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
      <View style={styles.toppingsRow}>
        {toppings.map((topping) => {
          const isSelected = selectedToppings.some(t => t.id === topping.id);
          return (
            <TouchableOpacity
              key={topping.id}
              style={[styles.toppingCard, isSelected && styles.selectedTopping]}
              onPress={() => onToggleTopping(topping)}
            >
              <Text style={styles.toppingIcon}>{topping.icon}</Text>
              <Text style={styles.toppingName}>{topping.name}</Text>
              {topping.price > 0 && (
                <Text style={styles.toppingPrice}>+${topping.price.toFixed(2)}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {Object.entries(groupedToppings).map(([category, toppings]) =>
          renderToppingGroup(category, toppings)
        )}
      </Animated.ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onPrevious}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Review Order</Text>
        </TouchableOpacity>
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
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4A574',
    marginBottom: 12,
  },
  toppingsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toppingCard: {
    width: '48%',
    backgroundColor: 'rgba(245, 222, 179, 0.1)',
    borderRadius: 12,
    borderColor: '#8B7355',
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTopping: {
    borderColor: '#D4A574',
    borderWidth: 2,
    backgroundColor: 'rgba(212, 165, 116, 0.2)',
  },
  toppingIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  toppingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F5DEB3',
    textAlign: 'center',
    marginBottom: 4,
  },
  toppingPrice: {
    fontSize: 12,
    color: '#D4A574',
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

export default ToppingSelector; 