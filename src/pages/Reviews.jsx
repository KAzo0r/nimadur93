import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

const mockReviews = [
  { id: 1, name: "Alex R.", role: "Amateur Astronomer", text: "The James Webb telescope model is incredibly detailed! A perfect centerpiece for my living room.", rating: 5, date: "2 days ago" },
  { id: 2, name: "Sarah M.", role: "Space Enthusiast", text: "Fast shipping to the Moon! The freeze-dried ice cream arrived in perfect condition and tasted exactly like the real thing.", rating: 5, date: "1 week ago" },
  { id: 3, name: "Elon T.", role: "CEO", text: "Good prices on the Martian soil. Used it to test our new rover treads.", rating: 4, date: "3 weeks ago" },
  { id: 4, name: "Maria K.", role: "Cosmonaut", text: "The Orlan suit replica is surprisingly functional. Great for training purposes.", rating: 5, date: "1 month ago" },
];

export default function Reviews() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t('reviews_title')}</h1>
        <p className="text-gray-500 text-lg">{t('reviews_subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockReviews.map(review => (
          <div key={review.id} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700/50">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{review.name}</h3>
                <p className="text-sm text-gray-500">{review.role}</p>
              </div>
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic">"{review.text}"</p>
            <p className="text-xs text-gray-400 mt-6">{review.date}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
          {t('write_review')}
        </button>
      </div>
    </div>
  );
}
