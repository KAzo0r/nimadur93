import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendTelegramMessage } from '../utils/telegram';

export default function Help() {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);

  const handleSupport = async () => {
    const msg = window.prompt(t('support_prompt'));
    if (!msg) return;

    setIsSending(true);
    try {
      await sendTelegramMessage(`🆘 <b>Запрос в техподдержку!</b>\n\nСообщение: <i>${msg}</i>`);
      alert(t('support_success'));
    } catch (e) {
      alert(t('support_error'));
    }
    setIsSending(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">{t('help_title')}</h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('help_q1')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('help_a1')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('help_q2')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('help_a2')}</p>
        </div>

      </div>
      
      <div className="bg-indigo-600 text-white p-8 rounded-3xl text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">{t('still_need_help')}</h2>
        <p className="mb-6 opacity-90 text-white">{t('support_desc')}</p>
        <button 
          onClick={handleSupport}
          disabled={isSending}
          className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {isSending ? t('sending') : t('contact_support')}
        </button>
      </div>
    </div>
  );
}
