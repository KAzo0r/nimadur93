import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { ShoppingCart, Heart, ArrowLeft, Star, Truck, ShieldCheck, Zap } from 'lucide-react';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { products, addToCart, cart, toggleFavorite, favorites, reviews } = useStore();
  
  const product = products.find(p => String(p.id) === String(id));
  const productReviews = reviews.filter(r => String(r.productId) === String(id));
  const avgRating = productReviews.length 
    ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1)
    : 0;

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Товар не найден</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-500 hover:underline">Вернуться назад</button>
      </div>
    );
  }

  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()) : [];
  const isFavorite = favorites.some(p => p.id === product.id);
  const inCart = cart.some(p => p.id === product.id);

  return (
    <div className="animate-fade-in pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 mb-6 transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium">Назад</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-[400px]">
            <img src={product.image} alt={product.name.ru} className="max-w-full max-h-[500px] object-contain rounded-2xl mix-blend-multiply dark:mix-blend-normal" />
            <button 
              onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 ${isFavorite ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500'}`}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider">{product.category}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider">{product.brand}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{product.name[i18n.language] || product.name['ru']}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star size={16} fill="currentColor" />
                  {avgRating > 0 ? avgRating : 'Нет оценок'}
                </div>
                <span className="text-gray-400">·</span>
                <button onClick={() => navigate('/reviews')} className="text-indigo-500 hover:underline">
                  {productReviews.length} отзывов
                </button>
                <span className="text-gray-400">·</span>
                <span className={product.stock > 0 ? "text-green-500" : "text-red-500"}>
                  {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{product.desc[i18n.language] || product.desc['ru']}</p>

            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
              {product.price.toLocaleString()} UZS
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Цвет:</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${selectedColor === c ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Размер:</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center ${selectedSize === s ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-4">
              <button 
                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  product.stock === 0 
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : inCart 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 hover:scale-[1.02] active:scale-95' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95'
                }`}
              >
                <ShoppingCart size={24} />
                {product.stock === 0 ? 'Нет в наличии' : inCart ? 'В корзине (+1)' : 'В корзину'}
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-500">
                  <Truck size={20} />
                </div>
                <span>Быстрая доставка</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-500">
                  <ShieldCheck size={20} />
                </div>
                <span>Гарантия возврата</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
