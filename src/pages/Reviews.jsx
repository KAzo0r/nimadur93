import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Send, MessageSquare, ThumbsUp } from 'lucide-react';
import { useStore } from '../store';

export default function Reviews() {
  const { t } = useTranslation();
  const { reviews, addReview, user, products } = useStore();

  const [form, setForm] = useState({ productId: '', text: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    addReview(form.productId || null, {
      text: form.text,
      rating: form.rating,
      userName: user ? user.name || user.email || 'Покупатель' : 'Гость',
    });
    setForm({ productId: '', text: '', rating: 5 });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-10 animate-fade-in py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">
          {t('reviews_title') || 'Отзывы покупателей'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
          {t('reviews_subtitle') || 'Оставьте свой честный отзыв и помогите другим покупателям'}
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
        <div className="text-center">
          <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400">{avgRating}</div>
          <div className="flex justify-center gap-1 mt-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill={i < Math.round(Number(avgRating)) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <p className="text-gray-500 mt-2 text-sm">Средняя оценка</p>
        </div>
        <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
        <div className="text-center">
          <div className="text-6xl font-black text-gray-900 dark:text-white">{reviews.length}</div>
          <p className="text-gray-500 mt-2 text-sm">Всего отзывов</p>
        </div>
        <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
        <div className="text-center">
          <div className="text-6xl font-black text-green-500">{reviews.filter(r => r.rating >= 4).length}</div>
          <p className="text-gray-500 mt-2 text-sm">Положительных</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Write Review Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-7 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={20} className="text-indigo-500" />
              Написать отзыв
            </h2>

            {submitted && (
              <div className="mb-5 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-green-700 dark:text-green-400 font-semibold flex items-center gap-2 animate-fade-in">
                <ThumbsUp size={18} /> Спасибо за ваш отзыв!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Товар (необязательно)
                </label>
                <select
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white"
                >
                  <option value="">— Общий отзыв о магазине —</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Оценка
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setForm({ ...form, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-125 active:scale-95"
                    >
                      <Star
                        size={32}
                        fill={(hoverRating || form.rating) >= star ? '#facc15' : 'none'}
                        className={(hoverRating || form.rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                      />
                    </button>
                  ))}
                  <span className="ml-2 self-center text-sm text-gray-500">
                    {['', 'Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично!'][hoverRating || form.rating]}
                  </span>
                </div>
              </div>

              {/* Author name override if not logged in */}
              {!user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    placeholder="Иван И."
                    value={form.authorName || ''}
                    onChange={e => setForm({ ...form, authorName: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors text-gray-900 dark:text-white"
                  />
                </div>
              )}

              {/* Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ваш отзыв <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.text}
                  onChange={e => setForm({ ...form, text: e.target.value })}
                  placeholder="Расскажите о своём опыте покупки: качество товара, скорость доставки, упаковка..."
                  required
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors resize-none h-28 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Опубликовать отзыв
              </button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {reviews.length > 0 ? `${reviews.length} отзывов` : 'Отзывов пока нет'}
          </h2>

          {reviews.length === 0 && (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl border border-gray-100 dark:border-gray-700/50 text-center text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Станьте первым, кто оставит отзыв!</p>
              <p className="text-sm mt-1">Ваш опыт поможет другим покупателям.</p>
            </div>
          )}

          {[...reviews].reverse().map(review => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700/50 animate-slide-up"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.userName?.[0]?.toUpperCase() || 'П'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{review.userName}</h3>
                    {review.productId && (
                      <p className="text-xs text-indigo-500">
                        {products.find(p => String(p.id) === String(review.productId))?.name || `Товар #${review.productId}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-gray-300 dark:text-gray-600'} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
