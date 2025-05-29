import React, { useMemo, useState } from 'react';
import FutureTrendChart from './FutureTrendChart';
import type { StartupPrediction, YearlyPrediction } from '~/server/services/aiPredictionService';
import { PiChartLineUpBold, PiRocketLaunch, PiTrendUp, PiWarningCircle } from 'react-icons/pi';

interface StartupPredictionDisplayProps {
  prediction: StartupPrediction | null | undefined;
  isLoading?: boolean;
}

const StartupPredictionDisplay: React.FC<StartupPredictionDisplayProps> = ({ 
  prediction, 
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'metrics'>('overview');
  
  const chartData = useMemo(() => {
    if (!prediction?.yearlyPredictions) return [];
    return prediction.yearlyPredictions.map(year => ({
      year: year.year,
      growth: year.growth,
      marketStatus: year.marketStatus,
      riskLevel: year.riskLevel
    })); 
  }, [prediction]);
  
  const getRiskLevelColor = (riskLevel: string) => {
    if (!riskLevel) return 'bg-gray-200 text-gray-800';
    
    riskLevel = riskLevel.toLowerCase();
    if (riskLevel.includes('high')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-gray-200';
    if (riskLevel.includes('medium')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-gray-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-gray-200';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="animate-pulse h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="animate-pulse h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="animate-pulse h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
    );
  }
  
  if (!prediction) {
    return (
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-center">No prediction data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <PiChartLineUpBold className="text-blue-600 dark:text-blue-400" />
          AI-Powered Market Prediction
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{prediction.summary}</p>
      </div>
      
      {/* Chart */}
      <div className="p-5">
        <div className="h-64 md:h-80">
          <FutureTrendChart data={chartData} height="100%" />
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-t border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 font-medium text-center focus:outline-none ${
            activeTab === 'overview' 
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 px-4 font-medium text-center focus:outline-none ${
            activeTab === 'details' 
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Year by Year
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-3 px-4 font-medium text-center focus:outline-none ${
            activeTab === 'metrics' 
              ? 'text-blue-600 dark:text-gray-400 border-b-2 border-blue-600 dark:border-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Investment Analysis
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <PiTrendUp /> 
                  Market Growth Projection
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  This startup shows an estimated {Math.round(chartData[chartData.length - 1]?.growth || 0)}% growth 
                  potential over the next decade.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <PiRocketLaunch />
                  Competitive Advantage
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {prediction.competitiveAdvantage}
                </p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Investment Recommendation</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {prediction.investmentRecommendation}
              </p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800 flex">
              <div className="flex-shrink-0 mr-3">
                <PiWarningCircle className="h-5 w-5 text-yellow-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-gray-300">Disclaimer</h3>
                <div className="mt-1 text-sm text-yellow-700 dark:text-gray-400">
                  <p>These predictions are generated by AI and should be used as one of many factors in your decision-making process. Market conditions can change rapidly.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="space-y-8">
            {prediction.yearlyPredictions.map((yearData: YearlyPrediction) => (
              <div 
                key={yearData.year} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white">Year {yearData.year}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(yearData.riskLevel)}`}>
                    {yearData.riskLevel} Risk
                  </span>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Growth:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{yearData.growth}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Market Status:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{yearData.marketStatus}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Investment Stage:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{yearData.investmentPotential}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Metrics:</h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm space-y-1">
                      {yearData.keyMetrics.map((metric, idx) => (
                        <li key={idx}>{metric}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-2">Investment Potential Summary</h3>
              <p className="text-gray-700 dark:text-gray-300 text-center text-lg font-medium">
                {prediction.investmentRecommendation}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Early Stage */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Early Stage</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {prediction.yearlyPredictions[0]?.investmentPotential || "N/A"}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Growth Stage */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Growth Stage</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {prediction.yearlyPredictions[1]?.investmentPotential || "N/A"}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Late Stage */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mature Stage</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {prediction.yearlyPredictions[3]?.investmentPotential || "N/A"}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Industry Considerations</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {prediction.competitiveAdvantage}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Early Growth Indicators</h4>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    {prediction.yearlyPredictions[0]?.keyMetrics.map((metric, idx) => (
                      <li key={`early-${idx}`}>{metric}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Long-term Success Metrics</h4>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    {prediction.yearlyPredictions[3]?.keyMetrics.map((metric, idx) => (
                      <li key={`late-${idx}`}>{metric}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupPredictionDisplay;