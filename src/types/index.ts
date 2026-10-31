export type CategoryId = 
  | 'health' 
  | 'converters' 
  | 'finance' 
  | 'creative' 
  | 'datetime' 
  | 'textdata';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  count: number;
  image: string;
  imageAlt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ExampleItem {
  title: string;
  inputs: Record<string, string | number>;
  result: string;
  explanation: string;
}

export interface CalculatorMeta {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: CategoryId;
  description: string;
  iconName: string;
  keywords: string[];
  popular?: boolean;
  featured?: boolean;
  recentlyAdded?: boolean;
  formula?: {
    name: string;
    expression: string;
    explanation: string;
  };
  examples?: ExampleItem[];
  faqs?: FAQItem[];
}

export type ThemeMode = 'light' | 'dark' | 'system';
