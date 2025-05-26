import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  interpolate,
  withSequence,
  withTiming,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import { CoffeeBean } from '../../types';

interface BeanSelectorProps {
  beans: CoffeeBean[];
  selectedBean: CoffeeBean | null;
  onSelectBean: (bean: CoffeeBean) => void;
  onNext: () => void;
  onScroll?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Coffee Bag Component
const CoffeeBag: React.FC<{ 
  bean: CoffeeBean; 
  isSelected: boolean; 
  onPress: () => void;
  animationValue: Animated.SharedValue<number>;
}> = ({ bean, isSelected, onPress, animationValue }) => {
  const bagAnimation = useSharedValue(0);
  const beanSpillAnimation = useSharedValue(0);

  React.useEffect(() => {
    if (isSelected) {
      // Animate bag opening and beans spilling
      bagAnimation.value = withSpring(1, { damping: 10, stiffness: 150 });
      beanSpillAnimation.value = withDelay(
        200,
        withSpring(1, { damping: 8, stiffness: 120 })
      );
    } else {
      bagAnimation.value = withSpring(0, { damping: 15, stiffness: 200 });
      beanSpillAnimation.value = withSpring(0, { damping: 15, stiffness: 200 });
    }
  }, [isSelected]);

  const bagStyle = useAnimatedStyle(() => {
    const rotation = interpolate(bagAnimation.value, [0, 1], [0, -15]);
    const scale = interpolate(animationValue.value, [0, 1], [0.5, 1]);
    const translateY = interpolate(animationValue.value, [0, 1], [50, 0]);
    
    return {
      transform: [
        { scale },
        { translateY },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const getBagColor = React.useCallback((beanType: string) => {
    const colorMap: { [key: string]: string } = {
      'Arabica': '#8B4513',
      'Robusta': '#654321',
      'Liberica': '#A0522D',
      'Excelsa': '#D2691E',
    };
    return colorMap[beanType] || '#8B4513';
  }, []);

  const getBagPattern = React.useCallback((beanType: string) => {
    // Different patterns for different bean types
    const patterns: { [key: string]: React.ReactNode[] } = {
      'Arabica': [
        <View key="pattern1" style={[styles.bagPattern, { top: 10, left: 8 }]} />,
        <View key="pattern2" style={[styles.bagPattern, { top: 20, left: 12 }]} />,
      ],
      'Robusta': [
        <View key="pattern1" style={[styles.bagStripe, { top: 15 }]} />,
        <View key="pattern2" style={[styles.bagStripe, { top: 25 }]} />,
      ],
      'Liberica': [
        <View key="pattern1" style={[styles.bagDots, { top: 10, left: 6 }]} />,
        <View key="pattern2" style={[styles.bagDots, { top: 10, left: 16 }]} />,
        <View key="pattern3" style={[styles.bagDots, { top: 20, left: 11 }]} />,
      ],
      'Excelsa': [
        <View key="pattern1" style={[styles.bagWave, { top: 12 }]} />,
        <View key="pattern2" style={[styles.bagWave, { top: 22 }]} />,
      ],
    };
    return patterns[beanType] || patterns['Arabica'];
  }, []);

  const bagColor = React.useMemo(() => getBagColor(bean.name), [bean.name, getBagColor]);
  const bagPattern = React.useMemo(() => getBagPattern(bean.name), [bean.name, getBagPattern]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[styles.bagContainer, bagStyle]}>
        {/* Coffee Bag */}
        <View style={[styles.coffeeBag, { backgroundColor: bagColor }]}>
          {/* Bag opening */}
          <Animated.View style={[styles.bagOpening, {
            transform: [{ scaleY: bagAnimation }]
          }]} />
          
          {/* Bag label area */}
          <View style={styles.bagLabel}>
            <Text style={styles.bagLabelText}>{bean.name}</Text>
          </View>
          
          {/* Bag patterns */}
          {bagPattern}
          
          {/* Bag fold lines */}
          <View style={styles.bagFold} />
        </View>

        {/* Spilled Beans */}
        <SpilledBeans 
          beanColor={bean.color} 
          animationValue={beanSpillAnimation}
          isSelected={isSelected}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Spilled Beans Component
const SpilledBeans: React.FC<{
  beanColor: string;
  animationValue: Animated.SharedValue<number>;
  isSelected: boolean;
}> = ({ beanColor, animationValue, isSelected }) => {
  const beans = React.useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 40 - 20,
      y: Math.random() * 30 + 10,
      delay: Math.random() * 300,
      rotation: Math.random() * 360,
    })), []
  );

  return (
    <View style={styles.spilledBeansContainer}>
      {beans.map((bean) => (
        <IndividualBean
          key={bean.id}
          color={beanColor}
          initialX={bean.x}
          initialY={bean.y}
          delay={bean.delay}
          rotation={bean.rotation}
          animationValue={animationValue}
        />
      ))}
    </View>
  );
};

// Individual Bean Component
const IndividualBean: React.FC<{
  color: string;
  initialX: number;
  initialY: number;
  delay: number;
  rotation: number;
  animationValue: Animated.SharedValue<number>;
}> = ({ color, initialX, initialY, delay, rotation, animationValue }) => {
  const beanStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animationValue.value, [0, 1], [0, initialX]);
    const translateY = interpolate(animationValue.value, [0, 1], [0, initialY]);
    const scale = interpolate(animationValue.value, [0, 1], [0, 1]);
    const rotate = interpolate(animationValue.value, [0, 1], [0, rotation]);
    
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
      opacity: animationValue.value,
    };
  });

  return (
    <Animated.View style={[styles.individualBean, { backgroundColor: color }, beanStyle]}>
      <View style={styles.beanCrack} />
    </Animated.View>
  );
};

