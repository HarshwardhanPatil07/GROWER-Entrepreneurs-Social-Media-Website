// filepath: d:\VIT\Grower\src\component\predictions\ArticlePredictionSection.tsx
import React, { useState } from 'react';
import { api } from "~/utils/api";
import StartupPredictionDisplay from '../chart/StartupPredictionDisplay';
import { PiLightbulbFilament } from 'react-icons/pi';
import type { StartupPrediction } from '~/server/services/aiPredictionService';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface ArticlePredictionSectionProps {
  articleId: string;
  isStartupIdea?: boolean;
}

/**
 * Component to display AI predictions for startup ideas
 * This can be included in any article display page
 * Only visible to users with active subscription
 */
const ArticlePredictionSection: React.FC<ArticlePredictionSectionProps> = ({ 
  articleId,
  isStartupIdea = true // Default to true - can be determined via tags or metadata
}) => {
  const [showPredictions, setShowPredictions] = useState(false);
  const { data: session } = useSession();
  
  // Check if user has an active subscription
  const isProSubscriber = session?.user?.stripeSubscriptionStatus === "active";
  
  // Fetch prediction data when needed
  const { 
    data: prediction, 
    isLoading, 
    isError,
    error
  } = api.predictions.getPrediction.useQuery(
    { articleId },
    { 
      enabled: showPredictions && isStartupIdea && isProSubscriber,
      staleTime: 1000 * 60 * 60, // Cache for an hour
    }
  );

  // Don't render anything if this isn't a startup idea
  if (!isStartupIdea) return null;
  
  // Don't render the feature at all for users without active subscription
  if (session && !isProSubscriber) return null;
  
  // Handle button click for non-subscribers
  const handlePredictionClick = () => {
    if (!session) {
      toast.error("You need to be logged in to view AI predictions");
      return;
    }
    
    if (!isProSubscriber) {
      toast.error("This feature requires a PRO subscription");
      return;
    }
    
    setShowPredictions(true);
  };
  
  return (
    <div className="my-8">
      {!showPredictions ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <PiLightbulbFilament className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              Future Trend AI Prediction
              <span className="inline-block rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">PRO</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get AI-powered predictions about this startup idea's market potential over the next 10 years.
            </p>
            <button
              onClick={handlePredictionClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
            >
              View Future Trend Analysis
            </button>
            {session && !isProSubscriber && (
              <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
                ⚠️ This feature requires a PRO subscription
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          {isError ? (
            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
                Unable to generate prediction
              </h3>
              <p className="text-red-700 dark:text-red-400 mb-4">
                {error?.message || "There was a problem generating the prediction. Please try again later."}
              </p>
              <button
                onClick={() => setShowPredictions(false)}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              >
                Hide
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <PiLightbulbFilament className="text-blue-600 dark:text-blue-400" />
                  Future Trend AI Analysis
                  <span className="inline-block rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">PRO</span>
                </h3>
                <button
                  onClick={() => setShowPredictions(false)}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                >
                  Hide Analysis
                </button>
              </div>
              <StartupPredictionDisplay 
                prediction={prediction as StartupPrediction} 
                isLoading={isLoading} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArticlePredictionSection;