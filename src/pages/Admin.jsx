import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, BarChart2, Package, Users, Settings, Bell, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const mockData = [
  { name: 'Mon', sales: 4000, visits: 2400 },
  { name: 'Tue', sales: 3000, visits: 1398 },
  { name: 'Wed', sales: 2000, visits: 9800 },
  { name: 'Thu', sales: 2780, visits: 3908 },
  { name: 'Fri', sales: 1890, visits: 4800 },
  { name: 'Sat', sales: 2390, visits: 3800 },
  { name: 'Sun', sales: 3490, visits: 4300 },
];

export default function Admin() {
  const { t } = useTranslation();
  const { user, setUser, products, setProducts } = useStore();
  const navigate = useNavigate();
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', category: 'Телескопы', image: '', desc: '' });
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...form, id: editingId, price: Number(form.price) } : p));
      setEditingId(null);
    } else {
      setProducts([...products, { ...form, id: Date.now(), price: Number(form.price) }]);
    }
    setForm({ name: '', price: '', category: 'Телескопы', image: '', desc: '' });
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm(p);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] gap-6 animate-fade-in">
      
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
            A
          </div>
          <div>
            <h2 className="font-bold text-xl leading-tight text-gray-900 dark:text-white">Admin Pro</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all ${activeTab === 'stats' ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
            <BarChart2 size={22} className={activeTab === 'stats' ? 'text-indigo-600 dark:text-indigo-400' : ''} />
            Overview
          </button>
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all ${activeTab === 'products' ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
            <Package size={22} className={activeTab === 'products' ? 'text-indigo-600 dark:text-indigo-400' : ''} />
            Products
          </button>
          <button className="flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 opacity-50 cursor-not-allowed">
            <Users size={22} />
            Customers
          </button>
          <button className="flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 opacity-50 cursor-not-allowed">
            <Settings size={22} />
            Settings
          </button>
        </div>

        <button 
          onClick={() => setUser(null)}
          className="flex items-center justify-center gap-3 px-5 py-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors mt-auto font-bold"
        >
          <LogOut size={20} />
          {t('logout')}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        
        {/* Top Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search here..." className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-indigo-500 transition-colors" />
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
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

        {/* Tab Content */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Cards */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-lg text-white">
                <p className="text-indigo-100 font-medium mb-1">Total Revenue</p>
                <h3 className="text-4xl font-bold mb-4">$24,590</h3>
                <div className="text-sm bg-white/20 inline-block px-3 py-1 rounded-lg backdrop-blur-sm">+12.5% from last month</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Active Users</p>
                <h3 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">1,432</h3>
                <div className="text-sm text-green-500 bg-green-50 dark:bg-green-900/20 inline-block px-3 py-1 rounded-lg">+5.2% from last month</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50">
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Total Orders</p>
                <h3 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">845</h3>
                <div className="text-sm text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 inline-block px-3 py-1 rounded-lg">+18.1% from last month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Sales Overview</h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '12px' }} />
                      <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Website Visits</h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 8}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up">
            <div className="xl:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700/50 h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingId ? t('edit_product') : t('add_product')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder={t('name')} required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors" />
                <input type="number" placeholder={t('price')} required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors" />
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white">
                  <option value="Телескопы">Телескопы</option>
                  <option value="Снаряжение">Снаряжение</option>
                  <option value="Артефакты">Артефакты</option>
                  <option value="Питание">Питание</option>
                  <option value="Путешествия">Путешествия</option>
                  <option value="Техника">Техника</option>
                </select>
                <input type="url" placeholder={t('image')} required value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-colors" />
                <textarea placeholder={t('description')} required value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 h-24 resize-none transition-colors"></textarea>
                
                <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                  {t('save')}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setForm({ name: '', price: '', category: 'Телескопы', image: '', desc: '' })}} className="w-full py-3.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-bold transition-colors mt-2 text-gray-900 dark:text-white">
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div className="xl:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Products</h2>
              <div className="grid gap-4">
                {products.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-5 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group" style={{ animationDelay: `${i * 50}ms` }}>
                    <img src={p.image} className="w-20 h-20 object-cover rounded-2xl" alt={p.name} />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">{p.name}</h3>
                      <p className="text-sm font-medium text-indigo-500">{p.price.toLocaleString()} UZS <span className="text-gray-400 dark:text-gray-500 px-2">•</span> {p.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="p-3 text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors"><Edit2 size={20} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
