import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Music } from 'lucide-react';

const languages = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ru', name: 'Русский' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pt-BR', name: 'Português' },
  { code: 'id', name: 'Bahasa' },
];

export const Navbar = () => {
  const { t, i18n } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 md:h-16 bg-[#1428A0] text-white flex items-center justify-between px-4 md:px-6 z-50 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="bg-white p-1 md:p-1.5 rounded-lg">
          <Music className="w-5 h-5 md:w-6 h-6 text-[#1428A0]" />
        </div>
        <span className="text-lg md:text-xl font-bold tracking-tight">MelodyAI</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors border border-white/20">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{t('language')}</span>
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  i18n.language === lang.code ? 'text-[#1428A0] font-bold bg-blue-50' : 'text-gray-700'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
