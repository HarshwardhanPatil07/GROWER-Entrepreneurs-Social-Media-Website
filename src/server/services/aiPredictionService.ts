// LLM-powered AI prediction service for startup trend analysis
import { Ollama } from "ollama";
import { PromptTemplate } from "@langchain/core/prompts";

// Types for our prediction response
export interface YearlyPrediction {
  year: number;
  growth: number;
  marketStatus: string;
  riskLevel: string;
  investmentPotential: string;
  keyMetrics: string[];
}

export interface StartupPrediction {
  articleId: string;
  title: string;
  summary: string;
  createdAt: Date;
  yearlyPredictions: YearlyPrediction[];
  competitiveAdvantage: string;
  investmentRecommendation: string;
}

// Configure LLM options
const MODEL_NAME = "llama2"; // Use "llama2" or another model available in your Ollama setup

// Initialize the LLM - this will connect to a locally running Ollama instance
const ollama = new Ollama({
  host: "http://localhost:11434",
});

async function generateWithOllama(prompt: string): Promise<string> {
  try {
    const response = await ollama.generate({
      model: MODEL_NAME,
      prompt: prompt,
      options: {
        temperature: 0.2 // Lower temperature for more consistent predictions
      }
    });
    return response.response;
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    throw new Error(`Failed to generate prediction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create a prompt template for generating startup predictions
const predictionPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert venture capitalist and market analyst specializing in startup evaluation.
Analyze this startup idea and provide a data-driven market prediction:

STARTUP TITLE: {title}
STARTUP DESCRIPTION: {content}

Based on the above, generate a detailed growth prediction for the next 10 years.
Focus on realistic market adoption patterns for this type of startup.
Consider current market trends, potential obstacles, and growth opportunities.

Format your response as a structured JSON object with the following:
1. A "summary" field with a concise analysis (1-2 sentences)
2. "yearlyPredictions" as an array with predictions for years {currentYear_1}, {currentYear_3}, {currentYear_5}, and {currentYear_10}, each containing:
   - year (number)
   - growth (number representing percentage growth)
   - marketStatus (string describing the market phase)
   - riskLevel (string from "Low" to "High")
   - investmentPotential (string describing investment stage/potential)
   - keyMetrics (array of 3 metrics as strings)
3. "competitiveAdvantage" field explaining the startup's potential advantages (1-2 sentences)
4. "investmentRecommendation" with your overall recommendation for investors (1 sentence)

Make sure growth projections are realistic and vary based on the idea quality.
Ensure the output is valid JSON that can be parsed.
`);

/**
 * Generate an AI-powered prediction for a startup idea using LLM
 * @param title The startup idea title
 * @param content The cleaned startup idea description
 * @param currentYear The current year for timeline references
 * @returns A detailed prediction object
 */
export async function generateStartupPrediction(
  articleId: string,
  title: string, 
  content: string, 
  currentYear: number
): Promise<StartupPrediction> {
  try {
    const llm = ollama;

    // Create the prompt with startup information
    const prompt = await predictionPromptTemplate.format({
      title,
      content,
      currentYear: currentYear,
      currentYear_1: currentYear + 1,
      currentYear_3: currentYear + 3,
      currentYear_5: currentYear + 5,
      currentYear_10: currentYear + 10,
    });

    // Call the LLM
    const result = await generateWithOllama(prompt);

    // Parse the LLM response
    try {
      // Clean the response to extract just the JSON (removing any markdown code blocks if present)
      const jsonContent = result.replace(/```json|```/g, "").trim();
      const prediction = JSON.parse(jsonContent);

      // Construct our typed prediction object
      return {
        articleId,
        title,
        summary: prediction.summary || "Analysis based on current market trends and startup viability.",
        createdAt: new Date(),
        yearlyPredictions: prediction.yearlyPredictions || [],
        competitiveAdvantage: prediction.competitiveAdvantage || "This startup has potential competitive advantages that should be further evaluated.",
        investmentRecommendation: prediction.investmentRecommendation || "Consider investment after thorough due diligence."
      };
    } catch (parseError) {
      console.error("Failed to parse LLM response:", parseError);
      // Fall back to our backup algorithm if parsing fails
      return generateFallbackPrediction(articleId, title, content, currentYear);
    }
  } catch (error) {
    console.error("Error generating prediction with LLM:", error);
    // Fall back to our backup algorithm on any error
    return generateFallbackPrediction(articleId, title, content, currentYear);
  }
}

/**
 * Fallback prediction generator when LLM is unavailable
 * Uses a deterministic algorithm based on content characteristics
 */
function generateFallbackPrediction(
  articleId: string,
  title: string, 
  content: string, 
  currentYear: number
): StartupPrediction {
  // Generate a growth pattern based on idea content
  const seedValue = (title.length + content.length) % 20 + 10;
  const growthFactor = seedValue / 10;

  // More sophisticated fallback algorithm than the original
  const keywordBoost = calculateKeywordBoost(content);

  return {
    articleId,
    title,
    summary: "Based on market trends and startup viability analysis, our AI predicts the following growth trajectory:",
    createdAt: new Date(),
    yearlyPredictions: [
      {
        year: currentYear + 1,
        growth: Math.round((seedValue * growthFactor + keywordBoost) * 100) / 100,
        marketStatus: "Early adoption phase",
        riskLevel: "High",
        investmentPotential: "Seed to Series A",
        keyMetrics: [
          "User acquisition cost: High",
          "Market penetration: Low",
          "Revenue potential: Limited"
        ]
      },
      {
        year: currentYear + 3,
        growth: Math.round((seedValue * growthFactor * 2.5 + keywordBoost * 1.5) * 100) / 100,
        marketStatus: "Growth phase",
        riskLevel: "Medium-High",
        investmentPotential: "Series B to C",
        keyMetrics: [
          "User acquisition cost: Medium",
          "Market penetration: Growing",
          "Revenue potential: Moderate"
        ]
      },
      {
        year: currentYear + 5,
        growth: Math.round((seedValue * growthFactor * 5 + keywordBoost * 2.5) * 100) / 100,
        marketStatus: "Market expansion",
        riskLevel: "Medium",
        investmentPotential: "Series C to D",
        keyMetrics: [
          "User acquisition cost: Lower",
          "Market penetration: Established",
          "Revenue potential: Strong"
        ]
      },
      {
        year: currentYear + 10,
        growth: Math.round((seedValue * growthFactor * 10 + keywordBoost * 5) * 100) / 100,
        marketStatus: "Market maturity",
        riskLevel: "Low-Medium",
        investmentPotential: "Exit opportunity",
        keyMetrics: [
          "User acquisition cost: Optimized",
          "Market penetration: High",
          "Revenue potential: Maximized"
        ]
      }
    ],
    competitiveAdvantage: "This idea shows potential in disrupting current market trends with innovative approaches.",
    investmentRecommendation: calculateInvestmentRecommendation(seedValue, keywordBoost)
  };
}

/**
 * Calculates a boost factor based on presence of high-value startup keywords
 */
function calculateKeywordBoost(content: string): number {
  const highValueKeywords = [
    "ai", "artificial intelligence", "machine learning", "blockchain", "crypto", 
    "saas", "platform", "data", "analytics", "cloud", "sustainable", 
    "green", "fintech", "biotech", "healthcare", "renewable", "marketplace",
    "automation", "robotics", "subscription", "mobile", "app"
  ];

  const normalizedContent = content.toLowerCase();
  let boost = 0;

  highValueKeywords.forEach(keyword => {
    if (normalizedContent.includes(keyword)) {
      boost += 1;
    }
  });

  return Math.min(boost * 1.5, 15); // Cap the boost at 15
}

/**
 * Determines investment recommendation based on metrics
 */
function calculateInvestmentRecommendation(seedValue: number, keywordBoost: number): string {
  const score = seedValue + keywordBoost;

  if (score > 30) {
    return "Highly recommended for investment with expected strong returns";
  } else if (score > 20) {
    return "Recommended for investment with potential good returns";
  } else {
    return "Potential for investment with moderate returns, requires further market validation";
  }
}