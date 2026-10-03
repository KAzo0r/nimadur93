import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { Plus, Edit2, Trash2, LogOut, BarChart2, Package, Users, User, Settings, Bell, Search, ShoppingCart, Archive, Tags, CreditCard, Ticket, Star, Truck, Heart, Shield, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const mockData = [
  { name: 'Янв', sales: 120, visits: 450 },
  { name: 'Фев', sales: 95, visits: 380 },
  { name: 'Мар', sales: 150, visits: 520 },
  { name: 'Апр', sales: 180, visits: 610 },
  { name: 'Май', sales: 160, visits: 590 },
  { name: 'Июн', sales: 210, visits: 720 },
  { name: 'Июл', sales: 250, visits: 850 },
  { name: 'Авг', sales: 300, visits: 980 },
  { name: 'Сен', sales: 280, visits: 920 },
  { name: 'Окт', sales: 320, visits: 1050 },
  { name: 'Ноя', sales: 450, visits: 1400 },
  { name: 'Дек', sales: 500, visits: 1600 },
];

const menuItems = [
  { id: 'analytics', label: '📊 Аналитика', icon: BarChart2 },
  { id: 'products', label: '👟 Товары', icon: Package },
  { id: 'orders', label: '🛍️ Заказы', icon: ShoppingCart },
  { id: 'customers', label: '👥 Клиенты', icon: Users },
  { id: 'inventory', label: '📦 Склад', icon: Archive },
  { id: 'categories', label: '🏷️ Категории', icon: Tags },
  { id: 'payments', label: '💳 Платежи', icon: CreditCard },
  { id: 'promocodes', label: '🎟️ Промокоды', icon: Ticket },
  { id: 'reviews', label: '⭐ Отзывы', icon: Star },
  { id: 'delivery', label: '🚚 Доставка', icon: Truck },
  { id: 'favorites', label: '❤️ Избранное', icon: Heart },
  { id: 'notifications', label: '🔔 Уведомления', icon: Bell },
  { id: 'admins', label: '👤 Администраторы', icon: Shield },
  { id: 'settings', label: '⚙️ Настройки', icon: Settings },
];

export default function Admin() {
  const { t, i18n } = useTranslation();
  const { user, setUser, products, setProducts, shopName, setShopName, orders, reviews, updateOrderStatus, admins, addAdmin, removeAdmin, editAdmin } = useStore();
  const navigate = useNavigate();
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ 
    name: '', brand: 'Nike', price: '', category: 'Кроссовки', 
    sizes: '', colors: '', stock: '', image: '', desc: '' 
  });
  const [activeTab, setActiveTab] = useState('analytics');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Новый заказ #10234', desc: 'Заказ на сумму 13,500,000 UZS ожидает обработки.', type: 'order', time: '10 минут назад', isNew: true },
    { id: 2, title: 'Новый отзыв', desc: 'Пользователь оставил 5 звезд к товару "iPhone 15 Pro Max".', type: 'review', time: '1 час назад', isNew: true },
    { id: 3, title: 'Низкий остаток на складе', desc: 'Товар "AirPods Pro 2" заканчивается (осталось 2 шт.)', type: 'alert', time: '3 часа назад', isNew: false },
    { id: 4, title: 'Регистрация пользователя', desc: 'Новый пользователь alex@mail.ru успешно зарегистрировался.', type: 'user', time: 'Вчера', isNew: false },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  };

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const salesToday = orders?.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).reduce((acc, o) => acc + o.total, 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((acc, o) => acc + o.total, 0) || 0;
  const totalStock = products?.reduce((acc, p) => acc + (Number(p.stock) || 0), 0) || 0;

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { 
      ...form, 
      price: Number(form.price), 
      stock: Number(form.stock) || 0 
    };

    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...productData, id: editingId } : p));
      setEditingId(null);
    } else {
      setProducts([...products, { ...productData, id: Date.now() }]);
    }
    setForm({ name: '', brand: 'Nike', price: '', category: 'Кроссовки', sizes: '', colors: '', stock: '', image: '', desc: '' });
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: typeof p.name === 'object' ? (p.name.ru || p.name[i18n.language]) : (p.name || ''),
      brand: p.brand || 'Nike',
      price: p.price || '',
      category: p.category || 'Кроссовки',
      sizes: p.sizes || '',
      colors: p.colors || '',
      stock: p.stock || '',
      image: p.image || '',
      desc: typeof p.desc === 'object' ? (p.desc.ru || p.desc[i18n.language]) : (p.desc || '')
    });
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] gap-6 animate-fade-in">
      
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col gap-6 h-[85vh] sticky top-24 overflow-hidden flex-shrink-0">
        <div className="flex items-center gap-4 px-2 shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
            A
          </div>
          <div>
            <h2 className="font-bold text-xl leading-tight text-gray-900 dark:text-white">Admin Pro</h2>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all text-left ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                <span className="truncate">{item.label.replace(/^[^\s]+\s/, '')}</span>
              </button>
            )
          })}
        </div>

        <button 
          onClick={() => setUser(null)}
          className="flex items-center justify-center gap-3 px-5 py-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shrink-0 font-bold"
        >
          <LogOut size={20} />
          Выйти
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50">
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Поиск по админке..." className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white" />
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            <button onClick={() => setActiveTab('notifications')} className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Bell size={24} />
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              )}
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-6">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-sm leading-tight text-gray-900 dark:text-white">{user.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">Superadmin</p>
              </div>
              <img src={user.photo || `https://ui-avatars.com/api/?name=${user.name || 'A'}&background=6366f1&color=fff`} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900" alt="Admin" />
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-slide-up">
            {/* 6 Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: 'Продажи сегодня', value: formatPrice(salesToday, i18n.language), trend: '+0%', color: 'text-gray-500' },
                { title: 'Заказы', value: totalOrders.toString(), trend: '+0', color: 'text-gray-500' },
                { title: 'Выручка (всего)', value: formatPrice(totalRevenue, i18n.language), trend: '+0%', color: 'text-gray-500' },
                { title: 'На складе', value: `${totalStock} шт`, trend: '+0', color: 'text-gray-500' },
                { title: 'Клиенты', value: '1', trend: '+1', color: 'text-blue-500' },
                { title: 'Возвраты', value: '0', trend: '0', color: 'text-gray-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-center transition-transform hover:-translate-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 truncate">{stat.title}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{stat.value}</h3>
                  <div className={`text-xs font-semibold mt-1 ${stat.color}`}>{stat.trend}</div>
                </div>
              ))}
            </div>

            {/* Grid Layout for remaining widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column (Chart & Orders) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Sales Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">График продаж</h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '12px' }} />
                        <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Последние заказы</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-700/50">
                          <th className="pb-3 font-medium">Заказ</th>
                          <th className="pb-3 font-medium">Клиент</th>
                          <th className="pb-3 font-medium">Сумма</th>
                          <th className="pb-3 font-medium">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-gray-900 dark:text-gray-300">
                        {orders && orders.length > 0 ? (
                          orders.slice(0, 5).map(order => (
                            <tr key={order.id}>
                              <td className="py-3 font-medium">#{String(order.id || '').slice(-4)}</td>
                              <td className="py-3">{order.userName}</td>
                              <td className="py-3">{formatPrice(order.total, i18n.language)}</td>
                              <td className="py-3">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 rounded-md text-xs font-medium">
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" className="py-4 text-center text-gray-500 dark:text-gray-400">Пока нет заказов</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column (Best selling, Low stock, Reviews) */}
              <div className="space-y-6">
                
                {/* Best Selling */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Хиты продаж</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center font-bold text-indigo-500">1</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Nike Air Max 90</p>
                        <p className="text-xs text-gray-500">45 продано</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center font-bold text-gray-500">2</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">Adidas Yeezy Boost</p>
                        <p className="text-xs text-gray-500">32 продано</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center font-bold text-orange-500">3</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">New Balance 550</p>
                        <p className="text-xs text-gray-500">28 продано</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Low Stock */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 border-l-4 border-l-red-500">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">Низкие остатки</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300 truncate pr-2">Puma RS-X (Белый, 42)</span>
                      <span className="font-bold text-red-500">2 шт</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300 truncate pr-2">Nike Dunk Low (Ч/Б, 39)</span>
                      <span className="font-bold text-red-500">1 шт</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300 truncate pr-2">Adidas Forum (40)</span>
                      <span className="font-bold text-red-500">0 шт</span>
                    </div>
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Последние отзывы</h2>
                  <div className="space-y-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Игорь</span>
                        <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                      </div>
                      <p className="text-gray-500 text-xs italic">"Отличные кроссы, размер подошел идеально!"</p>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Олег</span>
                        <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                      </div>
                      <p className="text-gray-500 text-xs italic">"Доставили быстро, качество топ, но коробка помялась."</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up">
            <div className="xl:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 h-fit sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingId ? 'Редактировать модель' : 'Добавить кроссовки'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Название (Модель)</label>
                  <input type="text" placeholder="Air Jordan 1 Retro" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Бренд</label>
                    <select value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white">
                      <option value="Nike">Nike</option>
                      <option value="Adidas">Adidas</option>
                      <option value="New Balance">New Balance</option>
                      <option value="Puma">Puma</option>
                      <option value="Asics">Asics</option>
                      <option value="Balenciaga">Balenciaga</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Категория</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white">
                      <option value="Кроссовки">Кроссовки</option>
                      <option value="Кеды">Кеды</option>
                      <option value="Спортивная обувь">Спорт</option>
                      <option value="Зимние">Зимние</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Цена (UZS)</label>
                    <input type="number" placeholder="1500000" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Остаток на складе</label>
                    <input type="number" placeholder="25" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Размеры (ч/з запятую)</label>
                    <input type="text" placeholder="39, 40, 41, 42" value={form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Цвета</label>
                    <input type="text" placeholder="Белый, Черный" value={form.colors} onChange={e => setForm({...form, colors: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Ссылка на фото (URL)</label>
                  <input type="url" placeholder="https://..." required value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white" />
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 ml-2">Описание</label>
                  <textarea placeholder="Опишите модель, материалы, технологии..." required value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 h-24 resize-none transition-colors text-gray-900 dark:text-white"></textarea>
                </div>
                
                <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                  Сохранить
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setForm({ name: '', brand: 'Nike', price: '', category: 'Кроссовки', sizes: '', colors: '', stock: '', image: '', desc: '' })}} className="w-full py-3.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-bold transition-colors mt-2 text-gray-900 dark:text-white">
                    Отмена
                  </button>
                )}
              </form>
            </div>

            <div className="xl:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">База товаров ({products.length})</h2>
              <div className="grid gap-4">
                {products.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-5 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group" style={{ animationDelay: `${i * 50}ms` }}>
                    <img src={p.image} className="w-24 h-24 object-cover rounded-2xl bg-gray-100 dark:bg-gray-900" alt={p.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight truncate">{typeof p.name === 'object' ? p.name[i18n.language] || p.name.ru : p.name}</h3>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg text-sm">{formatPrice(p.price, i18n.language)}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {p.brand} <span className="px-1">•</span> {p.category}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                        {p.sizes && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">Размеры: {p.sizes}</span>}
                        {p.colors && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">Цвета: {p.colors}</span>}
                        <span className={`px-2 py-1 rounded-md font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          Остаток: {p.stock || 0} шт
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 flex-col sm:flex-row">
                      <button onClick={() => handleEdit(p)} className="p-3 text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors"><Edit2 size={20} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 max-w-2xl">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Настройки магазина</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Название магазина</label>
                  <input 
                    type="text" 
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Sneaker Store"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for unimplemented tabs */}
        {!['analytics', 'products', 'settings', 'orders', 'customers', 'inventory', 'categories', 'payments', 'promocodes', 'reviews', 'delivery', 'notifications', 'favorites', 'admins'].includes(activeTab) && (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center text-center h-[50vh] animate-slide-up">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
              {(() => {
                const item = menuItems.find(m => m.id === activeTab);
                const Icon = item?.icon || Package;
                return <Icon size={40} className="text-indigo-500" />;
              })()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Раздел "{menuItems.find(m => m.id === activeTab)?.label.replace(/^[^\s]+\s/, '')}" в разработке
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Мы работаем над интеграцией этого функционала.
            </p>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Все заказы ({orders?.length || 0})</h2>
              <div className="flex gap-2 flex-wrap">
                {['Все', 'В обработке', 'Отправлен', 'Доставлен', 'Отменён'].map(s => (
                  <button key={s} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors">{s}</button>
                ))}
              </div>
            </div>

            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => {
                  const isPickup = order.deliveryMethod === 'pickup';
                  const statusStyles = {
                    'В обработке': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                    'Отправлен': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    'Доставлен': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    'Клиент забрал': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    'Отменён': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                  };
                  const nextStatuses = isPickup
                    ? ['В обработке', 'Готов к выдаче', 'Клиент забрал', 'Отменён']
                    : ['В обработке', 'Отправлен', 'Доставлен', 'Отменён'];
                  return (
                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                      {/* Order header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">#{String(order.id || '').slice(-6)}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{order.userName}</span>
                          <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('ru-RU', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white">{formatPrice(order.total || 0, i18n.language)}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                        </div>
                      </div>

                      {/* Order body */}
                      <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 w-full sm:w-1/2">
                          <p>{order.paymentMethod === 'card' ? '💳 Карта' : '💵 Наличные'} • {isPickup ? '📦 Самовывоз' : '🚚 Курьер'}</p>
                          {isPickup && order.pickupPoint && (
                            <p className="text-indigo-500 font-medium">📍 {order.pickupPoint.city} — {order.pickupPoint.name}, {order.pickupPoint.address}</p>
                          )}
                          <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                            <p className="font-bold text-gray-900 dark:text-white mb-2">Состав заказа ({order.cart?.length || 0} позиций):</p>
                            <ul className="space-y-2">
                              {(order.cart || []).map((item, idx) => (
                                <li key={idx} className="flex justify-between items-start text-xs border-b border-gray-200 dark:border-gray-700 pb-1 last:border-0 last:pb-0">
                                  <div className="flex-1 pr-2">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{typeof item.name === 'object' ? item.name[i18n.language] || item.name.ru : item.name}</span>
                                    {item.discount && <span className="ml-1 text-red-500">(-{item.discount}%)</span>}
                                  </div>
                                  <div className="whitespace-nowrap font-medium">
                                    {item.qty} шт x <span className="text-indigo-500">{formatPrice(item.price, i18n.language)}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Status controls */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Сменить статус:</p>
                          <div className="flex flex-wrap gap-2">
                            {nextStatuses.filter(s => s !== order.status).map(s => (
                              <button
                                key={s}
                                onClick={() => updateOrderStatus(order.id, s)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:-translate-y-0.5 hover:shadow-sm ${
                                  s === 'Доставлен' || s === 'Клиент забрал' ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400'
                                  : s === 'Отправлен' || s === 'Готов к выдаче' ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                  : s === 'Отменён' ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400'
                                  : 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                }`}
                              >
                                {s === 'Доставлен' ? '✅ Доставлен'
                                  : s === 'Клиент забрал' ? '✅ Забрал'
                                  : s === 'Отправлен' ? '🚚 Отправить'
                                  : s === 'Готов к выдаче' ? '📦 Готово'
                                  : s === 'Отменён' ? '❌ Отменить'
                                  : s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-16 rounded-3xl border border-gray-100 dark:border-gray-700/50 text-center text-gray-400">
                Заказов пока нет.
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Клиенты</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{label:'Всего клиентов',val:'8,432',icon:'👥'},{label:'Новых за месяц',val:'124',icon:'🆕'},{label:'Активных',val:'3,211',icon:'✅'}].map((c,i)=>(
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm text-center">
                  <div className="text-4xl mb-2">{c.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{c.val}</div>
                  <div className="text-sm text-gray-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr className="text-gray-500 text-left">
                    <th className="px-6 py-4 font-semibold">Клиент</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Заказов</th>
                    <th className="px-6 py-4 font-semibold">Потрачено</th>
                    <th className="px-6 py-4 font-semibold">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {[
                    {name:'Алексей С.',email:'alex@mail.ru',orders:12,spent:'14,500,000',status:'VIP'},
                    {name:'Мария К.',email:'maria@gmail.com',orders:8,spent:'9,800,000',status:'Активный'},
                    {name:'Дмитрий В.',email:'dima@yandex.ru',orders:3,spent:'3,200,000',status:'Новый'},
                    {name:'Анна Л.',email:'anna@mail.ru',orders:21,spent:'28,600,000',status:'VIP'},
                  ].map((c,i)=>(
                    <tr key={i} className="text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 font-semibold">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{c.name[0]}</div>
                          {c.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{c.email}</td>
                      <td className="px-6 py-4">{c.orders}</td>
                      <td className="px-6 py-4 font-medium">{formatPrice(c.spent, i18n.language)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${c.status==='VIP'?'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400':c.status==='Активный'?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Склад — {products.length} позиций</h2>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr className="text-gray-500 text-left">
                    <th className="px-6 py-4 font-semibold">Товар</th>
                    <th className="px-6 py-4 font-semibold">Категория</th>
                    <th className="px-6 py-4 font-semibold">Цена</th>
                    <th className="px-6 py-4 font-semibold">Остаток</th>
                    <th className="px-6 py-4 font-semibold">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {products.map(p => (
                    <tr key={p.id} className="text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-xl object-cover bg-gray-100" alt="" />
                          <span className="font-semibold truncate max-w-[180px]">{typeof p.name === 'object' ? p.name[i18n.language] || p.name.ru : p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{p.category}</td>
                      <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{formatPrice(p.price || 0, i18n.language)}</td>
                      <td className="px-6 py-4 font-bold">{p.stock || 0} шт.</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${!p.stock||p.stock===0?'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':Number(p.stock)<5?'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400':'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                          {!p.stock||p.stock===0?'Нет':Number(p.stock)<5?'Мало':'В наличии'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Категории товаров</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...new Set(products.map(p=>p.category))].map((cat, i) => {
                const catProducts = products.filter(p=>p.category===cat);
                const emojis = {'Смартфоны':'📱','Ноутбуки':'💻','Аудио':'🎧','Планшеты':'📲','Кроссовки':'👟','Одежда':'👗','Бытовая техника':'🏠','Красота':'💄','Смарт-часы':'⌚','Транспорт':'🛴','Спорт':'🏋️','Электроника':'📦','Игровые консоли':'🎮','Игровые аксессуары':'🕹️','Умный дом':'🏡'};
                return (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="text-4xl mb-3">{emojis[cat]||'📦'}</div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">{cat}</h3>
                    <p className="text-sm text-gray-500">{catProducts.length} товаров</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Платежи</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {label:'Выручка всего',val:formatPrice(orders?.reduce((a,o)=>a+(o.total||0),0)||0, i18n.language),icon:'💰',color:'text-green-500'},
                {label:'Картой',val:formatPrice(orders?.filter(o=>o.paymentMethod==='card').reduce((a,o)=>a+(o.total||0),0)||0, i18n.language),icon:'💳',color:'text-blue-500'},
                {label:'Наличными',val:formatPrice(orders?.filter(o=>o.paymentMethod==='cash').reduce((a,o)=>a+(o.total||0),0)||0, i18n.language),icon:'💵',color:'text-orange-500'},
              ].map((c,i)=>(
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className={`text-xl font-bold ${c.color}`}>{c.val}</div>
                  <div className="text-sm text-gray-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">История платежей</h3>
              {orders && orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map(o=>(
                    <div key={o.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">#{String(o.id || '').slice(-6)} — {o.userName}</p>
                        <p className="text-xs text-gray-500">{new Date(o.date).toLocaleString()} · {o.paymentMethod==='card'?'Карта':'Наличные'}</p>
                      </div>
                      <span className="text-green-500 font-bold">+{formatPrice(o.total || 0, i18n.language)}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center text-gray-400 py-8">Платежей пока нет</p>}
            </div>
          </div>
        )}

        {/* PROMOCODES TAB */}
        {activeTab === 'promocodes' && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Промокоды и скидки</h2>
            <div className="grid gap-4">
              {[
                {code:'FIRST25',discount:'25%',desc:'Скидка на первый заказ',uses:142,active:true},
                {code:'SPACE',discount:'10%',desc:'Промо акция',uses:89,active:true},
                {code:'MARS',discount:'10%',desc:'Промо акция 2',uses:54,active:true},
                {code:'ADMIN',discount:'50%',desc:'Администраторский код',uses:3,active:true},
                {code:'SUMMER2024',discount:'15%',desc:'Летняя распродажа',uses:0,active:false},
              ].map((p,i)=>(
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 font-bold text-indigo-600 dark:text-indigo-400 text-lg tracking-widest">{p.code}</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{typeof p.desc === 'object' ? p.desc[i18n.language] || p.desc.ru : p.desc}</p>
                      <p className="text-sm text-gray-500">Использован {p.uses} раз</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-green-500">-{p.discount}</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${p.active?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>{p.active?'Активен':'Неактивен'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Отзывы покупателей ({reviews?.length || 0})</h2>
            {reviews && reviews.length > 0 ? (
              <div className="grid gap-4">
                {reviews.map(r=>(
                  <div key={r.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{r.userName}</p>
                        <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()} · Товар #{r.productId}</p>
                      </div>
                      <div className="flex text-yellow-400">{[...Array(5)].map((_,i)=><Star key={i} size={16} fill={i<r.rating?"currentColor":"none"} className={i<r.rating?"":"text-gray-300 dark:text-gray-600"}/>)}</div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{r.text}"</p>
                  </div>
                ))}
              </div>
            ) : <div className="bg-white dark:bg-gray-800 p-16 rounded-3xl border border-gray-100 dark:border-gray-700/50 text-center text-gray-400">Отзывов пока нет. Они появятся когда клиенты оставят их на страницах товаров.</div>}
          </div>
        )}

        {/* DELIVERY TAB */}
        {activeTab === 'delivery' && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Доставка</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">🚚 Ожидают отправки</h3>
                <div className="space-y-3">
                  {orders && orders.filter(o=>o.deliveryMethod==='delivery').length > 0 ? orders.filter(o=>o.deliveryMethod==='delivery').slice(0,5).map(o=>(
                    <div key={o.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">#{String(o.id || '').slice(-4)} — {o.userName}</span>
                      <span className="text-yellow-500 font-semibold">{o.status}</span>
                    </div>
                  )) : <p className="text-center text-gray-400 py-4">Нет заказов</p>}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">📦 Пункты выдачи</h3>
                <div className="space-y-3">
                  {orders && orders.filter(o=>o.deliveryMethod==='pickup').length > 0 ? orders.filter(o=>o.deliveryMethod==='pickup').slice(0,5).map(o=>(
                    <div key={o.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">#{String(o.id || '').slice(-4)} — {o.userName}</span>
                      <span className="text-blue-500 font-semibold">{o.status}</span>
                    </div>
                  )) : <p className="text-center text-gray-400 py-4">Нет заказов</p>}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Тарифы доставки</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {type:'Курьер до двери',price:formatPrice(30000, i18n.language),time:'1-2 дня',icon:'🚴'},
                  {type:'Экспресс доставка',price:formatPrice(60000, i18n.language),time:'Сегодня',icon:'⚡'},
                  {type:'Пункт выдачи',price:'Бесплатно',time:'2-3 дня',icon:'📦'},
                ].map((t,i)=>(
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-center">
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <p className="font-bold text-gray-900 dark:text-white">{t.type}</p>
                    <p className="text-indigo-500 font-semibold">{t.price}</p>
                    <p className="text-xs text-gray-500">{t.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Уведомления</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Последние события</h3>
                <button onClick={markAllAsRead} className="text-indigo-500 hover:underline text-sm font-medium">Отметить все как прочитанные</button>
              </div>

              <div className="space-y-4">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 rounded-2xl flex gap-4 items-start transition-colors ${n.isNew ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                    <div className={`p-3 rounded-xl shrink-0 ${
                      n.type === 'order' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      n.type === 'review' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      n.type === 'alert' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {n.type === 'order' ? <Package size={20} /> :
                       n.type === 'review' ? <Star size={20} /> :
                       n.type === 'alert' ? <AlertTriangle size={20} /> :
                       <User size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-sm ${n.isNew ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{n.desc}</p>
                    </div>
                    {n.isNew && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Избранные товары пользователей</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl text-center shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                <Heart size={40} className="text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Нет данных
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                В данный момент недостаточно статистики по добавлениям в избранное.
              </p>
            </div>
          </div>
        )}

        {/* ADMINS TAB */}
        {activeTab === 'admins' && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Администраторы</h2>
              <button 
                onClick={() => {
                  const newAdmin = window.prompt('Введите логин (email или телефон) нового администратора:');
                  if (newAdmin && newAdmin.trim() !== '') {
                    addAdmin(newAdmin);
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                + Добавить админа
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
              {(admins || []).map((adminId, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl shadow-inner border border-indigo-200 dark:border-indigo-800">
                      {adminId[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{adminId.split('@')[0]}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{adminId} • Admin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-bold border border-green-200 dark:border-green-800/50">Активен</span>
                    <button 
                      onClick={() => {
                        const newAdmin = window.prompt('Изменить логин администратора:', adminId);
                        if (newAdmin && newAdmin.trim() !== '' && newAdmin !== adminId) {
                          editAdmin(adminId, newAdmin);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
                      title="Изменить"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => removeAdmin(adminId)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
