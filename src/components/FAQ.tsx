import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, X, ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqQuestions = Array.from({ length: 30 }, (_, i) => `faq_q${i + 1}`);

export const FAQ = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      {/* FAQ Bot Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF7A00] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <Bot className="w-8 h-8" />
      </button>

      {/* FAQ Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-[20%] right-0 bottom-0 w-full md:w-[450px] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-50 flex flex-col rounded-t-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#FF7A00] p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8" />
                <h3 className="font-bold text-lg">{t('faq_title')}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
              {faqQuestions.map((q, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-[#FF7A00]" />
                      <span className="text-sm font-bold text-gray-700">
                        {t(q)}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex === idx ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {activeIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="p-4 bg-orange-50 rounded-lg text-sm text-gray-600 leading-relaxed">
                          {t(q.replace('_q', '_a'))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
