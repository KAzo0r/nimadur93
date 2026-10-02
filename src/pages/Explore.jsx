import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { TrendingUp, Percent, Clock, Star, Zap, Tag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NEWS = [
  {
    id: 1,
    category: { ru: '🔥 Распродажа', en: '🔥 Sale', uz: '🔥 Chegirma' },
    title: { ru: 'Мегараспродажа: скидки до 50% на смартфоны', en: 'Mega sale: up to 50% off smartphones', uz: 'Mega chegirma: smartfonlarga 50% gacha' },
    desc: { ru: 'iPhone 15 Pro, Samsung S24 Ultra и другие топовые смартфоны со скидкой только до конца недели.', en: 'iPhone 15 Pro, Samsung S24 Ultra and other top smartphones discounted until the end of the week.', uz: 'iPhone 15 Pro, Samsung S24 Ultra va boshqa top smartfonlar haftaning oxirigacha chegirmada.' },
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    time: { ru: '2 часа назад', en: '2 hours ago', uz: '2 soat oldin' },
    tag: { ru: 'Горячее', en: 'Hot', uz: 'Qaynoq' },
    tagColor: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    id: 2,
    category: { ru: '📱 Новинки', en: '📱 New Arrivals', uz: '📱 Yangi' },
    title: { ru: 'Поступление MacBook Pro M3 Pro — в наличии!', en: 'MacBook Pro M3 Pro is now in stock!', uz: 'MacBook Pro M3 Pro sotuvda!' },
    desc: { ru: 'Долгожданный MacBook Pro с чипом M3 Pro уже в нашем маркете. Производительность нового уровня для профессионалов.', en: 'The highly anticipated MacBook Pro with M3 Pro chip is here. Next-level performance for professionals.', uz: 'Kutilgan MacBook Pro M3 Pro chip bilan sotuvda. Professionallar uchun yangi darajadagi samaradorlik.' },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    time: { ru: '5 часов назад', en: '5 hours ago', uz: '5 soat oldin' },
    tag: { ru: 'Новинка', en: 'New', uz: 'Yangi' },
    tagColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 3,
    category: { ru: '🎮 Геймеры', en: '🎮 Gamers', uz: '🎮 Geymerlar' },
    title: { ru: 'PlayStation 5 Slim: новая тонкая версия уже доступна', en: 'PlayStation 5 Slim: new thin version available', uz: 'PlayStation 5 Slim: yangi yupqa versiya mavjud' },
    desc: { ru: 'Sony выпустила обновлённую более компактную версию PS5. Те же мощности, меньший размер. Заказывай сейчас!', en: 'Sony released the updated, more compact PS5. Same power, smaller size. Order now!', uz: 'Sony yangilangan, ixcham PS5 chiqardi. Bir xil quvvat, kichikroq hajm. Hozir buyurtma bering!' },
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80',
    time: { ru: '1 день назад', en: '1 day ago', uz: '1 kun oldin' },
    tag: { ru: 'В наличии', en: 'In Stock', uz: 'Sotuvda' },
    tagColor: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    id: 4,
    category: { ru: '👟 Стиль', en: '👟 Style', uz: '👟 Uslub' },
    title: { ru: 'Nike Air Jordan 1 Retro: лимитированная версия Bred', en: 'Nike Air Jordan 1 Retro: limited Bred edition', uz: 'Nike Air Jordan 1 Retro: cheklangan Bred versiyasi' },
    desc: { ru: 'Культовые кроссовки в колорвее Bred снова доступны. Успей купить до исчезновения из наличия!', en: 'The iconic sneakers in the Bred colorway are available again. Hurry before they sell out!', uz: 'Bred rangidagi afsonaviy krossovkalar yana sotuvda. Tugamasdan oldin xarid qilishga shoshiling!' },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    time: { ru: '2 дня назад', en: '2 days ago', uz: '2 kun oldin' },
    tag: { ru: 'Лимитед', en: 'Limited', uz: 'Cheklangan' },
    tagColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    id: 5,
    category: { ru: '🎧 Аудио', en: '🎧 Audio', uz: '🎧 Audio' },
    title: { ru: 'Sony WH-1000XM5 — лучшее шумоподавление 2024', en: 'Sony WH-1000XM5 — best noise cancellation of 2024', uz: 'Sony WH-1000XM5 — 2024-yilning eng yaxshi shovqin so\'ndirgichi' },
    desc: { ru: 'Эксперты признали Sony WH-1000XM5 лучшими наушниками с шумоподавлением. Узнай почему.', en: 'Experts named Sony WH-1000XM5 the best noise-canceling headphones. Find out why.', uz: 'Mutaxassislar Sony WH-1000XM5 ni eng yaxshi shovqinni qaytaruvchi quloqchin deb topdi. Nega ekanini bilib oling.' },
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
    time: { ru: '3 дня назад', en: '3 days ago', uz: '3 kun oldin' },
    tag: { ru: 'Обзор', en: 'Review', uz: 'Sharh' },
    tagColor: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    id: 6,
    category: { ru: '💡 Советы', en: '💡 Tips', uz: '💡 Maslahatlar' },
    title: { ru: 'Промокод FIRST25: скидка 25% на первый заказ', en: 'Promo code FIRST25: 25% off first order', uz: 'FIRST25 promokodi: birinchi buyurtmaga 25% chegirma' },
    desc: { ru: 'Новый покупатель? Используй промокод FIRST25 при оформлении заказа и получи 25% скидку!', en: 'New customer? Use the FIRST25 promo code at checkout and get a 25% discount!', uz: 'Yangi xaridormisiz? Buyurtmani rasmiylashtirishda FIRST25 promokodidan foydalaning va 25% chegirma oling!' },
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    time: { ru: '5 дней назад', en: '5 days ago', uz: '5 kun oldin' },
    tag: { ru: 'Промокод', en: 'Promo code', uz: 'Promokod' },
    tagColor: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  }
];

const BANNERS = [
  { title: 'Недели электроники', sub: 'Скидки до 40%', icon: '📱', color: 'from-indigo-600 to-blue-800' },
  { title: 'Спортивный сезон', sub: 'Nike, Adidas, Puma', icon: '👟', color: 'from-orange-500 to-red-700' },
  { title: 'Умный дом', sub: 'Roborock, Dyson и другие', icon: '🏠', color: 'from-emerald-500 to-teal-700' },
];

export default function Explore() {
  const { t, i18n } = useTranslation();
  const { products } = useStore();
  const [activeFilter, setActiveFilter] = useState('Все');
  const navigate = useNavigate();

  const filters = ['Все', '🔥 Распродажа', '📱 Новинки', '🎮 Геймеры', '👟 Стиль', '🎧 Аудио', '💡 Советы'];
  const filtered = activeFilter === 'Все' ? NEWS : NEWS.filter(n => n.category === activeFilter);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Banners */}
      <section>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Zap className="text-yellow-500" size={28} />
          Акции и Новости
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BANNERS.map((b, i) => (
            <div key={i} onClick={() => navigate('/catalog')} className={`bg-gradient-to-br ${b.color} p-6 rounded-3xl text-white cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group`}>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{b.icon}</div>
              <h3 className="font-bold text-xl">{b.title}</h3>
              <p className="text-white/70 text-sm mt-1">{b.sub}</p>
              <div className="mt-4 flex items-center gap-1 text-white/90 text-sm font-medium">
                Смотреть <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hot Deals - from real products */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <TrendingUp className="text-red-500" size={22} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Горячие предложения</h2>
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">HOT</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => {
            const d = p.discount || 10;
            const oldPrice = Math.round(p.price / (1 - d / 100));
            return (
              <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="relative h-40 overflow-hidden">
                  <img src={p.image} alt={typeof p.name === 'object' ? p.name.ru : p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Percent size={10} /> -{d}%
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">{typeof p.name === 'object' ? p.name[i18n.language] || p.name.ru : p.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-indigo-600 dark:text-indigo-400">{p.price.toLocaleString()} UZS</span>
                  </div>
                  <p className="text-xs text-gray-400 line-through">{oldPrice.toLocaleString()} UZS</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* News Feed */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <Clock className="text-indigo-500" size={22} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Лента новостей</h2>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-400'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(news => (
            <div key={news.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <div className="h-48 overflow-hidden">
                <img src={news.image} alt={news.title.ru} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${news.tagColor}`}>{news.tag[i18n.language] || news.tag['ru']}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {news.time[i18n.language] || news.time['ru']}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-500 transition-colors">{news.title[i18n.language] || news.title['ru']}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{news.desc[i18n.language] || news.desc['ru']}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <Tag className="text-purple-500" size={22} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Популярные категории</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            {name:'Смартфоны',emoji:'📱',count:products.filter(p=>p.category==='Смартфоны').length},
            {name:'Кроссовки',emoji:'👟',count:products.filter(p=>p.category==='Кроссовки').length},
            {name:'Аудио',emoji:'🎧',count:products.filter(p=>p.category==='Аудио').length},
            {name:'Одежда',emoji:'👗',count:products.filter(p=>p.category==='Одежда').length},
            {name:'Игровые',emoji:'🎮',count:products.filter(p=>p.category==='Игровые консоли').length},
          ].map((c,i)=>(
            <div key={i} onClick={() => navigate('/catalog')} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-4 text-center hover:-translate-y-1 transition-transform cursor-pointer shadow-sm">
              <div className="text-3xl mb-2">{c.emoji}</div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{c.name}</p>
              <p className="text-xs text-gray-500 mt-1">{c.count} товаров</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
