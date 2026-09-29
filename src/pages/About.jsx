import { useTranslation } from 'react-i18next';
import { Rocket, ShieldCheck, Globe } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto py-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">{t('about_title')}</h1>
        <p className="text-xl text-gray-500">{t('about_subtitle')}</p>
      </div>

      <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80" alt="Earth from space" className="w-full h-80 object-cover rounded-3xl shadow-xl" />

      <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-700 dark:text-gray-300">
        <p>{t('about_p1')}</p>
        <p>{t('about_p2')}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="text-3xl font-bold text-indigo-500 mb-2">1M+</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{t('orders_delivered')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="text-3xl font-bold text-purple-500 mb-2">8</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{t('planets_served')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="text-3xl font-bold text-blue-500 mb-2">100%</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{t('authenticity')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{t('mission_support')}</div>
        </div>
      </div>
    </div>
  );
}
