import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface-color border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-gray-500 font-medium">© 2026 {useStore().shopName || t('space_shop')}.</p>
        </div>
        <div className="flex gap-4">
          <a href="https://github.com/KAzo0r" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors">GitHub</a>
          <a href="https://t.me/HSx_007" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors">Telegram</a>
        </div>
      </div>
    </footer>
  );
}
