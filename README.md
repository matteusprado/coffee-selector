# ☕ Coffee Selector - 3D Animated Coffee Experience

A React Native component that enhances the experience of selecting your coffee beverage with beautiful 3D animations and smooth transitions.

## 🎯 Features

- **Interactive 3D Coffee Cup** - Real-time visualization of your coffee selection
- **Smooth Animations** - Powered by react-native-reanimated for buttery smooth transitions
- **Step-by-Step Selection** - Guided coffee customization process
- **Beautiful UI** - Coffee-themed design with warm colors and gradients
- **Multi-step Process**:
  1. **Bean Selection** - Choose from different coffee bean origins
  2. **Grind Level** - Select the perfect grind for your brewing method
  3. **Preparation Method** - Pick your preferred brewing technique
  4. **Toppings** - Customize with milk, sweeteners, and extras
  5. **Review** - Final order summary with pricing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd coffee-selector
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── CoffeeSelector.tsx      # Main component orchestrating the flow
│   ├── 3d/
│   │   └── CoffeeCup3D.tsx     # 3D coffee cup visualization
│   ├── steps/
│   │   ├── BeanSelector.tsx    # Coffee bean selection
│   │   ├── GrindSelector.tsx   # Grind level selection
│   │   ├── PreparationSelector.tsx # Brewing method selection
│   │   ├── ToppingSelector.tsx # Toppings and customization
│   │   └── ReviewScreen.tsx    # Order review and confirmation
│   └── ui/
│       └── StepIndicator.tsx   # Progress indicator
├── constants/
│   └── coffeeData.ts          # Coffee beans, methods, and toppings data
├── types/
│   └── index.ts               # TypeScript type definitions
└── animations/                # Custom animation utilities (future)
```

## 🎨 Design System

### Color Palette
- **Primary**: `#2C1810` (Rich coffee brown)
- **Secondary**: `#D4A574` (Golden coffee)
- **Accent**: `#F5DEB3` (Cream)
- **Text**: `#8B7355` (Muted brown)

### Animation Philosophy
- **Smooth Transitions**: All state changes are animated
- **Staggered Animations**: Elements appear with delightful delays
- **3D Perspective**: Coffee cup rotates and updates in real-time
- **Micro-interactions**: Buttons and selections provide immediate feedback

## 🔧 Technical Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **react-native-reanimated** - High-performance animations
- **react-native-svg** - Vector graphics for the 3D coffee cup
- **expo-linear-gradient** - Beautiful gradient backgrounds
- **TypeScript** - Type safety and better developer experience

## 🎭 Animation Details

### 3D Coffee Cup
- Continuous gentle rotation using `withRepeat`
- Coffee color changes based on selected bean
- Milk layer appears when milk toppings are selected
- Steam particles for hot beverages
- Topping visualization as small colored dots

### Step Transitions
- Fade in/out with vertical translation
- Staggered card animations in lists
- Scale animations for selection feedback
- Progress bar with smooth interpolation

## 🚧 Future Enhancements

### Phase 2 - Advanced 3D
- [ ] react-native-skia integration for true 3D rendering
- [ ] Particle systems for grinding animation
- [ ] Liquid pouring animations
- [ ] Steam simulation with realistic physics

### Phase 3 - Enhanced UX
- [ ] Sound effects for interactions
- [ ] Haptic feedback
- [ ] Save favorite combinations
- [ ] Social sharing of coffee creations
- [ ] AR preview of coffee cup

### Phase 4 - Business Features
- [ ] Integration with coffee shop APIs
- [ ] Real-time pricing
- [ ] Order tracking
- [ ] Loyalty program integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Screenshots

*Coming soon - Add screenshots of each step in the coffee selection process*

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ☕ Acknowledgments

- Coffee data inspired by real coffee varieties and brewing methods
- Design inspired by modern coffee shop experiences
- Animation patterns following Material Design and iOS Human Interface Guidelines 