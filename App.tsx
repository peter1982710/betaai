
import React, { useState, useEffect, useRef } from 'react';
import { analyzeCryptoMarket } from './services/geminiService';
import { AnalysisSignal, Timeframe, Language } from './types';
import { translations } from './translations';
import CryptoChart from './components/CryptoChart';
import SupportButton from './components/SupportButton';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fa');
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState<Timeframe>('1h');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisSignal | null>(null);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = translations[lang] || translations['en'] || {};

  useEffect(() => {
    if (t && t.dir) {
      document.documentElement.dir = t.dir;
      document.documentElement.lang = lang;
    }
  }, [lang, t.dir]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setSymbol(filteredValue);
  };

  const startAnalysis = async () => {
    if (!symbol) {
      setError(t.errorSymbol || 'Please enter a symbol');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const analysis = await analyzeCryptoMarket(symbol, timeframe, lang);
      
      let timeZone = 'UTC';
      let locale = 'en-US';
      
      switch (lang) {
        case 'fa': timeZone = 'Asia/Tehran'; locale = 'fa-IR'; break;
        case 'en': timeZone = 'Europe/London'; locale = 'en-GB'; break;
        case 'es': timeZone = 'Europe/Madrid'; locale = 'es-ES'; break;
        case 'ar': timeZone = 'Asia/Riyadh'; locale = 'ar-SA'; break;
      }

      const now = new Date().toLocaleTimeString(locale, { 
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      });
      
      setLastUpdate(now);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (lang === 'fa' ? 'خطایی در تحلیل رخ داد.' : 'An error occurred during analysis.'));
    } finally {
      setLoading(false);
    }
  };

  const FloatingLanguageSelector = () => (
    <div className="fixed top-6 left-6 z-[60]" ref={langMenuRef}>
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        className={`w-14 h-14 rounded-full bg-blue-600 shadow-lg shadow-blue-500/40 flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-95 ${isLangOpen ? 'rotate-180' : ''} animate-bounce-slow`}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      </button>

      <div className={`absolute top-full mt-4 left-0 transition-all duration-300 origin-top-left ${isLangOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl flex flex-col gap-2 min-w-[120px]">
          {(['fa', 'en', 'ar', 'es'] as Language[]).map((l) => {
            const langData = translations[l] || {};
            return (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setIsLangOpen(false);
                }}
                className={`px-4 py-3 rounded-2xl text-sm font-bold uppercase transition-all flex items-center justify-between gap-4 ${
                  lang === l ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <span>{langData.langName || l}</span>
                <span className="text-[10px] opacity-50">{l}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col items-center transition-all`}>
      <FloatingLanguageSelector />

      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40 relative">
            <span className="text-2xl font-bold text-white">B</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
              Beta Ai
            </h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Quant Intelligence</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-md">
           <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
           </div>
           <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
             {lang === 'fa' ? 'سیستم آنلاین' : (lang === 'es' ? 'Sistema en línea' : (lang === 'ar' ? 'النظام متصل' : 'System Online'))}
           </span>
        </div>
      </header>

      <main className="w-full max-w-3xl">
        <div className="glass rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden border border-blue-500/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -z-10"></div>
          
          <h2 className="text-lg font-bold mb-6 text-blue-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t.cardTitle || 'Analysis'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400 block mr-1 font-medium">{t.symbolLabel || 'Asset'}</label>
              <input
                type="text"
                dir="ltr"
                value={symbol}
                onChange={handleSymbolChange}
                placeholder={t.symbolPlaceholder || 'BTC'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase placeholder:text-slate-600 font-mono text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400 block mr-1 font-medium">{t.timeframeLabel || 'Timeframe'}</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer text-lg"
              >
                {t.timeframeOptions && Object.entries(t.timeframeOptions).map(([key, value]: [string, any]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={startAnalysis}
            disabled={loading}
            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
              loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                {t.buttonLoading || 'Loading...'}
              </>
            ) : (
              t.buttonDefault || 'Analyze'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3 animate-in fade-in">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {result && (
          <div className={`glass rounded-3xl overflow-hidden transition-all duration-700 shadow-2xl animate-in fade-in slide-in-from-bottom-10 ${result.side === 'LONG' ? 'glow-green border-green-500/20' : 'glow-red border-red-500/20'}`}>
            <div className={`p-6 ${result.side === 'LONG' ? 'bg-green-500/10' : 'bg-red-500/10'} border-b border-white/10 flex flex-wrap justify-between items-center gap-4`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${result.side === 'LONG' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {t.signalResult || 'Result'}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">{lastUpdate}</span>
                </div>
                <h3 className={`text-4xl font-black ${result.side === 'LONG' ? 'text-green-500' : 'text-red-500'} tracking-tighter`}>
                  {result.side === 'LONG' ? (lang === 'fa' ? 'خرید (LONG)' : 'BUY (LONG)') : (lang === 'fa' ? 'فروش (SHORT)' : 'SELL (SHORT)')}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">{t.entryZone || 'Entry'}</span>
                  <span className="text-lg font-mono font-bold text-blue-400 truncate block">{result.entryPrice.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">{t.stopLoss || 'Stop Loss'}</span>
                  <span className="text-lg font-mono font-bold text-red-500 truncate block">{result.stopLoss.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block mb-1 font-bold uppercase">{t.riskReward || 'R/R'}</span>
                  <span className="text-lg font-mono font-bold text-indigo-400 block">{result.riskRewardRatio}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-400 px-1">{t.takeProfit || 'Targets'}</h4>
                <div className="flex flex-wrap gap-3">
                  {result.targets.map((target, idx) => (
                    <div key={idx} className="flex-1 min-w-[140px] bg-green-500/5 border border-green-500/20 p-4 rounded-xl flex flex-col items-center">
                      <span className="text-[10px] text-green-500/70 font-black uppercase mb-1">Target {idx + 1}</span>
                      <span className="text-lg font-mono font-bold text-green-400">{target.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <CryptoChart symbol={result.symbol} side={result.side} currentPrice={result.currentPrice} />

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-5 bg-slate-900/80 rounded-2xl border border-white/5 relative border-l-4 border-l-blue-500 shadow-lg">
                    <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {t.gptTitle || 'GPT'}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed text-justify opacity-80">
                      {result.gptAnalysis}
                    </p>
                  </div>

                  <div className="p-5 bg-slate-900/80 rounded-2xl border border-white/5 relative border-l-4 border-l-indigo-500 shadow-lg">
                    <h4 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      {t.geminiTitle || 'Gemini'}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed text-justify opacity-80">
                      {result.geminiAnalysis}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-blue-500/20 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl"></div>
                  <h4 className="text-white font-black text-lg mb-4 flex items-center gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    {t.consensusTitle || 'Consensus'}
                  </h4>
                  <p className="text-slate-200 text-sm leading-relaxed text-justify font-medium">
                    {result.consensusReasoning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SupportButton label={t.support || 'Support'} />

      <footer className="mt-20 text-slate-600 text-xs text-center pb-8 flex flex-col gap-2">
        <p>&copy; 2026 Beta Ai</p>
        <p className="text-[10px] opacity-40 uppercase tracking-widest">Beta AI Precision v3.7 | Binance Futures Core</p>
      </footer>
    </div>
  );
};

export default App;
