import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

export default function Favorites() {
  const { t } = useTranslation();
  const { favorites } = useStore();

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold">{t('favorites')}</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No favorites yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
