import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { Rocket, Star } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const { products } = useStore();
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-20 animate-fade-in overflow-hidden">
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-12 md:p-24 text-center group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-[10s]"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-indigo-300 opacity-50 animate-pulse-slow">
          <Star size={40} />
        </div>
        <div className="absolute bottom-20 right-10 text-purple-300 opacity-40 animate-spin-slow">
          <Star size={30} />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="animate-float">
            <Rocket className="h-20 w-20 mb-8 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 animate-slide-up" style={{animationDelay: '0.1s'}}>
            {t('welcome')}
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl animate-slide-up" style={{animationDelay: '0.2s'}}>
            {t('welcome_desc')}
          </p>
          <Link to="/catalog" className="px-10 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-full font-bold text-lg transition-all animate-glow hover:scale-105 active:scale-95 inline-block text-white">
            {t('catalog')}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-3 text-gray-900 dark:text-white">
          <Star className="text-yellow-400 animate-pulse" />
          {t('featured_catalog')}
          <Star className="text-yellow-400 animate-pulse" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((p, index) => (
            <div key={p.id} style={{animationDelay: `${index * 0.15}s`}} className="animate-slide-up">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-full font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1">
            {t('all')}
            <Rocket size={18} className="rotate-45" />
          </Link>
        </div>
      </section>
      
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl transition-shadow duration-500 animate-slide-up" style={{animationDelay: '0.3s'}}>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">{t('location')}</h2>
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-inner">
          <iframe 
            src="https://maps.google.com/maps?q=Malika%20Bazaar,%20Tashkent&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="filter dark:invert-[0.9] dark:hue-rotate-180 transition-all duration-500"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
