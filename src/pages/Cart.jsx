import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { sendTelegramMessage } from '../utils/telegram';

export default function Cart() {
  const { t } = useTranslation();
  const { cart, removeFromCart, clearCart, updateCartQuantity } = useStore();
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');

  const [appliedPromos, setAppliedPromos] = useState([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = Math.max(0, subtotal * (1 - discount));

  const applyPromo = () => {
    const p = promo.toLowerCase().trim();
    
    if (appliedPromos.includes(p)) {
      alert('Этот промокод уже применен!');
      return;
    }

    let newDiscount = 0;
    if (p === 'first25') {
      newDiscount = 0.25;
      alert('Promo code applied: 25% discount for first order! 🎉');
    } else if (p === 'space' || p === 'mars' || p === 'nasa') {
      newDiscount = 0.1;
      alert('Promo code applied: 10% discount! 🚀');
    } else if (p === 'admin') {
      newDiscount = 0.5;
      alert('Admin secret code applied: 50% discount! 👑');
    } else {
      alert(t('invalid_promo'));
      return;
    }

    setAppliedPromos([...appliedPromos, p]);
    setDiscount(prev => Math.min(1, prev + newDiscount));
    setPromo('');
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    let orderText = `🚀 <b>Новый заказ из SpaceShop!</b>\n\n`;
    cart.forEach((item, index) => {
      orderText += `${index + 1}. ${item.name} - ${item.qty} шт. x ${item.price.toLocaleString()} UZS\n`;
    });
    orderText += `\n<b>Способ оплаты:</b> ${paymentMethod === 'card' ? '💳 Карта' : '💵 Наличные'}\n`;
    orderText += `<b>Способ доставки:</b> ${deliveryMethod === 'delivery' ? '🚚 До двери' : '📦 Пункт выдачи'}\n`;
    orderText += `<b>Скидка:</b> ${Math.round(discount * 100)}%\n`;
    orderText += `<b>Итого к оплате:</b> ${total.toLocaleString()} UZS`;

    await sendTelegramMessage(orderText);
    
    setIsCheckingOut(false);
    setShowSuccessModal(true);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
        <div className="text-6xl mb-4">🪐</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('empty_cart')}</h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('cart')}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">{item.name}</h3>
                <p className="text-indigo-500 font-medium">{item.price.toLocaleString()} UZS</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateCartQuantity(item.id, item.qty - 1)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold w-6 text-center text-gray-900 dark:text-white">{item.qty}</span>
                <button 
                  onClick={() => updateCartQuantity(item.id, item.qty + 1)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            className="text-red-500 font-medium hover:underline px-2"
          >
            Clear Cart
          </button>
        </div>
        
        <div className="lg:w-96 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg h-fit space-y-6 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('total')}</h2>
          
          <div className="space-y-2 text-lg">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-white">{subtotal.toLocaleString()} UZS</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount:</span>
                <span>-{Math.round(discount * 100)}%</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white">{t('total')}:</span>
              <span className="text-indigo-500">{total.toLocaleString()} UZS</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Способ доставки (Delivery)</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-colors ${deliveryMethod === 'delivery' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  🚚 До двери
                </button>
                <button 
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-colors ${deliveryMethod === 'pickup' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  📦 Пункт выдачи
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Способ оплаты (Payment)</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-colors ${paymentMethod === 'card' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  💳 Карта
                </button>
                <button 
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-colors ${paymentMethod === 'cash' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  💵 Наличные
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700/50 animate-fade-in">
                  <input type="text" placeholder="Номер карты (0000 0000 0000 0000)" className="w-full bg-white dark:bg-gray-800 px-3 py-2 rounded-lg outline-none border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:border-indigo-500 transition-colors" />
                  <input type="text" placeholder="Имя на карте (IVAN IVANOV)" className="w-full bg-white dark:bg-gray-800 px-3 py-2 rounded-lg outline-none border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:border-indigo-500 transition-colors" />
                  <div className="flex gap-3">
                    <input type="text" placeholder="ММ/ГГ" className="w-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg outline-none border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:border-indigo-500 transition-colors" />
                    <input type="text" placeholder="CVV" maxLength="3" className="w-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg outline-none border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
            <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium text-center">
              🎉 Первый заказ? Используйте промокод <b className="bg-indigo-200 dark:bg-indigo-800 px-1 rounded">FIRST25</b> для скидки 25%!
            </p>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={t('promocode')}
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-gray-900 px-4 py-3 rounded-xl outline-none text-gray-900 dark:text-white border border-transparent focus:border-indigo-500 transition-colors"
            />
            <button 
              onClick={applyPromo}
              className="px-6 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium"
            >
              {t('apply')}
            </button>
          </div>
          
          <button 
            onClick={handleCheckout} 
            disabled={isCheckingOut}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-transform ${isCheckingOut ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]'}`}
          >
            {isCheckingOut ? t('checking_out') : t('checkout')}
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center transform animate-slide-up border border-gray-100 dark:border-gray-700/50">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-green-500 w-12 h-12 animate-[bounce_1s_ease-in-out_infinite]" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Оплачено!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Ваш заказ успешно оформлен. Спасибо за покупку!</p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                clearCart();
              }} 
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
