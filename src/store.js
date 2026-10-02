import { create } from 'zustand';

// Marketplace catalog — 50 diverse products
const initialProducts = [
  // 📱 Смартфоны
  { id: 1, name: "iPhone 15 Pro Max 256GB", price: 13500000, discount: 15, category: "Смартфоны", brand: "Apple", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80", desc: "Профессиональная камера 48MP, чип A17 Pro, титановый корпус, Dynamic Island. Всё, что нужно профессионалу.", sizes: "", colors: "Чёрный, Белый, Синий, Натуральный", stock: 15 },
  { id: 2, name: "Samsung Galaxy S24 Ultra 512GB", price: 12900000, discount: 20, category: "Смартфоны", brand: "Samsung", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN2AfcDq2eMZSjXKvhaOj5UqkvgukrTw3AYWcp1JXRnA&s=10", desc: "Встроенный S Pen, камера 200MP с AI зумом, 12ГБ RAM. Snapdragon 8 Gen 3 — самый мощный Android.", sizes: "", colors: "Серый, Фиолетовый, Оранжевый", stock: 12 },
  { id: 3, name: "Xiaomi 14 Ultra 16/512GB", price: 10200000, discount: 10, category: "Смартфоны", brand: "Xiaomi", image: "https://images.unsplash.com/photo-1592950630581-03cb41342cc5?w=800&q=80", desc: "Камера Leica 50MP, Snapdragon 8 Gen 3, 5000 мАч, зарядка 90W. Флагман за разумные деньги.", sizes: "", colors: "Чёрный, Белый", stock: 18 },
  { id: 4, name: "Google Pixel 8 Pro 256GB", price: 9800000, discount: 25, category: "Смартфоны", brand: "Google", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80", desc: "Чип Google Tensor G3, AI-фотографии нового уровня, 7 лет обновлений. Лучшая камера среди Android.", sizes: "", colors: "Обсидиан, Фарфор, Бирюзовый", stock: 9 },
  // 💻 Ноутбуки
  { id: 5, name: "MacBook Pro 14\" M3 Pro", price: 22000000, discount: 30, category: "Ноутбуки", brand: "Apple", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", desc: "Чип M3 Pro, дисплей Liquid Retina XDR, 18ГБ памяти, батарея до 18 часов. Идеал для профессионалов.", sizes: "", colors: "Серебристый, Космический Серый", stock: 8 },
  { id: 6, name: "ASUS ROG Zephyrus G16 RTX 4070", price: 19500000, category: "Ноутбуки", brand: "ASUS", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", desc: "RTX 4070 8GB, Core i9-13900H, 16GB DDR5, дисплей 240Гц QHD. Геймерский ноутбук высшего класса.", sizes: "", colors: "Чёрный", stock: 5 },
  { id: 7, name: "Lenovo ThinkPad X1 Carbon Gen 12", price: 17000000, category: "Ноутбуки", brand: "Lenovo", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80", desc: "Core Ultra 7, 1кг веса, 14\" IPS OLED, 57Вт·ч, военные стандарты прочности MIL-STD-810H.", sizes: "", colors: "Чёрный", stock: 11 },
  // 🎧 Аудио
  { id: 8, name: "AirPods Pro 2nd Gen", price: 3200000, category: "Аудио", brand: "Apple", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80", desc: "Активное шумоподавление нового поколения, Adaptive Audio, кейс MagSafe с динамиком.", sizes: "", colors: "Белый", stock: 30 },
  { id: 9, name: "Sony WH-1000XM5", price: 4200000, category: "Аудио", brand: "Sony", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80", desc: "Лучшее шумоподавление в классе, 30 часов работы, многоточечное Bluetooth 5.2. Для настоящих меломанов.", sizes: "", colors: "Чёрный, Серебристый, Кремовый", stock: 20 },
  { id: 10, name: "JBL Flip 7 Portable Speaker", price: 1850000, category: "Аудио", brand: "JBL", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80", desc: "IP67 водозащита, 12ч работы, PartyBoost для объединения колонок, мощный бас.", sizes: "", colors: "Чёрный, Красный, Синий, Зелёный", stock: 35 },
  { id: 11, name: "Samsung Galaxy Buds3 Pro", price: 2100000, category: "Аудио", brand: "Samsung", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80", desc: "ANC следующего поколения, 360 Audio, до 30 часов с кейсом, компактный дизайн без ножки.", sizes: "", colors: "Белый, Серебристый", stock: 22 },
  // 📲 Планшеты
  { id: 12, name: "iPad Pro 13\" M4 Wi-Fi 256GB", price: 16500000, category: "Планшеты", brand: "Apple", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80", desc: "Самый тонкий Apple-продукт, OLED Ultra Retina XDR, чип M4, Apple Pencil Pro.", sizes: "", colors: "Серебристый, Чёрный", stock: 10 },
  { id: 13, name: "Samsung Galaxy Tab S9 Ultra", price: 13800000, category: "Планшеты", brand: "Samsung", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80", desc: "14.6\" AMOLED 120Гц, S Pen в комплекте, Snapdragon 8 Gen 2, DeX режим для работы.", sizes: "", colors: "Графит, Бежевый", stock: 7 },
  // ⌚ Смарт-часы
  { id: 14, name: "Apple Watch Series 9 45mm", price: 5200000, category: "Смарт-часы", brand: "Apple", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80", desc: "Двойное нажатие, Always-On дисплей, датчик ЧСС, ЭКГ, crash detection. Для здоровья и стиля.", sizes: "41mm, 45mm", colors: "Полуночный, Серебристый, Красный", stock: 28 },
  { id: 15, name: "Xiaomi Mi Watch S3", price: 1890000, category: "Смарт-часы", brand: "Xiaomi", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80", desc: "AMOLED 1.43\", пульсоксиметр, GPS, 12 дней работы, 150+ спортивных режимов.", sizes: "", colors: "Серебристый, Чёрный, Золотой", stock: 35 },
  { id: 16, name: "Garmin Fenix 7X Solar", price: 8900000, category: "Смарт-часы", brand: "Garmin", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80", desc: "Солнечная зарядка, GPS+GLONASS+Galileo, до 28 дней работы, топографические карты.", sizes: "", colors: "Серебристый, Чёрный", stock: 9 },
  // 📷 Фото
  { id: 17, name: "Sony A7 IV Full-Frame", price: 18500000, category: "Фотоаппараты", brand: "Sony", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", desc: "33MP BSI-сенсор, 4K 60p видео, 759 точек АФ, двойной слот SD. Гибрид для фото и видео.", sizes: "", colors: "Чёрный", stock: 4 },
  { id: 18, name: "GoPro Hero 12 Black", price: 3800000, category: "Фотоаппараты", brand: "GoPro", image: "https://images.unsplash.com/photo-1575160852890-af5ed72fc8b5?w=800&q=80", desc: "5.3K60fps, HyperSmooth 6.0 стабилизация, водонепроницаемость 10м, голосовое управление.", sizes: "", colors: "Чёрный", stock: 20 },
  // 👟 Кроссовки
  { id: 19, name: "Nike Air Jordan 1 Retro High OG", price: 2800000, category: "Кроссовки", brand: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", desc: "Культовая высокая модель с кожаным верхом и логотипом Jumpman. Лимитированная версия Bred.", sizes: "38, 39, 40, 41, 42, 43, 44", colors: "Чёрный/Красный, Белый/Синий", stock: 25 },
  { id: 20, name: "Adidas Yeezy Boost 350 V2", price: 3500000, category: "Кроссовки", brand: "Adidas", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80", desc: "Прайм-книт верх с BOOST подошвой. Коллаборация Kanye West × Adidas. Коллекционная ценность.", sizes: "39, 40, 41, 42, 43, 44", colors: "Zebra, Beluga, Carbon", stock: 18 },
  { id: 21, name: "New Balance 550 White Green", price: 1850000, category: "Кроссовки", brand: "New Balance", image: "https://images.unsplash.com/photo-1551107696-a4b0a5f5d95c?w=800&q=80", desc: "Ретро-баскетбольный дизайн 1989 года. Кожаный верх, резиновая подошва, минималистичный стиль.", sizes: "38, 39, 40, 41, 42, 43", colors: "Белый/Зелёный, Белый/Серый", stock: 30 },
  { id: 22, name: "Puma RS-X³ Puzzle", price: 1200000, category: "Кроссовки", brand: "Puma", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", desc: "Объёмный дизайн Y2K, многослойная подошва RS с амортизацией. Яркий уличный стиль.", sizes: "39, 40, 41, 42, 43", colors: "Белый, Серый, Синий", stock: 22 },
  { id: 23, name: "Nike Dunk Low Retro White Black", price: 1950000, category: "Кроссовки", brand: "Nike", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80", desc: "Классический Dunk в сдержанном колорвее Panda. Кожаный верх, резиновая подошва, Nike Air.", sizes: "38, 39, 40, 41, 42, 43, 44, 45", colors: "Белый/Чёрный", stock: 40 },
  { id: 24, name: "Converse Chuck Taylor All Star 70s", price: 890000, category: "Кроссовки", brand: "Converse", image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80", desc: "Культовые кеды с плотным холщовым верхом, металлическими люверсами. Vintage fit.", sizes: "36, 37, 38, 39, 40, 41, 42, 43", colors: "Чёрный, Белый, Красный", stock: 45 },
  { id: 25, name: "Vans Old Skool Pro Skate", price: 950000, category: "Кроссовки", brand: "Vans", image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80", desc: "Легендарная полоска сбоку, замшевый+холщовый верх, Waffle подошва для скейтбординга.", sizes: "37, 38, 39, 40, 41, 42, 43, 44", colors: "Чёрный/Белый, Серый", stock: 38 },
  // 👗 Одежда
  { id: 26, name: "Толстовка The North Face Hoodie", price: 1450000, category: "Одежда", brand: "The North Face", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80", desc: "Флисовая толстовка из переработанных материалов. Тёплая, лёгкая, капюшон с кулиской.", sizes: "XS, S, M, L, XL, XXL", colors: "Чёрный, Серый, Красный, Зелёный", stock: 40 },
  { id: 27, name: "Джинсы Levi's 501 Original Fit", price: 980000, category: "Одежда", brand: "Levi's", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", desc: "Классические прямые джинсы с 1873 года. 100% хлопок, пуговичная застёжка, 5 карманов.", sizes: "28, 30, 32, 34, 36, 38", colors: "Индиго, Светло-синий, Чёрный", stock: 50 },
  { id: 28, name: "Куртка Nike Tech Fleece", price: 2100000, category: "Одежда", brand: "Nike", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", desc: "Технологичная флисовая куртка с зональным утеплением. Slim-fit, карманы на молнии.", sizes: "S, M, L, XL", colors: "Чёрный, Серый, Синий Navy", stock: 25 },
  { id: 29, name: "Худи Supreme Box Logo", price: 3800000, category: "Одежда", brand: "Supreme", image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80", desc: "Лимитированное худи с культовым боксовым логотипом. Тяжёлый хлопок 500г/м², прямой крой.", sizes: "S, M, L, XL", colors: "Чёрный, Красный, Белый", stock: 8 },
  { id: 30, name: "Ветровка Adidas Originals Trefoil", price: 1200000, category: "Одежда", brand: "Adidas", image: "https://images.unsplash.com/photo-1517438984742-1262db08379e?w=800&q=80", desc: "Лёгкая водоотталкивающая ветровка с культовым клеверным лого. Карман-кенгуру.", sizes: "XS, S, M, L, XL, XXL", colors: "Белый, Чёрный, Синий", stock: 32 },
  { id: 31, name: "Поло Ralph Lauren Slim Fit", price: 1650000, category: "Одежда", brand: "Ralph Lauren", image: "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?w=800&q=80", desc: "100% хлопок piqué, вышитый пони, слим-крой. Вечная классика для любого случая.", sizes: "S, M, L, XL, XXL", colors: "Белый, Красный, Синий, Зелёный", stock: 55 },
  // 🏠 Бытовая техника
  { id: 32, name: "Кофемашина De'Longhi Magnifica Evo", price: 8900000, category: "Бытовая техника", brand: "De'Longhi", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80", desc: "Автоматическая кофемашина со встроенной кофемолкой, 13 уровней помола, латте арт.", sizes: "", colors: "Серебристый, Чёрный", stock: 12 },
  { id: 33, name: "Робот-пылесос Roborock S8 Pro Ultra", price: 7500000, category: "Бытовая техника", brand: "Roborock", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", desc: "Одновременная уборка и мытьё полов, самоочищающаяся база, LiDAR навигация.", sizes: "", colors: "Белый, Чёрный", stock: 8 },
  { id: 34, name: "Блендер Vitamix Explorian E310", price: 4500000, category: "Бытовая техника", brand: "Vitamix", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80", desc: "2.0 л.с. мотор, 10 скоростей, профессиональные лезвия. Смузи, супы, соусы — всё идеально.", sizes: "", colors: "Чёрный, Красный, Серебристый", stock: 14 },
  { id: 35, name: "Philips Air Fryer XXL 7.3L", price: 3200000, category: "Бытовая техника", brand: "Philips", image: "https://images.unsplash.com/photo-1626197031507-c17099753214?w=800&q=80", desc: "Технология Rapid Air, 7.3 литра для семьи 6 человек, цифровой экран, 7 предустановок.", sizes: "", colors: "Чёрный, Белый", stock: 20 },
  { id: 36, name: "Умная колонка Яндекс Станция Макс 2", price: 3500000, category: "Умный дом", brand: "Яндекс", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80", desc: "Алиса внутри, 65Вт, HDMI для TV, ZigBee хаб, управление умным домом голосом.", sizes: "", colors: "Антрацит, Бежевый", stock: 20 },
  // 💄 Красота
  { id: 37, name: "Dyson Airwrap Complete Long", price: 6800000, category: "Красота", brand: "Dyson", image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80", desc: "Стайлер для завивки и выпрямления без жара. Технология Coanda, 6 насадок в комплекте.", sizes: "", colors: "Никель/Медь, Пруссия/Никель", stock: 15 },
  { id: 38, name: "Oral-B iO Series 9 Electric Toothbrush", price: 2800000, category: "Красота", brand: "Oral-B", image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80", desc: "AI-распознавание зон, 7 режимов чистки, 3D отслеживание, зарядный футляр.", sizes: "", colors: "Чёрный, Белый, Розовый", stock: 25 },
  // 🎮 Игровые
  { id: 39, name: "PlayStation 5 Slim Digital Edition", price: 8900000, category: "Игровые консоли", brand: "Sony", image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80", desc: "SSD 1ТБ, 4K Gaming, 120fps, Ray Tracing. Новая тонкая версия без дисковода.", sizes: "", colors: "Белый", stock: 6 },
  { id: 40, name: "Геймпад Xbox Series X Controller", price: 890000, category: "Игровые аксессуары", brand: "Microsoft", image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&q=80", desc: "Тактильные триггеры, текстурированные грипсы, USB-C, совместим Xbox и PC.", sizes: "", colors: "Чёрный, Белый, Синий, Красный", stock: 40 },
  { id: 41, name: "Nintendo Switch OLED Model", price: 6200000, category: "Игровые консоли", brand: "Nintendo", image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80", desc: "7\" OLED экран, 64ГБ памяти, улучшенные динамики, регулируемая подставка.", sizes: "", colors: "Белый, Неон", stock: 14 },
  { id: 42, name: "Razer DeathAdder V3 Pro", price: 1650000, category: "Игровые аксессуары", brand: "Razer", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80", desc: "Беспроводная, 63г, сенсор Focus Pro 30K, 90 часов работы. Выбор киберспортсменов.", sizes: "", colors: "Чёрный, Белый", stock: 28 },
  // 🛴 Транспорт
  { id: 43, name: "Самокат Ninebot KickScooter E2 Plus", price: 4200000, category: "Транспорт", brand: "Segway", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80", desc: "25 км/ч макс, запас хода 35 км, складной, освещение. Идеален для города.", sizes: "", colors: "Белый, Чёрный", stock: 10 },
  { id: 44, name: "Велосипед Trek Marlin 7 Gen 2", price: 6500000, category: "Транспорт", brand: "Trek", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80", desc: "Горный хардтейл, 27.5\"/29\", SRAM 8-speed, вилка RockShox, гидравлические тормоза.", sizes: "S, M, L, XL", colors: "Красный, Синий, Чёрный", stock: 6 },
  // 🏋️ Спорт
  { id: 45, name: "Гантели регулируемые Bowflex 552", price: 3200000, category: "Спорт", brand: "Bowflex", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80", desc: "Заменяют 15 пар гантелей 2.3–23.6кг. Быстрая смена диска, компактное хранение.", sizes: "", colors: "Серый/Чёрный", stock: 18 },
  { id: 46, name: "Коврик для йоги Manduka PRO 6мм", price: 1200000, category: "Спорт", brand: "Manduka", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", desc: "Нескользящий, 6мм плотность, экологичная резина, пожизненная гарантия.", sizes: "", colors: "Чёрный, Фиолетовый, Синий", stock: 30 },
  { id: 47, name: "Штанга с блинами Eleiko 20кг", price: 5800000, category: "Спорт", brand: "Eleiko", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", desc: "Олимпийская штанга 20кг + 50кг дисков, хромированные втулки, шведская сталь.", sizes: "", colors: "Серебристый", stock: 4 },
  // 📦 Разное
  { id: 48, name: "Электронная книга Kindle Paperwhite 2024", price: 2100000, category: "Электроника", brand: "Amazon", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80", desc: "6.8\" без бликов 300PPI, 16ГБ, IPX8 водозащита, 12 недель работы от батареи.", sizes: "", colors: "Чёрный, Агатовый, Аметистовый", stock: 25 },
  { id: 49, name: "Рюкзак Osprey Atmos AG 65L", price: 2800000, category: "Аксессуары", brand: "Osprey", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", desc: "65 литров, Anti-Gravity подвеска, дождевой чехол, fit-on-the-fly регулировка поясного ремня.", sizes: "S/M, M/L", colors: "Зелёный, Синий, Оранжевый", stock: 12 },
  { id: 50, name: "Портативный проектор Anker Nebula Capsule 3", price: 5500000, category: "Электроника", brand: "Anker", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", desc: "Android TV 11, 1080p, 300 ANSI люмен, встроенный динамик 8Вт, батарея 2.5ч.", sizes: "", colors: "Чёрный", stock: 9 },
];

const CATALOG_VERSION = 'marketplace_v3';

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
