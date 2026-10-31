import { CategoryId } from '../types';

export const STOCK_IMAGES = {
  heroWorkspace: '/images/hero-workspace.jpg',
  heroCalculator: '/images/hero-calculator.jpg',
  precisionDesk: '/images/precision-desk.jpg',
  health: '/images/health-fitness.jpg',
  converters: '/images/converters-measure.jpg',
  finance: '/images/finance-charts.jpg',
  creative: '/images/creative-design.jpg',
  datetime: '/images/datetime-clock.jpg',
  textdata: '/images/textdata-code.jpg',
} as const;

export const CATEGORY_IMAGES: Record<CategoryId | 'all', { src: string; alt: string }> = {
  health: {
    src: STOCK_IMAGES.health,
    alt: 'Person training with dumbbells in a fitness studio',
  },
  converters: {
    src: STOCK_IMAGES.converters,
    alt: 'Engineer working with measurement tools and a laptop',
  },
  finance: {
    src: STOCK_IMAGES.finance,
    alt: 'Financial market charts and candlestick graphs on a display',
  },
  creative: {
    src: STOCK_IMAGES.creative,
    alt: 'Designer workspace with color swatches and creative tools',
  },
  datetime: {
    src: STOCK_IMAGES.datetime,
    alt: 'Analog clock face representing time and calendar math',
  },
  textdata: {
    src: STOCK_IMAGES.textdata,
    alt: 'Source code on a computer screen for text and data tools',
  },
  all: {
    src: STOCK_IMAGES.heroCalculator,
    alt: 'Desktop calculator used for professional calculations',
  },
};

export function categoryVisual(id: CategoryId | 'all') {
  return CATEGORY_IMAGES[id] ?? CATEGORY_IMAGES.all;
}
