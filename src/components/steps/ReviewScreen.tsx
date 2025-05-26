import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { CoffeeSelection } from '../../types';

interface ReviewScreenProps {
  selection: CoffeeSelection;
  onPrevious: () => void;
  onOrder: () => void;
  onScroll?: any;
}

const ReviewScreen = ({ selection, onPrevious, onOrder, onScroll }: ReviewScreenProps) => {
  const calculateTotal = () => {
    const basePrice = 3.50; // Base coffee price
    const toppingsPrice = selection.toppings.reduce((sum, topping) => sum + topping.price, 0);
    return basePrice + toppingsPrice;
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coffee Bean</Text>
          <Text style={styles.selectionText}>{selection.bean?.name || 'None selected'}</Text>
          {selection.bean && <Text style={styles.detailText}>{selection.bean.flavor}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grind Level</Text>
          <Text style={styles.selectionText}>{selection.grind?.name || 'None selected'}</Text>
          {selection.grind && <Text style={styles.detailText}>{selection.grind.description}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation</Text>
          <Text style={styles.selectionText}>{selection.preparation?.name || 'None selected'}</Text>
          {selection.preparation && (
            <Text style={styles.detailText}>
              {selection.preparation.brewTime}s • {selection.preparation.temperature}°C
            </Text>
          )}
        </View>

        {selection.toppings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Toppings</Text>
            {selection.toppings.map((topping) => (
              <View key={topping.id} style={styles.toppingRow}>
                <Text style={styles.toppingName}>{topping.icon} {topping.name}</Text>
                {topping.price > 0 && (
                  <Text style={styles.toppingPrice}>+${topping.price.toFixed(2)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${calculateTotal().toFixed(2)}</Text>
        </View>
      </Animated.ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onPrevious}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.orderButton} onPress={onOrder}>
          <Text style={styles.orderButtonText}>Place Order</Text>
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
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(245, 222, 179, 0.1)',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4A574',
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 16,
    color: '#F5DEB3',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#8B7355',
    fontStyle: 'italic',
  },
  toppingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  toppingName: {
    fontSize: 14,
    color: '#F5DEB3',
  },
  toppingPrice: {
    fontSize: 14,
    color: '#D4A574',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(212, 165, 116, 0.2)',
    borderRadius: 12,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5DEB3',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
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
  orderButton: {
    backgroundColor: '#D4A574',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  orderButtonText: {
    color: '#2C1810',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewScreen; 