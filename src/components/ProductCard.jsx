import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites, reviews } = useStore();
  
  const isFav = favorites.some((p) => p.id === product.id);
  const productReviews = reviews.filter(r => String(r.productId) === String(product.id));
  const averageRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group animate-slide-up flex flex-col h-full cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img 
          src={product.image} 
          alt={typeof product.name === 'object' ? product.name.ru : product.name}
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
            className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors"
            title={typeof product.name === 'object' ? (product.name[i18n.language] || product.name['ru']) : product.name}
          >
            {typeof product.name === 'object' ? (product.name[i18n.language] || product.name['ru']) : product.name}
          </h3>
          <span className="font-bold text-indigo-500 whitespace-nowrap bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
            {product.price.toLocaleString()} UZS
          </span>
        </div>
        {productReviews.length > 0 && (
          <div className="flex items-center gap-1 mb-2 text-yellow-400 text-xs">
            <Star size={12} fill="currentColor" />
            <span className="text-gray-600 dark:text-gray-400 font-medium">{averageRating} ({productReviews.length})</span>
          </div>
        )}
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {typeof product.desc === 'object' ? (product.desc[i18n.language] || product.desc['ru']) : product.desc}
        </p>
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 group/btn mt-auto"
        >
          <ShoppingCart size={18} className="group-hover/btn:-rotate-12 transition-transform" />
          {t('add_to_cart')}
        </button>
      </div>
    </div>
  );
}
