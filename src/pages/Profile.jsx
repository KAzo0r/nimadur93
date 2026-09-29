import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Save, Camera } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();
  const { user, setUser, updateUserProfile } = useStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name || '');
      setPhoto(user.photo || '');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({ name, photo });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <User className="text-indigo-500" size={32} />
            My Profile
          </h1>
          <button 
            onClick={() => setUser(null)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 border-4 border-indigo-100 dark:border-indigo-900/30">
                {photo ? (
                  <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={48} />
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 dark:text-white text-lg">{user.name || 'Astronaut'}</p>
              <p className="text-sm text-gray-500">{user.role === 'admin' ? 'Administrator' : 'Explorer'}</p>
              <p className="text-xs text-gray-400 mt-1">{user.phone}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex-1 w-full space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photo URL</label>
              <input 
                type="url" 
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-2">Paste a direct link to an image to update your avatar.</p>
            </div>
            
            <button 
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center gap-2"
            >
              <Save size={20} />
              {saved ? 'Saved Successfully!' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
