import { createTRPCRouter } from "~/server/api/trpc";
import {
  commentsRouter,
  feedbackRouter,
  handleRouter,
  likesRouter,
  notificationRouter,
  postsRouter,
  seriesRouter,
  stripeRouter,
  tagsRouter,
  usersRouter,
} from "./routers";
import { verificationRouter } from "./routers/verification"; // Fixed import
import { investmentsRouter } from "./routers/investments"; // Import investments router
import { predictionsRouter } from "./routers/predictions"; // Import predictions router

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  stripe: stripeRouter,
  tags: tagsRouter,
  users: usersRouter,
  likes: likesRouter,
  comments: commentsRouter,
  notifications: notificationRouter,
  handles: handleRouter,
  series: seriesRouter,
  feedback: feedbackRouter,
  verification: verificationRouter,
  investments: investmentsRouter, // Add investments router
  predictions: predictionsRouter, // Add predictions router
});

export type AppRouter = typeof appRouter;
