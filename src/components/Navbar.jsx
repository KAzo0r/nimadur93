import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { ShoppingCart, Heart, User, Sun, Moon, Rocket } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { cart, favorites, user, theme, setTheme } = useStore();

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="bg-white/60 dark:bg-black/20 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary dark:text-primary-dark shrink-0">
            <Rocket className="h-8 w-8 text-indigo-500" />
            <span className="hidden lg:block text-gray-900 dark:text-white">{t('space_shop')}</span>
          </Link>
          
          <div className="flex items-center gap-4 sm:gap-6 ml-auto">
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link to="/catalog" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors">{t('catalog')}</Link>
              <Link to="/explore" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors">{t('explore')}</Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors">{t('about')}</Link>
              <Link to="/reviews" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors">{t('reviews')}</Link>
              <Link to="/help" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors">{t('help')}</Link>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <select 
                value={i18n.language} 
                onChange={changeLanguage}
                className="bg-transparent text-gray-700 dark:text-gray-300 text-sm font-medium focus:outline-none border border-gray-300 dark:border-gray-700 rounded-md px-1 py-1"
              >
                <option value="uz" className="text-gray-900 bg-white dark:text-white dark:bg-gray-900">UZ</option>
                <option value="ru" className="text-gray-900 bg-white dark:text-white dark:bg-gray-900">RU</option>
                <option value="en" className="text-gray-900 bg-white dark:text-white dark:bg-gray-900">EN</option>
              </select>

              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link to="/favorites" className="relative p-1 text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition">
                <Heart size={24} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-1 text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to={user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login'} className="p-1 text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition">
                {user && user.photo ? (
                  <img src={user.photo} alt="avatar" className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600" />
                ) : (
                  <User size={24} />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
