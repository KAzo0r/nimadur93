import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Rocket, Phone, MessageCircle } from 'lucide-react';
import { sendTelegramMessage } from '../utils/telegram';

export default function Login() {
  const { t } = useTranslation();
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [method, setMethod] = useState('phone'); // phone, tg, google
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (inputValue) {
      const inputValLower = inputValue.toLowerCase().trim();
      const isAdmin = 
        (inputValLower === 'admin@gmail.com' && (password === 'admin' || password === 'админ')) ||
        (inputValLower === 'админ@gmail.com' && (password === 'админ' || password === 'admin'));

      const role = isAdmin ? 'admin' : 'user';

      // Send telegram alert
      await sendTelegramMessage(`🔐 <b>Новый вход!</b>\n\nРоль: ${role}\nСпособ: ${method}\nДанные: <code>${inputValue}</code>`);
      
      setUser({ phone: inputValue, role });
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4">
            <Rocket className="text-indigo-500 h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{t('login_to')}</h1>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1 mb-6">
          <button onClick={() => setMethod('phone')} className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${method === 'phone' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>Phone</button>
          <button onClick={() => setMethod('tg')} className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${method === 'tg' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>Telegram</button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {method === 'phone' ? t('phone') : "Telegram ID"}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {method === 'phone' ? <Phone size={20} /> : <MessageCircle size={20} />}
              </div>
              <input 
                type="text" 
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={method === 'phone' ? '+1 234 567 890 / admin@gmail.com' : "Enter Telegram ID (e.g. 123456789)"}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>
          {method === 'phone' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
          )}
          <button 
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/30"
          >
            {t('login')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">{t('or_continue')}</span>
            </div>
          </div>

          <button 
            onClick={async () => {
              const mockEmail = window.prompt("Enter your Google email to simulate login:");
              if (!mockEmail) return;
              
              await sendTelegramMessage(`🔐 <b>Новый вход! (Google)</b>\n\nРоль: user\nEmail: <code>${mockEmail}</code>`);
              setUser({ phone: mockEmail, role: 'user', name: mockEmail.split('@')[0], photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + mockEmail });
              navigate('/');
            }}
            className="mt-6 w-full flex items-center justify-center gap-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium text-gray-900 dark:text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
}
