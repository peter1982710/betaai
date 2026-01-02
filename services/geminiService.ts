
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisSignal, Timeframe, Language } from "../types";

// Helper function to safely retrieve API Key in various environments (Vite, CRA, Netlify)
const getApiKey = (): string => {
  // 1. Try Vite standard (import.meta.env)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Try process.env variants (Standard, React App, Vite compat)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.API_KEY || 
           process.env.VITE_API_KEY || 
           process.env.REACT_APP_API_KEY || 
           '';
  }
  
  return '';
};

export const analyzeCryptoMarket = async (symbol: string, timeframe: Timeframe, language: Language): Promise<AnalysisSignal> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error(language === 'fa' 
      ? "کلید API یافت نشد. لطفاً در تنظیمات Netlify متغیر VITE_API_KEY را تنظیم کنید." 
      : "API Key missing. Please set VITE_API_KEY in Netlify Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const currentTime = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
  
  const languageNames: Record<Language, string> = {
    en: 'English',
    es: 'Spanish',
    fa: 'Persian (Farsi)',
    ar: 'Arabic'
  };

  const prompt = `
    CRITICAL: FUTURES MARKET ANALYSIS REQUIRED (USDT-Margined Perpetual).
    Exchange Focus: BINANCE ONLY.
    Asset: ${symbol}USDT Perpetual Futures
    Timeframe: ${timeframe}
    Current UTC Time: ${currentTime}
    Output Language: ${languageNames[language]}

    MANDATORY RISK MANAGEMENT RULE:
    - THE RISK TO REWARD RATIO MUST BE EXACTLY 1:2.
    - Calculate Stop Loss and Targets such that the potential profit is exactly twice the potential risk.
    - For LONG: (Target 2 - Entry) = 2 * (Entry - StopLoss).
    - For SHORT: (Entry - Target 2) = 2 * (StopLoss - Entry).
    - Provide 3 targets where Target 2 represents the 1:2 R/R milestone.

    MANDATORY BINANCE SEARCH PROTOCOL:
    1. Use Google Search to find the absolute real-time price trends and candle patterns for ${symbol}USDT on Binance.
    2. Analyze the latest candlestick formations (Price Action) and fundamental news.
    3. MUST use the most recent data from Binance to determine the trend.
    
    ANALYSIS REQUIREMENTS:
    - Act as a Professional Binance Futures Quant Trader.
    - Signal must be LONG or SHORT suitable for Futures trading.
    - Factor in the ${timeframe} timeframe specifically for entry/exit timing.

    JSON SCHEMA:
    Return ONLY a valid JSON object. All text fields must be in ${languageNames[language]}.
    "riskRewardRatio" MUST ALWAYS BE "1:2".
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          timeframe: { type: Type.STRING },
          side: { type: Type.STRING, enum: ["LONG", "SHORT"] },
          currentPrice: { type: Type.NUMBER },
          entryPrice: { type: Type.NUMBER },
          targets: { 
            type: Type.ARRAY, 
            items: { type: Type.NUMBER },
            minItems: 3,
            maxItems: 3
          },
          stopLoss: { type: Type.NUMBER },
          gptAnalysis: { type: Type.STRING },
          geminiAnalysis: { type: Type.STRING },
          consensusReasoning: { type: Type.STRING },
          riskRewardRatio: { type: Type.STRING, description: "Must be '1:2'" },
          confidence: { type: Type.NUMBER }
        },
        required: ["symbol", "side", "currentPrice", "entryPrice", "targets", "stopLoss", "gptAnalysis", "geminiAnalysis", "consensusReasoning", "confidence", "riskRewardRatio"]
      },
    }
  });

  try {
    const text = response.text.trim();
    const data = JSON.parse(text);
    // Force UI consistency for R/R
    data.riskRewardRatio = "1:2";
    return data;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error(language === 'fa' ? "خطا در دریافت دیتای فیوچرز بایننس. لطفا دوباره تلاش کنید." : "Error fetching Binance Futures data. Please retry.");
  }
};
