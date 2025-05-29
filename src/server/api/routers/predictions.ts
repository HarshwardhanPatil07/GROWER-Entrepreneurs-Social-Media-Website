import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { articles } from "~/server/db/schema";
import RemoveMarkdown from "remove-markdown";
import { generateStartupPrediction } from "~/server/services/aiPredictionService";

export const predictionsRouter = createTRPCRouter({
  // Get AI prediction for a startup idea
  getPrediction: protectedProcedure
    .input(
      z.object({
        articleId: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // Get the article content for AI analysis
        const article = await ctx.db.query.articles.findFirst({
          where: and(
            eq(articles.id, input.articleId),
            eq(articles.isDeleted, false),
          ),
          columns: {
            id: true,
            title: true,
            subtitle: true,
            content: true,
            createdAt: true,
          },
        });

        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Article not found",
          });
        }

        // Clean content for analysis (remove markdown and HTML)
        const cleanContent = RemoveMarkdown(article.content);
        
        // Get current year for timeline predictions
        const currentYear = new Date().getFullYear();
        
        // Use our new LLM service for prediction generation
        const prediction = await generateStartupPrediction(
          article.id,
          article.title,
          cleanContent,
          currentYear
        );

        return prediction;
      } catch (error) {
        console.error("Error generating prediction:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate prediction",
        });
      }
    }),
    
  // New endpoints for improved prediction features
  getCachedPredictions: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        cursor: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // This would fetch previously generated predictions from a database
      // Will be implemented in a future update when we add prediction caching
      return {
        items: [],
        nextCursor: null
      };
    }),
});