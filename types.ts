
export type Timeframe = '5m' | '15m' | '1h' | '4h' | '1d';
export type Language = 'en' | 'es' | 'fa' | 'ar';

export interface AnalysisSignal {
  symbol: string;
  timeframe: string;
  side: 'LONG' | 'SHORT';
  currentPrice: number;
  entryPrice: number;
  targets: number[];
  stopLoss: number;
  gptAnalysis: string; // Analysis from GPT perspective
  geminiAnalysis: string; // Analysis from Gemini perspective
  consensusReasoning: string; // Combined reasoning
  technicalReasoning: string; // Legacy field for backward compatibility or extra details
  fundamentalReasoning: string; // Legacy field
  riskRewardRatio: string;
  confidence: number; // 0-100
}

export interface ChartData {
  time: string;
  price: number;
  volume: number;
}
