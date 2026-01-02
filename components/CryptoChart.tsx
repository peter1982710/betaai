
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface CryptoChartProps {
  symbol: string;
  side: 'LONG' | 'SHORT';
  currentPrice?: number;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ symbol, side, currentPrice }) => {
  const data = useMemo(() => {
    const points = [];
    let basePrice = currentPrice || (symbol === 'BTC' ? 65000 : 3000);
    for (let i = 0; i < 20; i++) {
      points.push({
        time: `${i}:00`,
        price: basePrice + (Math.random() - 0.5) * (basePrice * 0.02)
      });
    }
    return points;
  }, [symbol, currentPrice]);

  const chartColor = side === 'LONG' ? '#22c55e' : '#ef4444';

  return (
    <div className="h-64 w-full mt-6 bg-slate-900/50 rounded-2xl p-4 border border-white/5 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={chartColor} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoChart;
