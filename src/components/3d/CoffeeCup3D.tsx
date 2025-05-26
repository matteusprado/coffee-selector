import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Ellipse,
  Path,
  Circle,
} from 'react-native-svg';
import { CoffeeSelection } from '../../types';

interface CoffeeCup3DProps {
  selection: CoffeeSelection;
  height: number;
  width: number;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const CoffeeCup3D: React.FC<CoffeeCup3DProps> = ({ selection, height, width }) => {
  const rotateY = useSharedValue(0);
  const coffeeLevel = useSharedValue(0);
  const steamOpacity = useSharedValue(0);

  React.useEffect(() => {
    // Continuous gentle rotation
    rotateY.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false
    );

    // Coffee level animation when selection changes
    if (selection.bean || selection.preparation) {
      coffeeLevel.value = withSpring(0.7);
      steamOpacity.value = withSpring(1);
    }
  }, [selection]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotateYValue = interpolate(rotateY.value, [0, 360], [0, 20]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateYValue}deg` },
      ],
    };
  });

  const getCoffeeColor = () => {
    if (selection.bean) {
      return selection.bean.color;
    }
    return '#6B4423';
  };

  const getCreamColor = () => {
    const milkTopping = selection.toppings.find(t => t.category === 'milk');
    return milkTopping?.color || '#FFFEF7';
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <AnimatedSvg width={width} height={height} viewBox={`0 0 ${200} ${200}`}>
        <Defs>
          {/* Coffee gradient */}
          <LinearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={getCoffeeColor()} stopOpacity="1" />
            <Stop offset="100%" stopColor="#3C2415" stopOpacity="1" />
          </LinearGradient>
          
          {/* Cup gradient */}
          <LinearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F5F5F5" stopOpacity="1" />
            <Stop offset="50%" stopColor="#E0E0E0" stopOpacity="1" />
            <Stop offset="100%" stopColor="#CCCCCC" stopOpacity="1" />
          </LinearGradient>

          {/* Cream gradient */}
          <LinearGradient id="creamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={getCreamColor()} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={getCreamColor()} stopOpacity="0.7" />
          </LinearGradient>
        </Defs>

        {/* Cup body */}
        <Path
          d="M30 80 L30 160 Q30 180 50 180 L130 180 Q150 180 150 160 L150 80 Z"
          fill="url(#cupGradient)"
          stroke="#CCCCCC"
          strokeWidth="2"
        />
        
        {/* Cup handle */}
        <Path
          d="M150 100 Q170 100 170 120 Q170 140 150 140"
          fill="none"
          stroke="#CCCCCC"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Coffee surface */}
        <Ellipse
          cx="90"
          cy="85"
          rx="58"
          ry="8"
          fill="url(#coffeeGradient)"
        />

        {/* Cream/milk layer */}
        {selection.toppings.some(t => t.category === 'milk') && (
          <Ellipse
            cx="90"
            cy="82"
            rx="55"
            ry="6"
            fill="url(#creamGradient)"
          />
        )}

        {/* Steam particles */}
        {Array.from({ length: 5 }, (_, i) => (
          <Circle
            key={i}
            cx={75 + i * 8}
            cy={60 - i * 3}
            r={1.5 - i * 0.2}
            fill="#E0E0E0"
            opacity={0.6}
          />
        ))}

        {/* Toppings visualization */}
        {selection.toppings.filter(t => t.category === 'extra').map((topping, index) => (
          <Circle
            key={topping.id}
            cx={80 + (index % 3) * 8}
            cy={78 + Math.floor(index / 3) * 4}
            r="2"
            fill={topping.color}
            opacity="0.8"
          />
        ))}
      </AnimatedSvg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CoffeeCup3D; 