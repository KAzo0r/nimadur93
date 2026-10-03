import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Trash2, Plus, Minus, CheckCircle, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { sendTelegramMessage, sendTelegramOrder } from '../utils/telegram';
import { formatPrice } from '../utils/currency';

const PICKUP_POINTS = {
  'Ташкент': [
    { id: 'tk1', name: 'Yunusobod', address: 'ул. Амира Темура, 107Б, ТЦ Yunusobod', time: 'Пн–Вс 9:00–21:00' },
    { id: 'tk2', name: 'Чиланзар', address: 'ул. Бунёдкор, 4, ТЦ Compass', time: 'Пн–Вс 9:00–21:00' },
    { id: 'tk3', name: 'Мирзо Улугбек', address: 'ул. Фаробий, 92', time: 'Пн–Вс 9:00–20:00' },
    { id: 'tk4', name: 'Сергели', address: 'ул. Янги Шаҳар, 48', time: 'Пн–Сб 9:00–20:00' },
    { id: 'tk5', name: 'Яккасарай', address: 'пр. Навои, 30, ТЦ Next', time: 'Пн–Вс 9:00–21:00' },
  ],
  'Самарканд': [
    { id: 'sm1', name: 'Центр', address: 'ул. Ислама Каримова, 18', time: 'Пн–Вс 9:00–20:00' },
    { id: 'sm2', name: 'Луначарский', address: 'ул. Ага Нурова, 5', time: 'Пн–Сб 9:00–19:00' },
  ],
  'Бухара': [
    { id: 'bk1', name: 'Центр', address: 'ул. Мухаммада Икбол, 3', time: 'Пн–Вс 9:00–20:00' },
    { id: 'bk2', name: 'Каган', address: 'ул. Навои, 12', time: 'Пн–Сб 9:00–18:00' },
  ],
  'Наманган': [
    { id: 'nm1', name: 'Центр', address: 'ул. Уйчи, 45', time: 'Пн–Вс 9:00–20:00' },
  ],
  'Андижан': [
    { id: 'an1', name: 'Центр', address: 'пр. Алишера Навои, 27', time: 'Пн–Вс 9:00–20:00' },
    { id: 'an2', name: 'Избасканский', address: 'ул. Чўлпон, 8', time: 'Пн–Сб 9:00–19:00' },
  ],
  'Фергана': [
    { id: 'fg1', name: 'Центр', address: 'ул. Мустакиллик, 15', time: 'Пн–Вс 9:00–20:00' },
  ],
  'Карши': [
    { id: 'ks1', name: 'Центр', address: 'ул. Шароф Рашидов, 9', time: 'Пн–Сб 9:00–19:00' },
  ],
  'Нукус': [
    { id: 'nk1', name: 'Центр', address: 'ул. Гагарина, 22', time: 'Пн–Сб 9:00–19:00' },
  ],
};

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, clearCart, updateCartQuantity, addOrder, user } = useStore();
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [appliedPromos, setAppliedPromos] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryCost = deliveryMethod === 'delivery' ? 30000 : 0;
  const total = Math.max(0, subtotal * (1 - discount)) + deliveryCost;

  const applyPromo = () => {
    const p = promo.toLowerCase().trim();
    if (appliedPromos.includes(p)) { alert('Этот промокод уже применён!'); return; }
    let newDiscount = 0;
    if (p === 'first25') { newDiscount = 0.25; alert('Промокод применён: скидка 25%! 🎉'); }
    else if (p === 'space' || p === 'mars' || p === 'nasa') { newDiscount = 0.1; alert('Промокод применён: скидка 10%! 🚀'); }
    else if (p === 'admin') { newDiscount = 0.5; alert('Секретный код: скидка 50%! 👑'); }
    else { alert(t('invalid_promo')); return; }
    setAppliedPromos([...appliedPromos, p]);
    setDiscount(prev => Math.min(1, prev + newDiscount));
    setPromo('');
  };

  const handleCheckout = async () => {
    if (deliveryMethod === 'pickup' && !selectedPoint) {
      alert('Пожалуйста, выберите пункт выдачи!');
      return;
    }
    setIsCheckingOut(true);
    const pickupInfo = selectedPoint ? `${selectedCity} — ${selectedPoint.name}, ${selectedPoint.address}` : '';
    let orderText = `🛒 <b>Новый заказ!</b>\n\n`;
    cart.forEach((item, i) => {
      orderText += `${i + 1}. ${item.name['ru'] || item.name} — ${item.qty} шт. × ${formatPrice(item.price, i18n.language)}\n`;
    });
    orderText += `\n<b>Оплата:</b> ${paymentMethod === 'card' ? '💳 Карта' : '💵 Наличные'}\n`;
    orderText += `<b>Доставка:</b> ${deliveryMethod === 'delivery' ? `🚚 До двери (+${formatPrice(30000, i18n.language)})` : `📦 Пункт выдачи — ${pickupInfo}`}\n`;
    orderText += `<b>Скидка:</b> ${Math.round(discount * 100)}%\n`;
    orderText += `<b>Итого:</b> ${formatPrice(total, i18n.language)}`;

    const images = cart.map(item => item.image).filter(Boolean);
    await sendTelegramOrder(orderText, images);

    addOrder({
      cart,
      total,
      discount,
      paymentMethod,
      deliveryMethod,
      pickupPoint: selectedPoint ? { city: selectedCity, ...selectedPoint } : null,
      userName: user ? user.name || user.email || 'Покупатель' : 'Гость',
    });

    setIsCheckingOut(false);
    setShowSuccessModal(true);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('empty_cart')}</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('cart')}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
              <img src={item.image} alt={item.name.ru} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">{item.name[i18n.language] || item.name['ru']}</h3>
                <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                  <p className="text-indigo-500 font-bold">{formatPrice(item.price, i18n.language)}</p>
                  {item.discount && (
                    <>
                      <span className="text-xs text-gray-400 line-through decoration-red-500/50">
                        {formatPrice(Math.round(item.price / (1 - item.discount / 100)), i18n.language)}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-500 text-white rounded-md">
                        -{item.discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateCartQuantity(item.id, item.qty - 1)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white">
                  <Minus size={16} />
                </button>
                <span className="font-bold w-6 text-center text-gray-900 dark:text-white">{item.qty}</span>
                <button onClick={() => updateCartQuantity(item.id, item.qty + 1)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white">
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button onClick={clearCart} className="text-red-500 font-medium hover:underline px-2">
            Очистить корзину
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[420px] bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg h-fit space-y-5 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('total')}</h2>

          {/* Price breakdown */}
          <div className="space-y-2 text-base">
            <div className="flex justify-between">
              <span className="text-gray-500">Подытог:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatPrice(subtotal, i18n.language)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-500 font-medium">
                <span>Скидка -{Math.round(discount * 100)}%:</span>
                <span>-{formatPrice(Math.round(subtotal * discount), i18n.language)}</span>
              </div>
            )}
            {deliveryMethod === 'delivery' && (
              <div className="flex justify-between text-gray-500">
                <span>Доставка:</span>
                <span>+{formatPrice(30000, i18n.language)}</span>
              </div>
            )}
            {deliveryMethod === 'pickup' && (
              <div className="flex justify-between text-green-500 font-medium">
                <span>Самовывоз:</span>
                <span>Бесплатно</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white">{t('total')}:</span>
              <span className="text-indigo-500">{formatPrice(total, i18n.language)}</span>
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Способ получения</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setDeliveryMethod('delivery'); setSelectedPoint(null); setSelectedCity(''); }}
                className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${deliveryMethod === 'delivery' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300 shadow-sm' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                🚚 Курьер до двери
              </button>
              <button
                onClick={() => setDeliveryMethod('pickup')}
                className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${deliveryMethod === 'pickup' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300 shadow-sm' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                📦 Пункт выдачи
              </button>
            </div>
          </div>

          {/* Pickup Point Selector */}
          {deliveryMethod === 'pickup' && (
            <div className="space-y-3 animate-fade-in">
              {/* City Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin size={14} className="inline mr-1 text-indigo-500" />
                  Выберите город
                </label>
                <div className="relative">
                  <button
                    onClick={() => setCityOpen(!cityOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white hover:border-indigo-400 transition-colors"
                  >
                    <span>{selectedCity || 'Выберите город...'}</span>
                    <ChevronDown size={16} className={`transition-transform ${cityOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {cityOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-up">
                      {Object.keys(PICKUP_POINTS).map(city => (
                        <button
                          key={city}
                          onClick={() => { setSelectedCity(city); setSelectedPoint(null); setCityOpen(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-left ${selectedCity === city ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 font-semibold' : 'text-gray-900 dark:text-gray-300'}`}
                        >
                          <span>📍 {city}</span>
                          <span className="text-xs text-gray-400">{PICKUP_POINTS[city].length} пункта</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Points in city */}
              {selectedCity && (
                <div className="space-y-2 animate-fade-in">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Пункты выдачи — {selectedCity}
                  </label>
                  {PICKUP_POINTS[selectedCity].map(point => (
                    <button
                      key={point.id}
                      onClick={() => setSelectedPoint(point)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedPoint?.id === point.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-indigo-300'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`font-bold text-sm ${selectedPoint?.id === point.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                            📦 {point.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{point.address}</p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">🕐 {point.time}</p>
                        </div>
                        {selectedPoint?.id === point.id && (
                          <div className="shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedPoint && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium animate-fade-in">
                  <CheckCircle size={16} />
                  Выбран: {selectedCity}, {selectedPoint.name}
                </div>
              )}
            </div>
          )}

          {/* Address input for delivery */}
          {deliveryMethod === 'delivery' && (
            <div className="animate-fade-in">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Адрес доставки</label>
              <textarea
                placeholder="Город, улица, дом, квартира..."
                rows={2}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors resize-none text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Способ оплаты</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPaymentMethod('card')} className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${paymentMethod === 'card' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300 shadow-sm' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                💳 Карта
              </button>
              <button onClick={() => setPaymentMethod('cash')} className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${paymentMethod === 'cash' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300 shadow-sm' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                💵 Наличные
              </button>
            </div>
            {paymentMethod === 'card' && (
              <div className="mt-3 space-y-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700/50 animate-fade-in">
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white dark:bg-gray-800 px-3 py-2 rounded-lg outline-none border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:border-indigo-500 transition-colors" />
                <input type="text" placeholder="Имя на карте (IVAN IVANOV)" className="w-full bg-white dark:bg-gray-800 px-3 py-2 rounded-lg outline-none border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:border-indigo-500 transition-colors" />
                <div className="flex gap-2">
                  <input type="text" placeholder="ММ/ГГ" className="w-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg outline-none border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:border-indigo-500 transition-colors" />
                  <input type="text" placeholder="CVV" maxLength="3" className="w-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg outline-none border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:border-indigo-500 transition-colors" />
                </div>
              </div>
            )}
          </div>

          {/* Promo Banner */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
            <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium text-center">
              🎉 Первый заказ? Промокод <b className="bg-indigo-200 dark:bg-indigo-800 px-1 rounded">FIRST25</b> — скидка 25%!
            </p>
          </div>

          {/* Promo input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('promocode')}
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
              className="flex-1 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-xl outline-none text-gray-900 dark:text-white border border-transparent focus:border-indigo-500 transition-colors text-sm"
            />
            <button onClick={applyPromo} className="px-5 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium text-sm">
              {t('apply')}
            </button>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isCheckingOut ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95'}`}
          >
            {isCheckingOut ? t('checking_out') : t('checkout')}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center transform animate-slide-up border border-gray-100 dark:border-gray-700/50">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-green-500 w-12 h-12 animate-[bounce_1s_ease-in-out_infinite]" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Заказ оформлен!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Спасибо за покупку! 🎉</p>
            {deliveryMethod === 'pickup' && selectedPoint && (
              <div className="my-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                <MapPin size={14} className="inline mr-1" />
                Ваш пункт выдачи:<br />
                <b>{selectedCity}, {selectedPoint.name}</b><br />
                <span className="text-xs text-gray-500">{selectedPoint.address}</span>
              </div>
            )}
            <button
              onClick={() => { setShowSuccessModal(false); clearCart(); }}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
