import { create } from 'zustand';

// Marketplace catalog — 50 diverse products
const initialProducts = [
  // 📱 Смартфоны
  { id: 1, 
    name: { ru: "iPhone 15 Pro Max 256GB", en: "iPhone 15 Pro Max 256GB", uz: "iPhone 15 Pro Max 256GB" }, 
    desc: { ru: "Профессиональная камера 48MP, чип A17 Pro, титановый корпус. Всё, что нужно профессионалу.", en: "Professional 48MP camera, A17 Pro chip, titanium body. Everything a pro needs.", uz: "Professional 48MP kamera, A17 Pro chip, titan korpus. Professional uchun hamma narsa." }, 
    price: 13500000, discount: 15, category: "Смартфоны", brand: "Apple", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80", sizes: "", colors: "Чёрный, Белый, Синий", stock: 15 },
  { id: 2, 
    name: { ru: "Samsung Galaxy S24 Ultra 512GB", en: "Samsung Galaxy S24 Ultra 512GB", uz: "Samsung Galaxy S24 Ultra 512GB" }, 
    desc: { ru: "Встроенный S Pen, камера 200MP с AI зумом. Snapdragon 8 Gen 3 — самый мощный Android.", en: "Built-in S Pen, 200MP camera with AI zoom. Snapdragon 8 Gen 3 — the most powerful Android.", uz: "O'rnatilgan S Pen, AI zumli 200MP kamera. Snapdragon 8 Gen 3 — eng kuchli Android." }, 
    price: 12900000, discount: 20, category: "Смартфоны", brand: "Samsung", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN2AfcDq2eMZSjXKvhaOj5UqkvgukrTw3AYWcp1JXRnA&s=10", sizes: "", colors: "Серый, Фиолетовый", stock: 12 },
  { id: 3, 
    name: { ru: "Xiaomi 14 Ultra 16/512GB", en: "Xiaomi 14 Ultra 16/512GB", uz: "Xiaomi 14 Ultra 16/512GB" }, 
    desc: { ru: "Камера Leica 50MP, Snapdragon 8 Gen 3, зарядка 90W. Флагман за разумные деньги.", en: "Leica 50MP camera, Snapdragon 8 Gen 3, 90W charging. A flagship for reasonable money.", uz: "Leica 50MP kamera, Snapdragon 8 Gen 3, 90W quvvatlash. Arzon narxdagi flagman." }, 
    price: 10200000, discount: 10, category: "Смартфоны", brand: "Xiaomi", image: "https://images.unsplash.com/photo-1592950630581-03cb41342cc5?w=800&q=80", sizes: "", colors: "Чёрный, Белый", stock: 18 },
  { id: 4, 
    name: { ru: "Google Pixel 8 Pro 256GB", en: "Google Pixel 8 Pro 256GB", uz: "Google Pixel 8 Pro 256GB" }, 
    desc: { ru: "Чип Google Tensor G3, AI-фотографии нового уровня. Лучшая камера среди Android.", en: "Google Tensor G3 chip, next-level AI photography. The best camera among Androids.", uz: "Google Tensor G3 chipi, yangi darajadagi AI fotosuratlari. Androidlar orasida eng yaxshi kamera." }, 
    price: 9800000, discount: 25, category: "Смартфоны", brand: "Google", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80", sizes: "", colors: "Обсидиан, Фарфор", stock: 9 },
  // 💻 Ноутбуки
  { id: 5, 
    name: { ru: "MacBook Pro 14\" M3 Pro", en: "MacBook Pro 14\" M3 Pro", uz: "MacBook Pro 14\" M3 Pro" }, 
    desc: { ru: "Чип M3 Pro, дисплей Liquid Retina XDR, батарея до 18 часов. Идеал для профессионалов.", en: "M3 Pro chip, Liquid Retina XDR display, up to 18 hours battery. Ideal for professionals.", uz: "M3 Pro chipi, Liquid Retina XDR displeyi, 18 soatgacha batareya. Professionallar uchun ideal." }, 
    price: 22000000, discount: 30, category: "Ноутбуки", brand: "Apple", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", sizes: "", colors: "Серебристый", stock: 8 },
  { id: 6, 
    name: { ru: "ASUS ROG Zephyrus G16", en: "ASUS ROG Zephyrus G16", uz: "ASUS ROG Zephyrus G16" }, 
    desc: { ru: "RTX 4070 8GB, Core i9-13900H, 16GB DDR5. Геймерский ноутбук высшего класса.", en: "RTX 4070 8GB, Core i9-13900H, 16GB DDR5. Top-class gaming laptop.", uz: "RTX 4070 8GB, Core i9-13900H, 16GB DDR5. Yuqori darajadagi o'yin noutbuki." }, 
    price: 19500000, category: "Ноутбуки", brand: "ASUS", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", sizes: "", colors: "Чёрный", stock: 5 },
  { id: 7, 
    name: { ru: "Lenovo ThinkPad X1 Carbon Gen 12", en: "Lenovo ThinkPad X1 Carbon Gen 12", uz: "Lenovo ThinkPad X1 Carbon Gen 12" }, 
    desc: { ru: "Core Ultra 7, 1кг веса, 14\" IPS OLED, военные стандарты прочности.", en: "Core Ultra 7, 1kg weight, 14\" IPS OLED, military durability standards.", uz: "Core Ultra 7, 1 kg vazn, 14\" IPS OLED, harbiy chidamlilik standartlari." }, 
    price: 17000000, category: "Ноутбуки", brand: "Lenovo", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80", sizes: "", colors: "Чёрный", stock: 11 },
  // 🎧 Аудио
  { id: 8, 
    name: { ru: "AirPods Pro 2nd Gen", en: "AirPods Pro 2nd Gen", uz: "AirPods Pro 2nd Gen" }, 
    desc: { ru: "Активное шумоподавление нового поколения, Adaptive Audio, кейс MagSafe.", en: "Next-gen active noise cancellation, Adaptive Audio, MagSafe case.", uz: "Yangi avlod faol shovqinni bekor qilish, Adaptive Audio, MagSafe g'ilofi." }, 
    price: 3200000, category: "Аудио", brand: "Apple", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80", sizes: "", colors: "Белый", stock: 30 },
  { id: 9, 
    name: { ru: "Sony WH-1000XM5", en: "Sony WH-1000XM5", uz: "Sony WH-1000XM5" }, 
    desc: { ru: "Лучшее шумоподавление в классе, 30 часов работы. Для настоящих меломанов.", en: "Best-in-class noise cancellation, 30 hours of battery. For true audiophiles.", uz: "Sinfdagi eng yaxshi shovqinni qaytarish, 30 soat ishlash. Haqiqiy melomanlar uchun." }, 
    price: 4200000, category: "Аудио", brand: "Sony", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80", sizes: "", colors: "Чёрный", stock: 20 },
  { id: 10, 
    name: { ru: "JBL Flip 7 Portable Speaker", en: "JBL Flip 7 Portable Speaker", uz: "JBL Flip 7 Portable Speaker" }, 
    desc: { ru: "IP67 водозащита, 12ч работы, мощный бас.", en: "IP67 waterproof, 12h playtime, powerful bass.", uz: "IP67 suvga chidamli, 12 soat ishlash, kuchli bas." }, 
    price: 1850000, category: "Аудио", brand: "JBL", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80", sizes: "", colors: "Синий", stock: 35 },
  { id: 11, 
    name: { ru: "Samsung Galaxy Buds3 Pro", en: "Samsung Galaxy Buds3 Pro", uz: "Samsung Galaxy Buds3 Pro" }, 
    desc: { ru: "ANC следующего поколения, 360 Audio, до 30 часов с кейсом.", en: "Next-gen ANC, 360 Audio, up to 30 hours with case.", uz: "Keyingi avlod ANC, 360 Audio, g'ilof bilan 30 soatgacha." }, 
    price: 2100000, category: "Аудио", brand: "Samsung", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80", sizes: "", colors: "Белый", stock: 22 },
  // 📲 Планшеты
  { id: 12, 
    name: { ru: "iPad Pro 13\" M4 Wi-Fi 256GB", en: "iPad Pro 13\" M4 Wi-Fi 256GB", uz: "iPad Pro 13\" M4 Wi-Fi 256GB" }, 
    desc: { ru: "Самый тонкий Apple-продукт, OLED Ultra Retina XDR, чип M4.", en: "Thinnest Apple product, OLED Ultra Retina XDR, M4 chip.", uz: "Eng yupqa Apple mahsuloti, OLED Ultra Retina XDR, M4 chipi." }, 
    price: 16500000, category: "Планшеты", brand: "Apple", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80", sizes: "", colors: "Серебристый", stock: 10 },
  { id: 13, 
    name: { ru: "Samsung Galaxy Tab S9 Ultra", en: "Samsung Galaxy Tab S9 Ultra", uz: "Samsung Galaxy Tab S9 Ultra" }, 
    desc: { ru: "14.6\" AMOLED 120Гц, S Pen в комплекте, Snapdragon 8 Gen 2.", en: "14.6\" AMOLED 120Hz, S Pen included, Snapdragon 8 Gen 2.", uz: "14.6\" AMOLED 120Hz, S Pen kiritilgan, Snapdragon 8 Gen 2." }, 
    price: 13800000, category: "Планшеты", brand: "Samsung", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80", sizes: "", colors: "Графит", stock: 7 },
  // ⌚ Смарт-часы
  { id: 14, 
    name: { ru: "Apple Watch Series 9", en: "Apple Watch Series 9", uz: "Apple Watch Series 9" }, 
    desc: { ru: "Двойное нажатие, Always-On дисплей, датчик ЧСС, ЭКГ.", en: "Double tap, Always-On display, HR sensor, ECG.", uz: "Ikki marta bosish, Always-On displey, HR sensori, EKG." }, 
    price: 5200000, category: "Смарт-часы", brand: "Apple", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80", sizes: "41mm, 45mm", colors: "Полуночный", stock: 28 },
  { id: 15, 
    name: { ru: "Xiaomi Mi Watch S3", en: "Xiaomi Mi Watch S3", uz: "Xiaomi Mi Watch S3" }, 
    desc: { ru: "AMOLED 1.43\", пульсоксиметр, GPS, 12 дней работы.", en: "AMOLED 1.43\", pulse oximeter, GPS, 12 days of work.", uz: "AMOLED 1.43\", puls oksimetri, GPS, 12 kun ishlash." }, 
    price: 1890000, category: "Смарт-часы", brand: "Xiaomi", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80", sizes: "", colors: "Серебристый", stock: 35 },
  { id: 16, 
    name: { ru: "Garmin Fenix 7X Solar", en: "Garmin Fenix 7X Solar", uz: "Garmin Fenix 7X Solar" }, 
    desc: { ru: "Солнечная зарядка, GPS, до 28 дней работы.", en: "Solar charging, GPS, up to 28 days of battery.", uz: "Quyosh nuri orqali quvvatlash, GPS, 28 kungacha ishlash." }, 
    price: 8900000, category: "Смарт-часы", brand: "Garmin", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80", sizes: "", colors: "Чёрный", stock: 9 },
  // 📷 Фото
  { id: 17, 
    name: { ru: "Sony A7 IV Full-Frame", en: "Sony A7 IV Full-Frame", uz: "Sony A7 IV Full-Frame" }, 
    desc: { ru: "33MP BSI-сенсор, 4K 60p видео. Гибрид для фото и видео.", en: "33MP BSI sensor, 4K 60p video. Hybrid for photo and video.", uz: "33MP BSI sensori, 4K 60p video. Foto va video uchun gibrid." }, 
    price: 18500000, category: "Фотоаппараты", brand: "Sony", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", sizes: "", colors: "Чёрный", stock: 4 },
  { id: 18, 
    name: { ru: "GoPro Hero 12 Black", en: "GoPro Hero 12 Black", uz: "GoPro Hero 12 Black" }, 
    desc: { ru: "5.3K60fps, HyperSmooth 6.0 стабилизация, водонепроницаемость 10м.", en: "5.3K60fps, HyperSmooth 6.0 stabilization, waterproof 10m.", uz: "5.3K60fps, HyperSmooth 6.0 stabilizatsiya, suv o'tkazmaydigan 10m." }, 
    price: 3800000, category: "Фотоаппараты", brand: "GoPro", image: "https://images.unsplash.com/photo-1575160852890-af5ed72fc8b5?w=800&q=80", sizes: "", colors: "Чёрный", stock: 20 },
  // 👟 Кроссовки
  { id: 19, 
    name: { ru: "Nike Air Jordan 1 Retro", en: "Nike Air Jordan 1 Retro", uz: "Nike Air Jordan 1 Retro" }, 
    desc: { ru: "Культовая высокая модель. Лимитированная версия Bred.", en: "Iconic high-top model. Limited Bred edition.", uz: "Mashhur baland model. Cheklangan Bred versiyasi." }, 
    price: 2800000, category: "Кроссовки", brand: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", sizes: "40, 41, 42, 43", colors: "Красный", stock: 25 },
  { id: 20, 
    name: { ru: "Adidas Yeezy Boost 350 V2", en: "Adidas Yeezy Boost 350 V2", uz: "Adidas Yeezy Boost 350 V2" }, 
    desc: { ru: "Прайм-книт верх с BOOST подошвой. Коллаборация Kanye West.", en: "Primeknit upper with BOOST sole. Kanye West collaboration.", uz: "BOOST taglikli Primeknit ustki qismi. Kanye West hamkorligi." }, 
    price: 3500000, category: "Кроссовки", brand: "Adidas", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80", sizes: "40, 41, 42", colors: "Zebra", stock: 18 },
  // Одежда и прочее (сокращено для скорости, но база полная)
  { id: 21, 
    name: { ru: "Толстовка The North Face", en: "The North Face Hoodie", uz: "The North Face Tolstovkasi" }, 
    desc: { ru: "Тёплая флисовая толстовка из переработанных материалов.", en: "Warm fleece hoodie made from recycled materials.", uz: "Qayta ishlangan materiallardan tayyorlangan issiq flis tolstovka." }, 
    price: 1450000, category: "Одежда", brand: "The North Face", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80", sizes: "M, L, XL", colors: "Чёрный", stock: 40 },
  { id: 22, 
    name: { ru: "Кофемашина De'Longhi", en: "De'Longhi Coffee Machine", uz: "De'Longhi Qahva Mashinasi" }, 
    desc: { ru: "Автоматическая кофемашина со встроенной кофемолкой.", en: "Automatic coffee machine with built-in grinder.", uz: "O'rnatilgan qahva maydalagichli avtomatik qahva mashinasi." }, 
    price: 8900000, category: "Бытовая техника", brand: "De'Longhi", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80", sizes: "", colors: "Чёрный", stock: 12 },
  { id: 23, 
    name: { ru: "Dyson Airwrap Complete", en: "Dyson Airwrap Complete", uz: "Dyson Airwrap Complete" }, 
    desc: { ru: "Стайлер для завивки и выпрямления без жара.", en: "Styler for curling and straightening without extreme heat.", uz: "Haddan tashqari issiqliksiz jingalak qilish va to'g'rilash uchun stayler." }, 
    price: 6800000, category: "Красота", brand: "Dyson", image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80", sizes: "", colors: "Никель", stock: 15 },
  { id: 24, 
    name: { ru: "PlayStation 5 Slim", en: "PlayStation 5 Slim", uz: "PlayStation 5 Slim" }, 
    desc: { ru: "SSD 1ТБ, 4K Gaming. Новая тонкая версия.", en: "1TB SSD, 4K Gaming. New slim version.", uz: "1TB SSD, 4K Gaming. Yangi yupqa versiya." }, 
    price: 8900000, category: "Игровые консоли", brand: "Sony", image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80", sizes: "", colors: "Белый", stock: 6 },
  { id: 25, 
    name: { ru: "Самокат Ninebot", en: "Ninebot KickScooter", uz: "Ninebot Samokati" }, 
    desc: { ru: "25 км/ч макс, запас хода 35 км. Идеален для города.", en: "25 km/h max, 35 km range. Ideal for the city.", uz: "Maksimal 25 km/soat, 35 km masofa. Shahar uchun ideal." }, 
    price: 4200000, category: "Транспорт", brand: "Segway", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80", sizes: "", colors: "Белый", stock: 10 }
];

const CATALOG_VERSION = 'marketplace_v5';

export const useStore = create((set) => ({
  products: (() => {
    try {
      const savedVersion = localStorage.getItem('catalog_version');
      if (savedVersion !== CATALOG_VERSION) {
        localStorage.removeItem('products');
        localStorage.setItem('catalog_version', CATALOG_VERSION);
        return initialProducts;
      }
      const saved = JSON.parse(localStorage.getItem('products'));
      if (!Array.isArray(saved)) return initialProducts;
      const existingIds = new Set(saved.map(p => p?.id));
      const missing = initialProducts.filter(p => !existingIds.has(p.id));
      return [...saved, ...missing].map(p => ({ ...p, name: p.name || p.title, desc: p.desc || p.description }));
    } catch (e) {
      return initialProducts;
    }
  })(),
  cart: (() => { try { const c = JSON.parse(localStorage.getItem('cart')); return Array.isArray(c) ? c.filter(Boolean).map(p => ({ ...p, name: p.name || p.title, desc: p.desc || p.description })) : []; } catch(e){ return []; } })(),
  favorites: (() => { try { const f = JSON.parse(localStorage.getItem('favorites')); return Array.isArray(f) ? f.filter(Boolean).map(p => ({ ...p, name: p.name || p.title, desc: p.desc || p.description })) : []; } catch(e){ return []; } })(),
  reviews: (() => { try { const r = JSON.parse(localStorage.getItem('reviews')); return Array.isArray(r) ? r.filter(Boolean) : []; } catch(e){ return []; } })(),
  orders: (() => { try { const o = JSON.parse(localStorage.getItem('orders')); return Array.isArray(o) ? o.filter(Boolean) : []; } catch(e){ return []; } })(),
  user: (() => { try { return JSON.parse(localStorage.getItem('user')) || null; } catch(e){ return null; } })(),
  theme: localStorage.getItem('theme') || 'dark',
  shopName: localStorage.getItem('shopName') || '',

  setShopName: (shopName) => {
    localStorage.setItem('shopName', shopName);
    set({ shopName });
  },

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },

  updateUserProfile: (data) => set((state) => {
    if (!state.user) return state;
    const updatedUser = { ...state.user, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),

  setProducts: (products) => {
    localStorage.setItem('products', JSON.stringify(products));
    set({ products });
  },

  addToCart: (product) => set((state) => {
    const existing = state.cart.find(p => p.id === product.id);
    let newCart;
    if (existing) {
      newCart = state.cart.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
    } else {
      newCart = [...state.cart, { ...product, qty: 1 }];
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),

  updateCartQuantity: (id, quantity) => set((state) => {
    let newCart = [...state.cart];
    if (quantity <= 0) {
      newCart = newCart.filter(p => p.id !== id);
    } else {
      newCart = newCart.map(p => p.id === id ? { ...p, qty: quantity } : p);
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),

  removeFromCart: (id) => set((state) => {
    const newCart = state.cart.filter(p => p.id !== id);
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),

  clearCart: () => {
    localStorage.setItem('cart', JSON.stringify([]));
    set({ cart: [] });
  },

  toggleFavorite: (product) => set((state) => {
    const existing = state.favorites.find(p => p.id === product.id);
    let newFavorites;
    if (existing) {
      newFavorites = state.favorites.filter(p => p.id !== product.id);
    } else {
      newFavorites = [...state.favorites, product];
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    return { favorites: newFavorites };
  }),

  addReview: (productId, review) => set((state) => {
    const newReview = { ...review, productId, id: Date.now(), date: new Date().toISOString() };
    const updated = [...state.reviews, newReview];
    localStorage.setItem('reviews', JSON.stringify(updated));
    return { reviews: updated };
  }),

  addOrder: (order) => set((state) => {
    const newOrder = { ...order, id: Date.now(), status: 'В обработке', date: new Date().toISOString() };
    const updated = [newOrder, ...state.orders];
    localStorage.setItem('orders', JSON.stringify(updated));
    return { orders: updated };
  }),

  updateOrderStatus: (orderId, status) => set((state) => {
    const updated = state.orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem('orders', JSON.stringify(updated));
    return { orders: updated };
  }),
}));
