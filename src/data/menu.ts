export type Category = 'Coffee' | 'Cold' | 'Tea' | 'Bakery';
export const CATEGORIES: Category[] = ['Coffee', 'Cold', 'Tea', 'Bakery'];

export type ArtKind = 'cup' | 'iced' | 'frappe' | 'tea' | 'croissant' | 'brownie' | 'cookie';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // base price in PKR (small size, regular milk)
  category: Category;
  rating: number;
  isDrink: boolean;
  kind: ArtKind; // which illustration to draw
  tint: string; // main colour of the illustration (liquid / food)
  tag?: string;
  featured?: boolean;
  prep: string;
};

export type SizeName = 'Small' | 'Medium' | 'Large' | 'Regular';
export type MilkName = 'Regular' | 'Oat' | 'Almond' | 'None';

export const SIZES: { name: SizeName; extra: number }[] = [
  { name: 'Small', extra: 0 },
  { name: 'Medium', extra: 40 },
  { name: 'Large', extra: 80 },
];

export const MILKS: { name: MilkName; extra: number }[] = [
  { name: 'Regular', extra: 0 },
  { name: 'Oat', extra: 50 },
  { name: 'Almond', extra: 50 },
];

export const PRODUCTS: Product[] = [
  { id: 'espresso', name: 'Espresso', description: 'Rich, bold double shot with a golden crema.', price: 250, category: 'Coffee', rating: 4.7, isDrink: true, kind: 'cup', tint: '#3B2314', prep: '3 min' },
  { id: 'americano', name: 'Americano', description: 'Espresso topped with hot water for a smooth, clean cup.', price: 280, category: 'Coffee', rating: 4.5, isDrink: true, kind: 'cup', tint: '#4A2C1A', prep: '4 min' },
  { id: 'cappuccino', name: 'Cappuccino', description: 'Equal parts espresso, steamed milk and velvety foam.', price: 350, category: 'Coffee', rating: 4.8, isDrink: true, kind: 'cup', tint: '#9A6842', tag: 'Bestseller', featured: true, prep: '5 min' },
  { id: 'latte', name: 'Caffè Latte', description: 'Creamy steamed milk over a shot of espresso.', price: 370, category: 'Coffee', rating: 4.7, isDrink: true, kind: 'cup', tint: '#B8885F', prep: '5 min' },
  { id: 'mocha', name: 'Caramel Mocha', description: 'Chocolate, caramel and espresso with whipped cream.', price: 420, category: 'Coffee', rating: 4.9, isDrink: true, kind: 'cup', tint: '#5C3322', tag: 'Popular', featured: true, prep: '6 min' },
  { id: 'iced-latte', name: 'Iced Latte', description: 'Chilled espresso and cold milk over ice.', price: 390, category: 'Cold', rating: 4.6, isDrink: true, kind: 'iced', tint: '#B58A63', prep: '4 min' },
  { id: 'cold-brew', name: 'Cold Brew', description: 'Steeped for 18 hours. Super smooth, low acidity.', price: 400, category: 'Cold', rating: 4.8, isDrink: true, kind: 'iced', tint: '#2B1A10', tag: 'New', featured: true, prep: '3 min' },
  { id: 'frappe', name: 'Coffee Frappé', description: 'Blended iced coffee with a creamy, frosty finish.', price: 450, category: 'Cold', rating: 4.5, isDrink: true, kind: 'frappe', tint: '#C9A27C', prep: '6 min' },
  { id: 'chai', name: 'Doodh Patti Chai', description: 'Classic strong milk tea, brewed the desi way.', price: 180, category: 'Tea', rating: 4.9, isDrink: true, kind: 'tea', tint: '#B9722F', tag: 'Bestseller', featured: true, prep: '5 min' },
  { id: 'kashmiri', name: 'Kashmiri Chai', description: 'Pink tea with crushed pistachios and almonds.', price: 260, category: 'Tea', rating: 4.6, isDrink: true, kind: 'tea', tint: '#E39AA8', prep: '6 min' },
  { id: 'croissant', name: 'Butter Croissant', description: 'Flaky, golden and baked fresh every morning.', price: 290, category: 'Bakery', rating: 4.7, isDrink: false, kind: 'croissant', tint: '#D88F3A', prep: '2 min' },
  { id: 'brownie', name: 'Fudge Brownie', description: 'Dense chocolate brownie with a gooey centre.', price: 320, category: 'Bakery', rating: 4.8, isDrink: false, kind: 'brownie', tint: '#5A3220', prep: '2 min' },
  { id: 'cookie', name: 'Choc-Chip Cookie', description: 'Soft-baked with big chunks of dark chocolate.', price: 200, category: 'Bakery', rating: 4.6, isDrink: false, kind: 'cookie', tint: '#D9A25F', prep: '2 min' },
  { id: 'flat-white', name: 'Flat White', description: 'Velvety micro-foam over a double ristretto shot.', price: 380, category: 'Coffee', rating: 4.7, isDrink: true, kind: 'cup', tint: '#A9784F', prep: '5 min' },
  { id: 'macchiato', name: 'Macchiato', description: 'Bold espresso marked with a dot of silky milk foam.', price: 300, category: 'Coffee', rating: 4.5, isDrink: true, kind: 'cup', tint: '#6B3F26', prep: '4 min' },
  { id: 'iced-americano', name: 'Iced Americano', description: 'Double espresso over ice and cold water. Crisp and refreshing.', price: 340, category: 'Cold', rating: 4.4, isDrink: true, kind: 'iced', tint: '#33200F', prep: '3 min' },
  { id: 'iced-matcha', name: 'Iced Matcha', description: 'Ceremonial matcha shaken with cold milk and ice.', price: 430, category: 'Cold', rating: 4.6, isDrink: true, kind: 'iced', tint: '#8DA75A', tag: 'New', prep: '4 min' },
  { id: 'matcha-latte', name: 'Matcha Latte', description: 'Smooth Japanese green tea whisked with steamed milk.', price: 420, category: 'Tea', rating: 4.6, isDrink: true, kind: 'cup', tint: '#9DB56B', prep: '5 min' },
  { id: 'almond-croissant', name: 'Almond Croissant', description: 'Buttery croissant filled with almond cream and toasted flakes.', price: 340, category: 'Bakery', rating: 4.8, isDrink: false, kind: 'croissant', tint: '#CF8A38', tag: 'New', prep: '2 min' },
  { id: 'blueberry-muffin', name: 'Blueberry Muffin', description: 'Soft, golden muffin bursting with fresh blueberries.', price: 270, category: 'Bakery', rating: 4.5, isDrink: false, kind: 'cookie', tint: '#8F7BB3', prep: '2 min' },
  { id: 'double-choc-cookie', name: 'Double Choc Cookie', description: 'Rich cocoa cookie loaded with dark chocolate chunks.', price: 230, category: 'Bakery', rating: 4.7, isDrink: false, kind: 'cookie', tint: '#6B4630', prep: '2 min' },
];

export function getProduct(id: string | undefined): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function unitPriceFor(product: Product, size: SizeName, milk: MilkName): number {
  if (!product.isDrink) return product.price;
  const s = SIZES.find((x) => x.name === size)?.extra ?? 0;
  const m = MILKS.find((x) => x.name === milk)?.extra ?? 0;
  return product.price + s + m;
}
