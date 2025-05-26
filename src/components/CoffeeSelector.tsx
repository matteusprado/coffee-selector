import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withClamp,
  withDelay,
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useDerivedValue,
  ReduceMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { CoffeeSelection, SelectionStep } from '../types';
import { COFFEE_BEANS, GRIND_LEVELS, PREPARATION_METHODS, TOPPINGS } from '../constants/coffeeData';

import BeanSelector from './steps/BeanSelector';
import GrindSelector from './steps/GrindSelector';
import PreparationSelector from './steps/PreparationSelector';
import ToppingSelector from './steps/ToppingSelector';
import ReviewScreen from './steps/ReviewScreen';
import StepIndicator from './ui/StepIndicator';
import CoffeeCup3D from './3d/CoffeeCup3D';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const EXPANDED_HEADER_HEIGHT = SCREEN_HEIGHT * 0.45;
const COLLAPSED_HEADER_HEIGHT = SCREEN_HEIGHT * 0.1;
const SCROLL_THRESHOLD = 0;

const CoffeeSelector: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SelectionStep>('bean');
  const [selection, setSelection] = useState<CoffeeSelection>({
    bean: null,
    grind: null,
    preparation: null,
    toppings: [],
    size: 'medium',
    temperature: 'hot',
  });

  // Animation values
  const stepOpacity = useSharedValue(0);
  const stepTranslateY = useSharedValue(50);
  const scrollY = useSharedValue(0);
  const headerCollapsed = useSharedValue(0);

  const steps: SelectionStep[] = ['bean', 'grind', 'preparation', 'toppings', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);

  // Step titles and subtitles
  const stepContent = {
    bean: {
      title: 'Choose Your Coffee Bean',
      subtitle: 'Select the perfect bean to start your coffee journey',
    },
    grind: {
      title: 'Select Grind Level',
      subtitle: 'The grind affects extraction and flavor',
    },
    preparation: {
      title: 'Choose Preparation Method',
      subtitle: 'How would you like your coffee prepared?',
    },
    toppings: {
      title: 'Add Toppings',
      subtitle: 'Customize your coffee with delicious additions',
    },
    review: {
      title: 'Review Your Order',
      subtitle: 'Check your perfect coffee selection',
    },
  };

  // ✅ Fixed: Use useDerivedValue for any conditional logic based on shared values
  const isHeaderCollapsed = useDerivedValue(() => {
    return scrollY.value > SCROLL_THRESHOLD;
  });

  useEffect(() => {
    // Animate step transition
    stepOpacity.value = withDelay(100, withSpring(1));
    stepTranslateY.value = withDelay(100, withSpring(0));
    
    // Reset scroll position on step change
    scrollY.value = 0;
    headerCollapsed.value = withSpring(0);
  }, [currentStep]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      
      // Determine if header should be collapsed
      const shouldCollapse = scrollY.value > SCROLL_THRESHOLD ? 1 : 0;
      headerCollapsed.value = shouldCollapse
    },
  });

  const animatedStepStyle = useAnimatedStyle(() => ({
    opacity: stepOpacity.value,
    transform: [{ translateY: stepTranslateY.value }],
  }));

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      headerCollapsed.value,
      [0, 1],
      [EXPANDED_HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT]
    );
    
    return {
      height,
    };
  });

  // Expanded header elements
  const animatedExpandedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(headerCollapsed.value, [0, 1], [1, 0]);
    
    return {
      opacity,
    };
  });

  // Collapsed header elements
  const animatedCollapsedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(headerCollapsed.value, [0, 1], [0, 1]);
    
    return {
      opacity,
    };
  });

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      stepOpacity.value = 0;
      stepTranslateY.value = 50;
      setTimeout(() => setCurrentStep(steps[nextIndex]), 200);
    }
  };

  const previousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      stepOpacity.value = 0;
      stepTranslateY.value = 50;
      setTimeout(() => setCurrentStep(steps[prevIndex]), 200);
    }
  };

  const updateSelection = (updates: Partial<CoffeeSelection>) => {
    setSelection(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'bean':
        return (
          <BeanSelector
            beans={COFFEE_BEANS}
            selectedBean={selection.bean}
            onSelectBean={(bean) => updateSelection({ bean })}
            onNext={nextStep}
            onScroll={scrollHandler}
          />
        );
      case 'grind':
        return (
          <GrindSelector
            grindLevels={GRIND_LEVELS}
            selectedGrind={selection.grind}
            onSelectGrind={(grind) => updateSelection({ grind })}
            onNext={nextStep}
            onPrevious={previousStep}
            onScroll={scrollHandler}
          />
        );
      case 'preparation':
        return (
          <PreparationSelector
            methods={PREPARATION_METHODS}
            selectedMethod={selection.preparation}
            onSelectMethod={(preparation) => updateSelection({ preparation })}
            onNext={nextStep}
            onPrevious={previousStep}
            onScroll={scrollHandler}
          />
        );
      case 'toppings':
        return (
          <ToppingSelector
            toppings={TOPPINGS}
            selectedToppings={selection.toppings}
            onToggleTopping={(topping) => {
              const isSelected = selection.toppings.some(t => t.id === topping.id);
              const newToppings = isSelected
                ? selection.toppings.filter(t => t.id !== topping.id)
                : [...selection.toppings, topping];
              updateSelection({ toppings: newToppings });
            }}
            onNext={nextStep}
            onPrevious={previousStep}
            onScroll={scrollHandler}
          />
        );
      case 'review':
        return (
          <ReviewScreen
            selection={selection}
            onPrevious={previousStep}
            onOrder={() => {
              console.log('Order placed:', selection);
            }}
            onScroll={scrollHandler}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2C1810', '#1A0E08', '#0F0704']}
        style={styles.gradient}
      >
        {/* Animated Header */}
        <Animated.View style={[styles.header, animatedHeaderStyle]}>
          
          {/* Expanded Header Content */}
          <Animated.View style={[styles.expandedContent, animatedExpandedContentStyle]}>
            <View style={styles.cupContainer}>
              <CoffeeCup3D selection={selection} height={200} width={200} />
            </View>
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{stepContent[currentStep].title}</Text>
              <Text style={styles.subtitle}>{stepContent[currentStep].subtitle}</Text>
            </View>
            
            <View style={styles.stepIndicatorContainer}>
              <StepIndicator
                steps={steps}
                currentStep={currentStep}
                style={styles.stepIndicator}
              />
            </View>
          </Animated.View>

          {/* Collapsed Header Content */}
          <Animated.View style={[styles.collapsedContent, animatedCollapsedContentStyle]}>
            <View style={styles.collapsedRow}>
              <View style={styles.smallCupContainer}>
                <CoffeeCup3D selection={selection} height={40} width={40} />
              </View>
              <Text style={styles.collapsedTitle}>{stepContent[currentStep].title}</Text>
            </View>
          </Animated.View>

        </Animated.View>

        {/* Main Content Area */}
        <Animated.View style={[styles.content, animatedStepStyle]}>
          {renderCurrentStep()}
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Crafting your perfect coffee experience
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    backgroundColor: 'rgba(44, 24, 16, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 115, 85, 0.3)',
  },
  
  // Expanded Header Styles
  expandedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  cupContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5DEB3',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    width: '100%',
    alignItems: 'center',
  },
  stepIndicator: {
    width: '80%',
  },
  
  // Collapsed Header Styles
  collapsedContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: COLLAPSED_HEADER_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  smallCupContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  collapsedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5DEB3',
    flex: 1,
  },
  
  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Footer Styles
  footer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#8B7355',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default CoffeeSelector; 