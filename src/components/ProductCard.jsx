import { useState } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const { addToCart, toggleFavorite, favorites } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isFav = favorites.some((p) => p.id === product.id);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group animate-slide-up flex flex-col h-full">
        <div 
          className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer" 
          onClick={() => setIsModalOpen(true)}
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors hover:scale-110 active:scale-95 z-10"
          >
            <Heart size={20} className={`transition-all duration-300 ${isFav ? "fill-red-500 text-red-500 scale-110" : "text-gray-700 dark:text-gray-300"}`} />
          </button>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 
              onClick={() => setIsModalOpen(true)} 
              className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 dark:text-white cursor-pointer group-hover:text-indigo-500 transition-colors"
              title={product.name}
            >
              {product.name}
            </h3>
            <span className="font-bold text-indigo-500 whitespace-nowrap bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
              {product.price.toLocaleString()} UZS
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{product.desc}</p>
          <button 
            onClick={() => addToCart(product)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 group/btn mt-auto"
          >
            <ShoppingCart size={18} className="group-hover/btn:-rotate-12 transition-transform" />
            {t('add_to_cart')}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row animate-slide-up relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X size={24} className="text-gray-900 dark:text-white" />
            </button>
            
            <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[300px] relative">
              <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
              <button 
                onClick={() => toggleFavorite(product)}
                className="absolute top-4 left-4 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
              >
                <Heart size={24} className={isFav ? "fill-red-500 text-red-500" : "text-gray-700 dark:text-gray-300"} />
              </button>
            </div>
            
            <div className="flex-1 p-6 md:p-8 flex flex-col">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                {product.name}
              </h2>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-6">
                {product.price.toLocaleString()} <span className="text-xl text-gray-500">UZS</span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl mb-8 flex-grow">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-wider">Описание:</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.desc}
                </p>
              </div>
              
              <button 
                onClick={() => { addToCart(product); setIsModalOpen(false); }} 
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-3 mt-auto"
              >
                <ShoppingCart size={24} />
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
