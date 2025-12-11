
import React, { useState, useEffect } from 'react';
import { VortexState } from './types';
import { fetchVortexData } from './services/sonarService';
import MetricCard from './components/MetricCard';

const App: React.FC = () => {
  const [data, setData] = useState<VortexState | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchVortexData().then(setData);

    // Polling interval to simulate real-time blockchain data stream
    const interval = setInterval(async () => {
      const newData = await fetchVortexData();
      setData(newData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-[#d500f9] animate-pulse text-xl">INITIALIZING VORTEX PROTOCOL...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-mono p-4 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 border-b-2 border-[#d500f9] pb-4">
        <h1 className="text-[#d500f9] text-xl md:text-2xl font-bold tracking-tighter uppercase mb-4 md:mb-0">
          VORTEX COMMAND Ω 2.0 (FINAL EDGE) <span className="text-gray-500 mx-2">|</span> BTCUSDT
        </h1>
        
        <div className="flex items-center space-x-6">
          {/* Price Ticker */}
          <div className="border border-green-500/50 bg-green-900/10 px-6 py-2 rounded shadow-[0_0_10px_rgba(0,255,0,0.2)]">
            <span className="text-3xl md:text-4xl font-bold text-[#00e676]">
              {data.price.toFixed(2)}
            </span>
          </div>

          {/* Status/Lag Indicator */}
          <div className="hidden md:block">
             <div className="bg-gradient-to-r from-red-600 to-red-900 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest shadow-red-500/50 shadow-md">
               LAG DETECTED ({data.lagMs}ms!)
             </div>
             <div className="text-[10px] text-right text-gray-500 mt-1">
               ASYNC LAG: {data.lagMs}ms <br/> SENSITIVITY: 1.0x
             </div>
          </div>
        </div>
      </header>

      {/* Top Deck: Composite Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Card 1: VCS */}
        <div className="bg-gray-900 border border-gray-700 rounded p-6 shadow-lg flex flex-col items-center justify-center relative min-h-[160px]">
           <div className="absolute top-4 text-xs text-gray-500 uppercase tracking-widest">
             Vortex Composite Score (VCS) | Net Z-Score
           </div>
           <div className="text-6xl font-bold text-white my-4">
             {data.vcsScore.toFixed(1)}
           </div>
           <div className="w-full bg-gray-800 py-2 text-center text-white text-sm font-bold uppercase tracking-wider rounded border border-gray-600">
             {data.vcsStatus}
           </div>
        </div>

        {/* Card 2: Ejection Power */}
        <div className="bg-gray-900 border border-gray-700 rounded p-6 shadow-lg flex flex-col items-center justify-center relative min-h-[160px]">
           <div className="absolute top-4 text-xs text-gray-500 uppercase tracking-widest">
             Ejection Power Gauge (Momentum / Fading)
           </div>
           <div className="text-6xl font-bold text-white my-4">
             {data.ejectionPower.toFixed(2)}%
           </div>
           <div className="w-full bg-gray-800 py-2 text-center text-white text-sm font-bold uppercase tracking-wider rounded border border-gray-600">
             {data.ejectionStatus}
           </div>
        </div>
      </div>

      {/* Main Grid: 12 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
};

export default App;
