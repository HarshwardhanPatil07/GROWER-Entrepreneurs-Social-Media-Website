import { useClickOutside } from "@mantine/hooks";
import { useState, useRef, useEffect, type FC } from "react";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/svgs";
import dynamic from "next/dynamic";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";

// Fix the import path to use a relative path from the current directory to the chart directory
const DynamicChart = dynamic(
  // @ts-ignore - Suppressing type error for dynamic import
  () => import('../chart/FutureTrendChart'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner className="h-8 w-8 fill-none stroke-secondary" />
      </div>
    )
  }
);

interface FutureTrendModalProps {
  articleId: string;
  isOpen: boolean;
  onClose: () => void;
}

const FutureTrendModal: FC<FutureTrendModalProps> = ({ articleId, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  
  // Setup click outside handler safely
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  // Fetch prediction data
  const { data: prediction, isLoading, error } = api.predictions.getPrediction.useQuery(
    { articleId },
    { enabled: isOpen, refetchOnWindowFocus: false }
  );

  if (!isOpen) return null;

  const toggleYearExpansion = (year: number) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
  };

  // Only create chart data if prediction and yearlyPredictions exist
  const chartData = prediction?.yearlyPredictions?.map(item => ({
    year: item.year,
    growth: item.growth
  })) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div 
        ref={modalRef} 
        className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg border border-border-light bg-white p-6 dark:border-border dark:bg-primary"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-text-primary dark:hover:bg-primary-light"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-text-secondary">Future Trend AI Prediction</h2>
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              AI Powered
            </div>
            <div className="rounded-md bg-secondary bg-opacity-20 px-3 py-1 text-sm font-medium text-secondary">
              PRO Feature
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <LoadingSpinner className="h-10 w-10 fill-none stroke-secondary" />
            <span className="ml-3 text-lg text-gray-600 dark:text-text-primary">Analyzing startup potential...</span>
          </div>
        ) : error ? (
          <div className="flex h-60 flex-col items-center justify-center text-center">
            <div className="mb-4 text-lg font-medium text-red-600 dark:text-red-400">
              Failed to generate prediction
            </div>
            <p className="text-gray-600 dark:text-text-primary">
              We couldn't analyze this idea right now. Please try again later.
            </p>
          </div>
        ) : prediction ? (
          <>
            <div className="mb-6 rounded-lg border border-border-light bg-gray-50 p-4 dark:border-border dark:bg-primary-light">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-text-secondary">
                {prediction.title}
              </h3>
              <p className="text-gray-600 dark:text-text-primary">{prediction.summary}</p>
            </div>

            {/* Growth Chart */}
            {chartData.length > 0 && (
              <div className="mb-8 rounded-lg border border-border-light p-4 dark:border-border">
                <h4 className="mb-4 text-lg font-medium text-gray-700 dark:text-text-secondary">
                  Projected Growth Over Time
                </h4>
                <div className="h-64">
                  <DynamicChart data={chartData} />
                </div>
              </div>
            )}

            {/* Year-by-Year Breakdown */}
            {prediction.yearlyPredictions && prediction.yearlyPredictions.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-4 text-lg font-medium text-gray-700 dark:text-text-secondary">
                  Year-by-Year Analysis
                </h4>
                
                <div className="space-y-4">
                  {prediction.yearlyPredictions.map((yearData) => (
                    <div key={yearData.year} className="overflow-hidden rounded-lg border border-border-light dark:border-border">
                      <button
                        onClick={() => toggleYearExpansion(yearData.year)}
                        className="flex w-full items-center justify-between bg-white px-4 py-3 text-left transition hover:bg-gray-50 dark:bg-primary dark:hover:bg-primary-light"
                      >
                        <div className="flex items-center">
                          <span className="mr-3 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {yearData.year}
                          </span>
                          <span className="text-gray-700 dark:text-text-secondary">
                            {yearData.marketStatus}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className={`mr-2 rounded-md px-2 py-1 text-sm font-medium ${
                            yearData.riskLevel.includes("High") 
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
                              : yearData.riskLevel.includes("Medium")
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}>
                            {yearData.riskLevel} Risk
                          </span>
                          {expandedYear === yearData.year ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-text-primary" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-text-primary" />
                          )}
                        </div>
                      </button>
                      
                      {expandedYear === yearData.year && (
                        <div className="border-t border-border-light bg-gray-50 px-4 py-3 dark:border-border dark:bg-primary-light">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <h5 className="mb-2 text-sm font-semibold text-gray-600 dark:text-text-primary">
                                GROWTH METRICS
                              </h5>
                              <p className="mb-1 text-gray-700 dark:text-text-secondary">
                                <strong>Growth Factor:</strong> {yearData.growth}x
                              </p>
                              <p className="text-gray-700 dark:text-text-secondary">
                                <strong>Investment Stage:</strong> {yearData.investmentPotential}
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="mb-2 text-sm font-semibold text-gray-600 dark:text-text-primary">
                                KEY METRICS
                              </h5>
                              <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-text-secondary">
                                {yearData.keyMetrics.map((metric, index) => (
                                  <li key={index}>{metric}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investment Recommendation */}
            <div className="mb-6 rounded-lg border border-border-light bg-gray-50 p-4 dark:border-border dark:bg-primary-light">
              <h4 className="mb-2 text-lg font-medium text-gray-700 dark:text-text-secondary">
                Investment Recommendation
              </h4>
              <p className="mb-4 text-gray-700 dark:text-text-secondary">
                {prediction.investmentRecommendation}
              </p>
              <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">
                <h5 className="mb-1 text-sm font-bold text-blue-800 dark:text-blue-200">
                  Competitive Advantage
                </h5>
                <p className="text-blue-700 dark:text-blue-100">
                  {prediction.competitiveAdvantage}
                </p>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500 dark:text-text-primary">
              This prediction is based on AI analysis and should be used as one of many tools in investment decision making.
            </div>
          </>
        ) : (
          <div className="flex h-60 flex-col items-center justify-center text-center">
            <p className="text-gray-600 dark:text-text-primary">
              No prediction data available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureTrendModal;