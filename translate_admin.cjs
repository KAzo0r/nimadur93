const fs = require('fs');

const enAdmin = {
  admin_analytics: '📊 Analytics',
  admin_products: '👟 Products',
  admin_orders: '🛍️ Orders',
  admin_customers: '👥 Customers',
  admin_inventory: '📦 Inventory',
  admin_categories: '🏷️ Categories',
  admin_payments: '💳 Payments',
  admin_promocodes: '🎟️ Promo Codes',
  admin_reviews: '⭐ Reviews',
  admin_delivery: '🚚 Delivery',
  admin_favorites: '❤️ Favorites',
  admin_notifications: '🔔 Notifications',
  admin_admins: '👤 Admins',
  admin_settings: '⚙️ Settings'
};

const ruAdmin = {
  admin_analytics: '📊 Аналитика',
  admin_products: '👟 Товары',
  admin_orders: '🛍️ Заказы',
  admin_customers: '👥 Клиенты',
  admin_inventory: '📦 Склад',
  admin_categories: '🏷️ Категории',
  admin_payments: '💳 Платежи',
  admin_promocodes: '🎟️ Промокоды',
  admin_reviews: '⭐ Отзывы',
  admin_delivery: '🚚 Доставка',
  admin_favorites: '❤️ Избранное',
  admin_notifications: '🔔 Уведомления',
  admin_admins: '👤 Администраторы',
  admin_settings: '⚙️ Настройки'
};

const uzAdmin = {
  admin_analytics: '📊 Analitika',
  admin_products: '👟 Tovarlar',
  admin_orders: '🛍️ Buyurtmalar',
  admin_customers: '👥 Mijozlar',
  admin_inventory: '📦 Ombor',
  admin_categories: '🏷️ Toifalar',
  admin_payments: '💳 To\'lovlar',
  admin_promocodes: '🎟️ Promokodlar',
  admin_reviews: '⭐ Sharhlar',
  admin_delivery: '🚚 Yetkazib berish',
  admin_favorites: '❤️ Sevimlilar',
  admin_notifications: '🔔 Xabarnomalar',
  admin_admins: '👤 Administratorlar',
  admin_settings: '⚙️ Sozlamalar'
};

let code = fs.readFileSync('src/i18n.js', 'utf8');
function insertIntoTranslation(code, lang, newDict) {
  const strDict = Object.entries(newDict).map(x => `"${x[0]}": "${x[1]}",`).join('\n      ');
  return code.replace(lang + ': {\n    translation: {', lang + ': {\n    translation: {\n      ' + strDict);
}
code = insertIntoTranslation(code, 'en', enAdmin);
code = insertIntoTranslation(code, 'ru', ruAdmin);
code = insertIntoTranslation(code, 'uz', uzAdmin);
fs.writeFileSync('src/i18n.js', code);

// Now update Admin.jsx menuItems
let adminCode = fs.readFileSync('src/pages/Admin.jsx', 'utf8');
adminCode = adminCode.replace(/\{ id: 'analytics', label: '📊 Аналитика', icon: BarChart2 \},/, "{ id: 'analytics', label: 'admin_analytics', icon: BarChart2 },");
adminCode = adminCode.replace(/\{ id: 'products', label: '👟 Товары', icon: Package \},/, "{ id: 'products', label: 'admin_products', icon: Package },");
adminCode = adminCode.replace(/\{ id: 'orders', label: '🛍️ Заказы', icon: ShoppingCart \},/, "{ id: 'orders', label: 'admin_orders', icon: ShoppingCart },");
adminCode = adminCode.replace(/\{ id: 'customers', label: '👥 Клиенты', icon: Users \},/, "{ id: 'customers', label: 'admin_customers', icon: Users },");
adminCode = adminCode.replace(/\{ id: 'inventory', label: '📦 Склад', icon: Archive \},/, "{ id: 'inventory', label: 'admin_inventory', icon: Archive },");
adminCode = adminCode.replace(/\{ id: 'categories', label: '🏷️ Категории', icon: Tags \},/, "{ id: 'categories', label: 'admin_categories', icon: Tags },");
adminCode = adminCode.replace(/\{ id: 'payments', label: '💳 Платежи', icon: CreditCard \},/, "{ id: 'payments', label: 'admin_payments', icon: CreditCard },");
adminCode = adminCode.replace(/\{ id: 'promocodes', label: '🎟️ Промокоды', icon: Ticket \},/, "{ id: 'promocodes', label: 'admin_promocodes', icon: Ticket },");
adminCode = adminCode.replace(/\{ id: 'reviews', label: '⭐ Отзывы', icon: Star \},/, "{ id: 'reviews', label: 'admin_reviews', icon: Star },");
adminCode = adminCode.replace(/\{ id: 'delivery', label: '🚚 Доставка', icon: Truck \},/, "{ id: 'delivery', label: 'admin_delivery', icon: Truck },");
adminCode = adminCode.replace(/\{ id: 'favorites', label: '❤️ Избранное', icon: Heart \},/, "{ id: 'favorites', label: 'admin_favorites', icon: Heart },");
adminCode = adminCode.replace(/\{ id: 'notifications', label: '🔔 Уведомления', icon: Bell \},/, "{ id: 'notifications', label: 'admin_notifications', icon: Bell },");
adminCode = adminCode.replace(/\{ id: 'admins', label: '👤 Администраторы', icon: Shield \},/, "{ id: 'admins', label: 'admin_admins', icon: Shield },");
adminCode = adminCode.replace(/\{ id: 'settings', label: '⚙️ Настройки', icon: Settings \},/, "{ id: 'settings', label: 'admin_settings', icon: Settings },");

// Fix render
adminCode = adminCode.replace(/\{item\.label\}/g, "{t(item.label)}");

fs.writeFileSync('src/pages/Admin.jsx', adminCode);
console.log('Admin translated');
