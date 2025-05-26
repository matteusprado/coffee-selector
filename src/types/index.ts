export interface CoffeeBean {
  id: string;
  name: string;
  origin: string;
  flavor: string;
  strength: number; // 1-5
  color: string;
  image?: string;
}

export interface GrindLevel {
  id: string;
  name: string;
  description: string;
  particleSize: 'extra-coarse' | 'coarse' | 'medium-coarse' | 'medium' | 'medium-fine' | 'fine' | 'extra-fine';
  brewMethods: string[];
}

export interface PreparationMethod {
  id: string;
  name: string;
  description: string;
  brewTime: number; // in seconds
  temperature: number; // in celsius
  icon: string;
  animation: string;
}

export interface Topping {
  id: string;
  name: string;
  category: 'milk' | 'sweetener' | 'flavor' | 'extra';
  price: number;
  color: string;
  icon: string;
}

export interface CoffeeSelection {
  bean: CoffeeBean | null;
  grind: GrindLevel | null;
  preparation: PreparationMethod | null;
  toppings: Topping[];
  size: 'small' | 'medium' | 'large';
  temperature: 'hot' | 'iced';
}

export type SelectionStep = 'bean' | 'grind' | 'preparation' | 'toppings' | 'review';

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
} 