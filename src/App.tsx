import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar';
import { Composer } from './components/Composer';
import { Chat } from './components/Chat';
import { FAQ } from './components/FAQ';

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 selection:bg-[#1428A0] selection:text-white">
      <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-2 md:pt-24 md:pb-4 px-6 text-center max-w-5xl mx-auto space-y-2 md:space-y-4">
          <p className="text-[10px] md:text-sm font-bold text-gray-400 whitespace-nowrap tracking-widest uppercase">
            {t('hero.version')}
          </p>

          <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#1428A0] leading-tight md:whitespace-nowrap">
            {t('hero.title')}
          </h1>

          <p className="text-lg md:text-2xl font-bold text-[#1F5BFF] md:whitespace-nowrap">
            {t('hero.slogan')}
          </p>

          <p className="mt-1 md:mt-3 text-gray-500 max-w-2xl mx-auto text-xs md:text-base leading-relaxed">
            {t('hero.description')}
          </p>
        </section>

        {/* Composer Component */}
        <Composer />

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-gray-100 text-center">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1428A0] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="font-bold text-gray-900">MelodyAI</span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-gray-400">
              <a href="#" className="hover:text-[#1428A0] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#1428A0] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#1428A0] transition-colors">API</a>
              <a href="#" className="hover:text-[#1428A0] transition-colors">Contact</a>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-400 font-medium">
            © 2026 MelodyAI Global. All rights reserved. Powered by Gemini 3.1 Pro.
          </p>
        </footer>
      </main>

      {/* Floating Components */}
      <Chat />
      <FAQ />

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/20 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
