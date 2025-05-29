// filepath: d:\VIT\Grower\src\server\api\routers\investments.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { investments, articles } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { notifications } from "~/server/db/schema";

export const investmentsRouter = createTRPCRouter({
  // Get count of accepted investments for an article
  getAcceptedInvestorCount: publicProcedure
    .input(
      z.object({
        ideaId: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { ideaId } = input;

      try {
        const acceptedInvestments = await ctx.db.query.investments.findMany({
          where: and(
            eq(investments.ideaId, ideaId),
            eq(investments.status, "accepted")
          ),
          columns: {
            id: true,
          },
        });

        return {
          success: true,
          count: acceptedInvestments.length,
        };
      } catch (error) {
        console.error("Error fetching accepted investor count:", error);
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch accepted investor count",
        });
      }
    }),

  // Create a new investment proposal
  createInvestment: protectedProcedure
    .input(
      z.object({
        ideaId: z.string().trim(),
        founderId: z.string().trim(),
        amount: z.string().transform((val) => parseFloat(val.replace(/,/g, ''))),
        equityPercentage: z.string().transform((val) => parseFloat(val.replace(/,/g, ''))),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the user is a verified investor
      if (ctx.session.user.role !== "investor" || !ctx.session.user.verified) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only verified investors can submit investment proposals",
        });
      }

      const { ideaId, founderId, amount, equityPercentage, message } = input;
      
      // Validate the investment amount and equity percentage
      if (amount <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Investment amount must be greater than zero",
        });
      }

      if (equityPercentage <= 0 || equityPercentage > 100) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Equity percentage must be between 0 and 100",
        });
      }

      try {
        // Check if the user has already submitted an investment proposal for this idea
        const existingInvestment = await ctx.db.query.investments.findFirst({
          where: and(
            eq(investments.investorId, ctx.session.user.id),
            eq(investments.ideaId, ideaId),
            eq(investments.status, "pending")
          ),
        });

        if (existingInvestment) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already submitted an investment proposal for this idea",
          });
        }

        // Get the article details for the notification
        const article = await ctx.db.query.articles.findFirst({
          where: eq(articles.id, ideaId),
          columns: {
            title: true,
            slug: true,
          },
        });

        if (!article) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Idea not found",
          });
        }

        // Create the investment proposal
        const [newInvestment] = await ctx.db
          .insert(investments)
          .values({
            investorId: ctx.session.user.id,
            ideaId: ideaId,
            founderId: founderId,
            amount: amount.toString(),
            equityPercentage: equityPercentage.toString(),
            message: message || null,
          })
          .returning();

        // Create a notification for the founder
        await ctx.db.insert(notifications).values({
          type: "INVESTMENT",
          body: `${ctx.session.user.name} has submitted an investment proposal of $${amount.toLocaleString()} for ${equityPercentage}% equity.`,
          userId: founderId,
          fromId: ctx.session.user.id,
          title: article.title,
          slug: article.slug,
          isRead: false,
        });

        return {
          success: true,
          message: "Investment proposal submitted successfully",
          investment: newInvestment,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error submitting investment proposal:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit investment proposal",
        });
      }
    }),

  // Get all investment proposals for the current user (as an investor)
  getInvestorProposals: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "accepted", "declined", "completed"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Ensure the user is an investor
      if (ctx.session.user.role !== "investor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only investors can access their investment proposals",
        });
      }

      const whereClause = and(
        eq(investments.investorId, ctx.session.user.id),
        input.status ? eq(investments.status, input.status) : undefined
      );

      try {
        const investorProposals = await ctx.db.query.investments.findMany({
          where: whereClause,
          with: {
            idea: {
              columns: {
                id: true,
                title: true,
                slug: true,
                cover_image: true,
              },
              with: {
                user: {
                  columns: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: (investments, { desc }) => [desc(investments.createdAt)],
        });

        return {
          success: true,
          proposals: investorProposals,
        };
      } catch (error) {
        console.error("Error fetching investor proposals:", error);
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch investment proposals",
        });
      }
    }),

  // Get all investment proposals for the current user's startup ideas
  getFounderProposals: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "accepted", "declined", "completed"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Ensure the user is a startup
      if (ctx.session.user.role !== "startup") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only startups can access investment proposals for their ideas",
        });
      }

      const whereClause = and(
        eq(investments.founderId, ctx.session.user.id),
        input.status ? eq(investments.status, input.status) : undefined
      );

      try {
        const founderProposals = await ctx.db.query.investments.findMany({
          where: whereClause,
          with: {
            investor: {
              columns: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            idea: {
              columns: {
                id: true,
                title: true,
                slug: true,
                cover_image: true,
              },
            },
          },
          orderBy: (investments, { desc }) => [desc(investments.createdAt)],
        });

        return {
          success: true,
          proposals: founderProposals,
        };
      } catch (error) {
        console.error("Error fetching founder proposals:", error);
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch investment proposals",
        });
      }
    }),

  // Accept or decline an investment proposal
  respondToProposal: protectedProcedure
    .input(
      z.object({
        investmentId: z.string().trim(),
        status: z.enum(["accepted", "declined"]),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { investmentId, status, message } = input;

      try {
        // Get the investment proposal
        const investmentProposal = await ctx.db.query.investments.findFirst({
          where: eq(investments.id, investmentId),
          with: {
            idea: {
              columns: {
                title: true,
                slug: true,
              },
            },
          },
        });

        if (!investmentProposal) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Investment proposal not found",
          });
        }

        // Ensure the current user is the founder who received this proposal
        if (investmentProposal.founderId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to respond to this investment proposal",
          });
        }

        // Ensure the proposal is still pending
        if (investmentProposal.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This investment proposal has already been processed",
          });
        }

        // Update the investment proposal status
        const [updatedInvestment] = await ctx.db
          .update(investments)
          .set({
            status,
            respondedAt: new Date(),
            updatedAt: new Date(),
            contractDetails: status === "accepted" ? "Contract details will be provided soon." : undefined,
          })
          .where(eq(investments.id, investmentId))
          .returning();

        // Create a notification for the investor
        await ctx.db.insert(notifications).values({
          type: "INVESTMENT_RESPONSE",
          body: status === "accepted" 
            ? `Your investment proposal for ${investmentProposal.idea.title} has been accepted! ${message ? `Message: ${message}` : ""}`
            : `Your investment proposal for ${investmentProposal.idea.title} has been declined. ${message ? `Reason: ${message}` : ""}`,
          userId: investmentProposal.investorId,
          fromId: ctx.session.user.id,
          title: investmentProposal.idea.title,
          slug: investmentProposal.idea.slug,
          isRead: false,
        });

        return {
          success: true,
          message: `Investment proposal ${status === "accepted" ? "accepted" : "declined"} successfully`,
          investment: updatedInvestment,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error responding to investment proposal:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process your response to the investment proposal",
        });
      }
    }),
});