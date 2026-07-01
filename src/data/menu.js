export const CATEGORIES = [
  'Appetizers', 'Main Course', 'Rice Meals', 'Pasta', 'Soup', 'Desserts',
  'Drinks', 'Coffee', 'Milk Tea', 'Smoothies', 'Breakfast', 'Sides', 'Specials',
];

// price in PHP. preparation_time in minutes. is_available/is_active mirror
// the real schema's two independent flags (temporarily 86'd vs archived).
export const MOCK_MENU_ITEMS = [
  { id: 1,  name: 'Crispy Calamares',      category: 'Appetizers', price: 220, prep_time: 12, is_available: true,  is_active: true,  is_featured: true,  image: '🦑' },
  { id: 2,  name: 'Spring Rolls',          category: 'Appetizers', price: 180, prep_time: 10, is_available: true,  is_active: true,  is_featured: false, image: '🥢' },
  { id: 3,  name: 'Crispy Pata',           category: 'Main Course', price: 480, prep_time: 25, is_available: true,  is_active: true,  is_featured: true,  image: '🍖' },
  { id: 4,  name: 'Grilled Salmon',        category: 'Main Course', price: 330, prep_time: 18, is_available: true,  is_active: true,  is_featured: true,  image: '🐟' },
  { id: 5,  name: 'Beef Burger',           category: 'Main Course', price: 250, prep_time: 15, is_available: true,  is_active: true,  is_featured: false, image: '🍔' },
  { id: 6,  name: 'Sizzling Sisig',        category: 'Main Course', price: 260, prep_time: 15, is_available: false, is_active: true,  is_featured: false, image: '🍳' },
  { id: 7,  name: 'Adobo Rice Bowl',       category: 'Rice Meals', price: 195, prep_time: 12, is_available: true,  is_active: true,  is_featured: false, image: '🍚' },
  { id: 8,  name: 'Bangsilog',             category: 'Rice Meals', price: 175, prep_time: 10, is_available: true,  is_active: true,  is_featured: false, image: '🍚' },
  { id: 9,  name: 'Truffle Pasta',         category: 'Pasta', price: 220, prep_time: 14, is_available: true,  is_active: true,  is_featured: true,  image: '🍝' },
  { id: 10, name: 'Carbonara',             category: 'Pasta', price: 210, prep_time: 14, is_available: true,  is_active: true,  is_featured: false, image: '🍝' },
  { id: 11, name: 'Pesto Aglio Olio',      category: 'Pasta', price: 195, prep_time: 12, is_available: true,  is_active: true,  is_featured: false, image: '🍝' },
  { id: 12, name: 'Sinigang na Baboy',     category: 'Soup', price: 240, prep_time: 20, is_available: true,  is_active: true,  is_featured: false, image: '🍲' },
  { id: 13, name: 'Tinolang Manok',        category: 'Soup', price: 220, prep_time: 20, is_available: true,  is_active: true,  is_featured: false, image: '🍲' },
  { id: 14, name: 'Chocolate Cake',        category: 'Desserts', price: 150, prep_time: 5,  is_available: true,  is_active: true,  is_featured: false, image: '🍰' },
  { id: 15, name: 'Leche Flan',            category: 'Desserts', price: 120, prep_time: 5,  is_available: true,  is_active: true,  is_featured: false, image: '🍮' },
  { id: 16, name: 'Halo-Halo',             category: 'Desserts', price: 165, prep_time: 8,  is_available: true,  is_active: true,  is_featured: true,  image: '🍧' },
  { id: 17, name: 'Iced Tea',              category: 'Drinks', price: 90,  prep_time: 3,  is_available: true,  is_active: true,  is_featured: false, image: '🧊' },
  { id: 18, name: 'Calamansi Juice',       category: 'Drinks', price: 90,  prep_time: 3,  is_available: true,  is_active: true,  is_featured: false, image: '🍋' },
  { id: 19, name: 'Bottled Water',         category: 'Drinks', price: 50,  prep_time: 1,  is_available: true,  is_active: true,  is_featured: false, image: '💧' },
  { id: 20, name: 'Iced Caramel Latte',    category: 'Coffee', price: 140, prep_time: 6,  is_available: true,  is_active: true,  is_featured: true,  image: '☕' },
  { id: 21, name: 'Cappuccino',            category: 'Coffee', price: 130, prep_time: 6,  is_available: true,  is_active: true,  is_featured: false, image: '☕' },
  { id: 22, name: 'Classic Milk Tea',      category: 'Milk Tea', price: 120, prep_time: 5,  is_available: true,  is_active: true,  is_featured: false, image: '🧋' },
  { id: 23, name: 'Taro Milk Tea',         category: 'Milk Tea', price: 130, prep_time: 5,  is_available: true,  is_active: true,  is_featured: false, image: '🧋' },
  { id: 24, name: 'Mango Smoothie',        category: 'Smoothies', price: 145, prep_time: 6,  is_available: true,  is_active: true,  is_featured: false, image: '🥭' },
  { id: 25, name: 'Tapsilog',              category: 'Breakfast', price: 185, prep_time: 12, is_available: true,  is_active: true,  is_featured: false, image: '🍳' },
  { id: 26, name: 'Garlic Bread',          category: 'Sides', price: 80,  prep_time: 6,  is_available: true,  is_active: true,  is_featured: false, image: '🍞' },
  { id: 27, name: 'French Fries',          category: 'Sides', price: 90,  prep_time: 8,  is_available: true,  is_active: true,  is_featured: false, image: '🍟' },
  { id: 28, name: "Chef's Seafood Platter",category: 'Specials', price: 650, prep_time: 30, is_available: true,  is_active: true,  is_featured: true,  image: '🦐' },
  { id: 29, name: 'Fish & Chips',          category: 'Main Course', price: 240, prep_time: 16, is_available: true,  is_active: true,  is_featured: false, image: '🐠' },
  { id: 30, name: 'Old Recipe (retired)',  category: 'Specials', price: 300, prep_time: 20, is_available: false, is_active: false, is_featured: false, image: '📦' },
];
