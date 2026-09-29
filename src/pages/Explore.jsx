import { useTranslation } from 'react-i18next';

export default function Explore() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in h-[80vh] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('explore_title')}</h1>
        <p className="text-gray-500">{t('explore_desc')}</p>
      </div>
      
      <div className="flex-1 w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-black">
        <iframe 
          src="https://eyes.nasa.gov/apps/solar-system/#/home" 
          className="w-full h-full border-0 transition-opacity duration-500"
          title="NASA Eyes on the Solar System"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
