import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { 
  Music, 
  Upload, 
  Image as ImageIcon, 
  Mic, 
  Send, 
  Download, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  Play, 
  Pause,
  Clock,
  ChevronRight,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const genres = [
  'ballad', 'trot', 'dance', 'jpop', 'kpop', 'hiphop', 'jazz', 'edm'
];

const durations = [1, 3, 5];

export const Composer = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [voice, setVoice] = useState<string | null>(null);
  const [genre, setGenre] = useState('ballad');
  const [duration, setDuration] = useState(3);
  const [lyricLanguage, setLyricLanguage] = useState('ko');
  const [vocalGender, setVocalGender] = useState('female');
  const [lyricsOn, setLyricsOn] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const canGenerate = text.trim() !== "" || image !== null || voice !== null;

  const onDropImage = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onDropVoice = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setVoice(reader.result as string);
    reader.readAsDataURL(file);
  };

  const { getRootProps: getImageProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: onDropImage,
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  const { getRootProps: getVoiceProps, getInputProps: getVoiceInputProps } = useDropzone({
    onDrop: onDropVoice,
    accept: { 'audio/*': [] },
    multiple: false
  } as any);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setResult(null);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 5;
      });
    }, 500);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          image,
          genre,
          duration,
          language: 'ko',
          lyricLanguage,
          vocalGender,
          lyricsOn
        })
      });

      const data = await response.json();
      
      clearInterval(interval);
      setProgress(100);
      setResult(data);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1428A0', '#1F5BFF', '#FF7A00']
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12 md:pb-24 px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="p-5 md:p-8 space-y-6 md:space-y-8">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Text Input */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('input_text')}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full h-24 md:h-32 p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#1428A0] focus:border-transparent transition-all resize-none text-sm"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                {t('input_image')}
              </label>
              <div 
                {...getImageProps()} 
                className={`h-24 md:h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  image ? 'border-[#1428A0] bg-blue-50' : 'border-gray-200 hover:border-[#1428A0] hover:bg-gray-50'
                }`}
              >
                <input {...getImageInputProps()} />
                {image ? (
                  <img src={image} alt="preview" className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center px-4">Drag & drop or click</span>
                  </>
                )}
              </div>
            </div>

            {/* Voice Upload */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Mic className="w-4 h-4" />
                {t('input_voice')}
              </label>
              <div 
                {...getVoiceProps()} 
                className={`h-24 md:h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  voice ? 'border-[#1428A0] bg-blue-50' : 'border-gray-200 hover:border-[#1428A0] hover:bg-gray-50'
                }`}
              >
                <input {...getVoiceInputProps()} />
                {voice ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-8 h-8 text-[#1428A0] mb-1" />
                    <span className="text-xs font-bold text-[#1428A0]">Voice Ready</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center px-4">Drag & drop or click</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Enterprise Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-4 border-t border-gray-100">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('lyricsLanguage')}
              </label>
              <select 
                value={lyricLanguage}
                onChange={(e) => setLyricLanguage(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-[#1428A0]"
              >
                <option value="ko">한국어 (Korean)</option>
                <option value="en">English</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="ja">日本語 (Japanese)</option>
                <option value="ru">Русский (Russian)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="pt-BR">Português (Brazil)</option>
                <option value="id">Bahasa (Indonesia)</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Mic className="w-4 h-4" />
                {t('vocalGender')}
              </label>
              <div className="flex gap-2">
                {['male', 'female', 'duet'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVocalGender(v)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                      vocalGender === v 
                        ? 'bg-[#1428A0] text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t(v)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Music className="w-4 h-4" />
                {t('genre')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`px-2 py-2 rounded-xl text-xs font-bold transition-all ${
                      genre === g 
                        ? 'bg-[#1428A0] text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t(`genre_${g}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('duration')}
              </label>
              <div className="flex gap-4">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      duration === d 
                        ? 'bg-[#1428A0] text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d}{t('minutes')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !canGenerate}
              className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                isGenerating || !canGenerate
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#1F5BFF] text-white hover:bg-[#1428A0] shadow-xl hover:shadow-2xl active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {t('generating')}
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  {t('generate')}
                </>
              )}
            </button>
            {!canGenerate && !isGenerating && (
              <p className="text-center text-xs font-bold text-red-400">
                {t('input_required')}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#1F5BFF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span>{Math.round(progress)}%</span>
                  <span>{t('orchestrating')}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Section */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 border-t border-gray-100 space-y-6"
              >
                {/* Copyright Certificate */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900">{t('copyright_cert')}</h4>
                      <p className="text-[10px] text-blue-700 font-mono truncate max-w-[200px]">
                        {t('hash_id')}: {result.copyrightHash}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Issued At</p>
                    <p className="text-[10px] text-blue-700">{new Date(result.issuedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{t('success')}</h3>
                      <p className="text-sm text-gray-500">{result.theme}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="px-6 py-3 bg-[#FF7A00] text-white rounded-xl font-bold text-sm hover:bg-[#E66E00] transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {t('listen_now')}
                    </button>
                    <a 
                      href={result.audio_url}
                      download
                      className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-5 h-5 text-gray-600" />
                    </a>
                    <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Audio Player */}
                <div className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                    <img src={result.cover_url} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 bg-[#1428A0] rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 truncate">{result.theme}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{genre} | {duration}{t('minutes')}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>{isPlaying ? '0:45' : '0:00'}</span>
                        <span>{duration}:00</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-[#1428A0] transition-all duration-1000 ${isPlaying ? 'w-1/4' : 'w-0'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {isPlaying && (
                  <audio 
                    autoPlay 
                    src={result.audio_url} 
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                )}

                {/* Lyrics Preview */}
                <div className="bg-gray-900 rounded-2xl p-8 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Lyrics Preview ({lyricLanguage.toUpperCase()})</span>
                    <span className="text-xs font-bold text-gray-500">BPM: {result.bpm} | Key: {result.key}</span>
                  </div>
                  <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap opacity-90">
                    {result.lyrics}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
