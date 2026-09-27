// Used only as an offline fallback catalog when the live api.oluwasetemi.dev
// products endpoint can't be reached. Shaped to match the real Product
// schema so the rest of the app doesn't need to know which source it came
// from.
export const FALLBACK_PRODUCTS = [
  { id: 'local-g1', name: 'Vine Tomatoes', description: '1 kg basket', price: 1200, quantity: 40, category: 'Produce', images: '', featured: true, published: true, isDefault: true },
  { id: 'local-g2', name: 'Basmati Rice', description: '5 kg bag', price: 6500, quantity: 25, category: 'Pantry', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g3', name: 'Free-range Eggs', description: 'crate of 30', price: 3400, quantity: 18, category: 'Dairy & Eggs', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g4', name: 'Green Bell Peppers', description: '1 kg', price: 1450, quantity: 30, category: 'Produce', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g5', name: 'Yam Tubers', description: '2 pieces', price: 2800, quantity: 22, category: 'Produce', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g6', name: 'Palm Oil', description: '1 litre', price: 2100, quantity: 35, category: 'Pantry', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g7', name: 'Sweet Plantains', description: 'bunch of 6', price: 1600, quantity: 28, category: 'Produce', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g8', name: 'Fresh Tilapia', description: '1 kg, cleaned', price: 4200, quantity: 12, category: 'Fish & Meat', images: '', featured: true, published: true, isDefault: true },
  { id: 'local-g9', name: 'Sliced Bread', description: '600 g loaf', price: 950, quantity: 20, category: 'Bakery', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g10', name: 'Whole Chicken', description: '1.5 kg', price: 5200, quantity: 15, category: 'Fish & Meat', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g11', name: 'Fresh Milk', description: '1 litre', price: 1350, quantity: 26, category: 'Dairy & Eggs', images: '', featured: false, published: true, isDefault: true },
  { id: 'local-g12', name: 'Garden Onions', description: '1 kg', price: 1100, quantity: 33, category: 'Produce', images: '', featured: false, published: true, isDefault: true }
];
