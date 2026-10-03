import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Rocket, Phone, ShieldCheck } from 'lucide-react';
import { sendTelegramMessage } from '../utils/telegram';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const { t } = useTranslation();
  const { setUser, admins } = useStore();
  const navigate = useNavigate();
  
  const [method, setMethod] = useState('google'); // google, phone, email
  const [step, setStep] = useState(1); // 1 - enter phone, 2 - enter code
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (phone) {
      // Admin phone backdoor
      const inputValLower = phone.toLowerCase().trim();
      if (inputValLower === 'admin' || inputValLower === 'админ' || admins.includes(inputValLower)) {
         setGeneratedCode('0000');
         setStep(2);
         return;
      }

      // Create a 4-digit code
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(newCode);
      
      // Send code to telegram
      await sendTelegramMessage(`🔐 <b>Запрос кода авторизации!</b>\n\nНомер: <code>${phone}</code>\nКод подтверждения: <b>${newCode}</b>`);
      
      setStep(2);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    // Admin backdoor
    const inputValLower = phone.toLowerCase().trim();
    const isAdminBackdoor = 
      (inputValLower === 'admin' || inputValLower === 'админ' || admins.includes(inputValLower));

    if (code === generatedCode || (isAdminBackdoor && code === '0000')) {
      const role = isAdminBackdoor ? 'admin' : 'user';
      await sendTelegramMessage(`✅ <b>Успешный вход!</b>\n\nРоль: ${role}\nНомер: <code>${phone}</code>`);
      setUser({ phone, role, name: phone });
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      alert("Неверный код!");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const inputValLower = email.toLowerCase().trim();
    if ((inputValLower === 'admin@gmail.com' || admins.includes(inputValLower)) && password === 'admin') {
      const role = 'admin';
      await sendTelegramMessage(`✅ <b>Успешный вход!</b>\n\nРоль: admin\nEmail: <code>${email}</code>`);
      setUser({ phone: email, role, name: email.split('@')[0] });
      navigate('/admin');
    } else if (email && password) {
      const role = 'user';
      await sendTelegramMessage(`✅ <b>Успешный вход!</b>\n\nРоль: user\nEmail: <code>${email}</code>`);
      setUser({ phone: email, role, name: email.split('@')[0] });
      navigate('/');
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
        
        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1 mb-8">
          <button 
            onClick={() => { setMethod('google'); setStep(1); }} 
            className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${method === 'google' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Google
          </button>
          <button 
            onClick={() => { setMethod('email'); setStep(1); }} 
            className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${method === 'email' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Email
          </button>
          <button 
            onClick={() => setMethod('phone')} 
            className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${method === 'phone' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            По номеру
          </button>
        </div>

        {method === 'google' && (
          <div className="flex flex-col items-center space-y-6 pb-4">
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-2">
              Войдите с помощью аккаунта Google в один клик.
            </p>
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const decoded = jwtDecode(credentialResponse.credential);
                    const email = decoded.email;
                    const name = decoded.name;
                    const photo = decoded.picture;
                    
                    await sendTelegramMessage(`🔐 <b>Новый вход! (Google)</b>\n\nРоль: user\nИмя: ${name}\nEmail: <code>${email}</code>`);
                    setUser({ phone: email, role: 'user', name, photo });
                    navigate('/');
                  } catch (error) {
                    console.error("Google Login Error", error);
                  }
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
                shape="pill"
                size="large"
                theme="outline"
              />
            </div>
          </div>
        )}
        
        {method === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пароль
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95"
            >
              Войти
            </button>
          </form>
        )}
        
        {method === 'phone' && (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendCode} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('phone')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={20} />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95"
                >
                  Получить код
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Код из Telegram
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <ShieldCheck size={20} />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Введите 4 цифры"
                      maxLength="4"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-bold tracking-widest text-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Код был отправлен в Telegram.
                  </p>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 active:scale-95"
                >
                  Войти
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
                >
                  Изменить номер
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
