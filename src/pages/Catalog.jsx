import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function Catalog() {
  const { t, i18n } = useTranslation();
  const { products } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name');

  const safeProducts = Array.isArray(products) ? products : [];
  
  const getProductName = (p) => {
    if (!p || !p.name) return '';
    if (typeof p.name === 'string') return p.name;
    return p.name[i18n.language] || p.name['ru'] || '';
  };

  let filtered = safeProducts.filter(p => {
    if (!p) return false;
    const nameStr = getProductName(p);
    const matchesSearch = nameStr.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  filtered.sort((a, b) => {
    if (sort === 'price_asc') return (a.price || 0) - (b.price || 0);
    if (sort === 'price_desc') return (b.price || 0) - (a.price || 0);
    const nameA = getProductName(a);
    const nameB = getProductName(b);
    return nameA.localeCompare(nameB);
  });

  // Extract unique categories from actual products
  const categories = ['all', ...new Set(safeProducts.map(p => p && p.category).filter(Boolean))];

  return (
    <div className="space-y-8 animate-fade-in py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('catalog')}</h1>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder={t('search')} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 md:w-auto bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-xl outline-none capitalize text-gray-900 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="text-gray-900 bg-white dark:text-white dark:bg-gray-900">
                {cat === 'all' ? t('all') : cat}
              </option>
            ))}
          </select>
          
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 md:w-auto bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-xl outline-none text-gray-900 dark:text-white"
          >
            <option value="name" className="text-gray-900 bg-white dark:text-white dark:bg-gray-900">{t('sort_by')}: {t('name')}</option>
            <option value="price_asc" className="text-gray-900 bg-white dark:text-white dark:bg-gray-900">{t('sort_by')}: {t('price')} (Low-High)</option>
            <option value="price_desc" className="text-gray-900 bg-white dark:text-white dark:bg-gray-900">{t('sort_by')}: {t('price')} (High-Low)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500 text-lg">
          No items found in this galaxy.
        </div>
      )}
    </div>
  );
}
