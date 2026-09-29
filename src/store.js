import { create } from 'zustand';

// Cosmic products catalog
const initialProducts = [
  { id: 1, name: "Орбитальный Телескоп Джеймса Уэбба (Модель 1:10)", price: 45000, category: "Телескопы", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80", desc: "Детализированная модель телескопа для настоящих ценителей глубокого космоса." },
  { id: 2, name: "Скафандр 'Орлан-МКС' (Функциональный)", price: 2500000, category: "Снаряжение", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80", desc: "Оригинальный скафандр для выхода в открытый космос, сертифицированный для МКС." },
  { id: 3, name: "Марсианский Грунт (Метеорит NWA 7034)", price: 15000, category: "Артефакты", image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80", desc: "Подлинный фрагмент марсианской коры, найденный в Сахаре. Сертификат прилагается." },
  { id: 4, name: "Космическое Питание: Сублимированный Борщ", price: 850, category: "Питание", image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&q=80", desc: "Классический вкус в удобной тубе. Выбор космонавтов с 1970-х годов." },
  { id: 5, name: "Билет на суборбитальный полет (Blue Origin)", price: 45000000, category: "Путешествия", image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80", desc: "Ощутите невесомость и увидьте кривизну Земли своими глазами. Все включено." },
  { id: 6, name: "Умный телескоп Unistellar eVscope 2", price: 499900, category: "Телескопы", image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800&q=80", desc: "Автоматическое наведение и цифровая обработка изображения для наблюдения туманностей." },
  { id: 7, name: "Набор Космического Мороженого", price: 1200, category: "Питание", image: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?w=800&q=80", desc: "Клубничное, ванильное и шоколадное мороженое, которое не тает." },
  { id: 8, name: "Лунный ровер (радиоуправляемый)", price: 35000, category: "Техника", image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80", desc: "Точная копия лунохода с HD камерой и независимой подвеской." },
];

export const useStore = create((set) => ({
  products: JSON.parse(localStorage.getItem('products')) || initialProducts,
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  user: JSON.parse(localStorage.getItem('user')) || null,
  theme: localStorage.getItem('theme') || 'dark',

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
}));