const BeanSelector: React.FC<BeanSelectorProps> = ({
  beans,
  selectedBean,
  onSelectBean,
  onNext,
  onScroll,
}) => {
  const animatedValues = beans.map(() => useSharedValue(0));

  React.useEffect(() => {
    // Stagger animation for bean cards
    beans.forEach((_, index) => {
      animatedValues[index].value = withDelay(
        index * 100,
        withSpring(1, { damping: 15, stiffness: 200, mass: 1 })
      );
    });
  }, [beans, animatedValues]);

  const renderBeanCard = React.useCallback((bean: CoffeeBean, index: number) => {
    const isSelected = selectedBean?.id === bean.id;
    
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(animatedValues[index].value, [0, 1], [0.5, 1]);
      const translateY = interpolate(animatedValues[index].value, [0, 1], [50, 0]);
      return {
        transform: [
          { scale },
          { translateY },
        ],
      };
    });
    
    return (
      <Animated.View
        key={bean.id}
        style={[
          styles.beanCard,
          animatedStyle,
          isSelected && styles.selectedBeanCard
        ]}
      >
        <CoffeeBag
          bean={bean}
          isSelected={isSelected}
          onPress={() => onSelectBean(bean)}
          animationValue={animatedValues[index]}
        />
        
        <View style={styles.beanInfo}>
          <Text style={styles.beanName}>{bean.name}</Text>
          <Text style={styles.beanOrigin}>{bean.origin}</Text>
          <Text style={styles.beanFlavor}>{bean.flavor}</Text>
          
          <View style={styles.strengthContainer}>
            <Text style={styles.strengthLabel}>Strength: </Text>
            {Array.from({ length: 5 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.strengthDot,
                  i < bean.strength && styles.strengthDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    );
  }, [selectedBean, onSelectBean, animatedValues]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {beans.map((bean, index) => renderBeanCard(bean, index))}
      </Animated.ScrollView>

      {selectedBean && (
        <Animated.View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>Continue to Grind</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  beanCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 222, 179, 0.15)',
    borderRadius: 16,
    borderColor: '#8B7355',
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
  },
  selectedBeanCard: {
    borderWidth: 3,
    borderColor: '#D4A574',
    backgroundColor: 'rgba(212, 165, 116, 0.1)',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Coffee Bag Styles
  bagContainer: {
    width: 80,
    height: 100,
    marginRight: 16,
    position: 'relative',
  },
  coffeeBag: {
    width: 50,
    height: 70,
    borderRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bagOpening: {
    position: 'absolute',
    top: -5,
    left: 5,
    right: 5,
    height: 10,
    backgroundColor: '#2C1810',
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bagLabel: {
    position: 'absolute',
    top: 15,
    left: 2,
    right: 2,
    height: 20,
    backgroundColor: 'rgba(245, 222, 179, 0.9)',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagLabelText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  bagFold: {
    position: 'absolute',
    bottom: 10,
    left: 5,
    right: 5,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 1,
  },
  
  // Bag Patterns
  bagPattern: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(245, 222, 179, 0.6)',
  },
  bagStripe: {
    position: 'absolute',
    left: 5,
    right: 5,
    height: 2,
    backgroundColor: 'rgba(245, 222, 179, 0.6)',
  },
  bagDots: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(245, 222, 179, 0.6)',
  },
  bagWave: {
    position: 'absolute',
    left: 5,
    right: 5,
    height: 1,
    backgroundColor: 'rgba(245, 222, 179, 0.6)',
    borderRadius: 2,
  },
  
  // Spilled Beans Styles
  spilledBeansContainer: {
    position: 'absolute',
    bottom: -10,
    left: 10,
    right: 10,
    height: 40,
  },
  individualBean: {
    position: 'absolute',
    width: 6,
    height: 8,
    borderRadius: 3,
    top: 0,
    left: 20,
  },
  beanCrack: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 0.5,
  },
  
  // Bean Info Styles  
  beanInfo: {
    flex: 1,
  },
  beanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5DEB3',
    marginBottom: 4,
  },
  beanOrigin: {
    fontSize: 14,
    color: '#D4A574',
    marginBottom: 6,
  },
  beanFlavor: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthLabel: {
    fontSize: 12,
    color: '#8B7355',
  },
  strengthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(139, 115, 85, 0.3)',
    marginLeft: 4,
  },
  strengthDotActive: {
    backgroundColor: '#D4A574',
  },
  
  // Button Styles
  nextButtonContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  nextButton: {
    backgroundColor: '#D4A574',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButtonText: {
    color: '#2C1810',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BeanSelector; 