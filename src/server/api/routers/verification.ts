import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { documentTypeEnum, verificationDocuments, verificationRequests } from "~/server/db/schema/verifications";
import { users } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export const verificationRouter = createTRPCRouter({
  // Create a new verification request
  createVerificationRequest: protectedProcedure
    .input(
      z.object({
        documentIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { documentIds } = input;
      const userId = ctx.session.user.id;

      // Check if user already has a pending verification request
      const existingRequest = await ctx.db.query.verificationRequests.findFirst({
        where: and(
          eq(verificationRequests.userId, userId),
          eq(verificationRequests.status, "pending")
        ),
      });

      if (existingRequest) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a pending verification request",
        });
      }

      // Create a new verification request
      const [newRequest] = await ctx.db
        .insert(verificationRequests)
        .values({
          userId: userId,
          documents: documentIds,
        })
        .returning();

      return {
        success: true,
        request: newRequest,
      };
    }),

  // Get verification status of current user
  getVerificationStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get the latest verification request
    const latestRequest = await ctx.db.query.verificationRequests.findFirst({
      where: eq(verificationRequests.userId, userId),
      orderBy: (verificationRequests, { desc }) => [
        desc(verificationRequests.requestedAt),
      ],
    });

    // Get all uploaded documents for the user
    const documents = await ctx.db.query.verificationDocuments.findMany({
      where: eq(verificationDocuments.userId, userId),
    });

    return {
      status: latestRequest?.status ?? "unverified",
      requestedAt: latestRequest?.requestedAt,
      documents: documents,
    };
  }),

  // For admin use - get all verification requests
  getAllVerificationRequests: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "approved", "rejected"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can access this endpoint",
        });
      }

      const whereClause = input.status
        ? eq(verificationRequests.status, input.status)
        : undefined;

      const requests = await ctx.db.query.verificationRequests.findMany({
        where: whereClause,
        orderBy: (verificationRequests, { desc }) => [
          desc(verificationRequests.requestedAt),
        ],
        with: {
          user: true,
        },
      });

      return requests;
    }),

  // For admin use - approve or reject a verification request
  reviewVerificationRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
        status: z.enum(["approved", "rejected"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.session.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can review verification requests",
        });
      }

      const { requestId, status, notes } = input;

      // Update the verification request
      const [updatedRequest] = await ctx.db
        .update(verificationRequests)
        .set({
          status,
          reviewedAt: new Date(),
          reviewedBy: ctx.session.user.id,
          notes,
          updatedAt: new Date(),
        })
        .where(eq(verificationRequests.id, requestId))
        .returning();

      if (!updatedRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Verification request not found",
        });
      }

      // If approved, update the user's verified status
      if (status === "approved") {
        await ctx.db
          .update(users)
          .set({
            verified: true, // Using the new verified column
            // No need to set role explicitly - it stays the same
          })
          .where(eq(users.id, updatedRequest.userId));
      }

      return {
        success: true,
        request: updatedRequest,
      };
    }),
    
  // Delete a document (only the owner can delete their document)
  deleteDocument: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { documentId } = input;
      const userId = ctx.session.user.id;

      // Get the document
      const document = await ctx.db.query.verificationDocuments.findFirst({
        where: eq(verificationDocuments.id, documentId),
      });

      if (!document) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      // Check if the user is the owner of the document
      if (document.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this document",
        });
      }

      try {
        // Delete the file from UploadThing storage using proper method
        // Note: Using the key directly with UploadThing's delete API
        await fetch(`https://uploadthing.com/api/deleteFile?fileKey=${document.documentKey}`, {
          method: "DELETE",
          headers: {
            "x-uploadthing-api-key": process.env.UPLOADTHING_SECRET ?? ""
          }
        });
      } catch (error) {
        console.error("Failed to delete file from storage:", error);
        // Continue with deletion from database even if storage deletion fails
      }

      // Delete the document from database
      await ctx.db
        .delete(verificationDocuments)
        .where(eq(verificationDocuments.id, documentId));

      return { success: true };
    }),
});