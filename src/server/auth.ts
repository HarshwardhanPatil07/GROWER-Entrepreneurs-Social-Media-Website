import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq } from "drizzle-orm";
import { pgTable, type PgTableFn } from "drizzle-orm/pg-core";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import slugify from "slugify";
import { env } from "~/env.mjs";
import { type BlogSocial } from "~/pages/dev/[username]";
import { slugSetting } from "~/utils/constants";
import { db } from "./db";
import {
  accounts,
  articles,
  comments,
  customTabs,
  follow,
  handles,
  likesToArticles,
  likesToComment,
  notifications,
  readersToArticles,
  series,
  sessions,
  stripeEvents,
  tags,
  tagsToArticles,
  tagsToUsers,
  users,
  verificationTokens,
} from "./db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }

  interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    emailVerified: Date | null;
    tagline: string;
    role: string;
    stripeSubscriptionStatus: string | null;
    verified?: boolean;
    handle?: {
      handle: string;
      id: string;
      name: string;
      about: string | null;
      social: BlogSocial;
      appearance?: {
        layout: "MAGAZINE" | "STACKED" | "GRID";
      };
    } | null;
  }
}

/*
  pgTableHijack is a function which is responsible for using my schema instead of nextauth default schema.
  ? source: https://github.com/nextauthjs/next-auth/discussions/7005#discussioncomment-7276938
*/
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const pgTableHijack: PgTableFn = (name, columns, extraConfig) => {
  switch (name) {
    case "user":
      return users;
    case "follow":
      return follow;
    case "account":
      return accounts;
    case "session":
      return sessions;
    case "handles":
      return handles;
    case "customTabs":
      return customTabs;
    case "tags":
      return tags;
    case "tags_to_users":
      return tagsToUsers;
    case "tags_to_articles":
      return tagsToArticles;
    case "comments":
      return comments;
    case "likes_to_comments":
      return likesToComment;
    case "articles":
      return articles;
    case "likes_to_articles":
      return likesToArticles;
    case "readers_to_articles":
      return readersToArticles;
    case "stripeEvents":
      return stripeEvents;
    case "series":
      return series;
    case "notifications":
      return notifications;
    case "verificationTokens":
      return verificationTokens;
    default:
      // Type assertion is required due to Drizzle/NextAuth adapter mismatch
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return pgTable(name, columns as any, extraConfig as any);
  }
};

// Create an extended adapter that handles account linking better
function customizeAdapter(adapter: Adapter): Adapter {
  return {
    ...adapter,
    // Override the linkAccount method to handle the constraint errors
    linkAccount: async (account: any) => {
      try {
        // First try to find if this exact provider account already exists
        const existingAccount = await db.query.accounts.findFirst({
          where: and(
            eq(accounts.provider, account.provider),
            eq(accounts.providerAccountId, account.providerAccountId)
          )
        });

        if (existingAccount) {
          // If it exists, return it with the expected format
          // The existingAccount from the database doesn't have an 'id' property
          // so we just need to return the account with the correct userId
          return {
            ...account,
            userId: existingAccount.userId,
          } as any;
        }

        // If not, create the account normally
        if (adapter.linkAccount) {
          const result = await adapter.linkAccount(account);
          return result;
        }
        // Cast to the expected return type to fix type mismatch
        return account as any;
      } catch (error) {
        console.error("Error in custom linkAccount:", error);
        // Return the account object to prevent the authentication flow from breaking
        return account as any;
      }
    },
    // Make sure getUserByEmail behaves correctly
    getUserByEmail: async (email) => {
      if (!email) return null;
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      // Cast to AdapterUser to fix type mismatch
      return dbUser ? { ...dbUser, image: dbUser.image ?? "" } as any : null;
    }
  };
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    // Handle sign-in specifically for email linking cases
    signIn: async ({ user, account, profile, email }) => {
      // If we have an account and user ID, ensure they're linked correctly
      if (account && user?.email) {
        try {
          // Check if a user with this email already exists
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, user.email),
            columns: {
              id: true,
              email: true,
            },
          });

          if (existingUser) {
            // If user exists with this email but different ID, force update their account
            if (existingUser.id !== user.id) {
              console.log(`Handling account linking for email: ${user.email}`);
              
              // Look for any existing accounts for this provider and providerAccountId
              const existingAccount = await db.query.accounts.findFirst({
                where: and(
                  eq(accounts.provider, account.provider),
                  eq(accounts.providerAccountId, account.providerAccountId)
                ),
              });

              // If no existing account, create one linked to the existing user
              if (!existingAccount) {
                await db.insert(accounts).values({
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type as "oauth" | "email" | "oidc", // Cast to expected type
                  userId: existingUser.id,
                  // Add other relevant account fields
                  token_type: account.token_type ?? null,
                  id_token: account.id_token ?? null,
                  access_token: account.access_token ?? null,
                  refresh_token: account.refresh_token ?? null,
                  expires_at: account.expires_at ?? null,
                  scope: account.scope ?? null,
                  session_state: account.session_state ?? null,
                });
              }

              // Return the existing user's ID to use for the session
              return true;
            }
          }
          
          // If this sign-in includes role information, update the user's role
          if (account.state) {
            try {
              const parsedState = JSON.parse(account.state as string);
              if (parsedState?.role) {
                await db
                  .update(users)
                  .set({ role: parsedState.role })
                  .where(eq(users.id, user.id));
              }
            } catch (error) {
              console.error("Failed to parse state or update role:", error);
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      
      // Allow sign in
      return true;
    },
    
    session: async ({ session, token }) => {
      if (token) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.sub as string),
        });

        if (!dbUser) return session;

        const handle = await db.query.handles.findFirst({
          where: eq(handles.userId, dbUser.id),
          columns: {
            id: true,
            handle: true,
            name: true,
            social: true,
            about: true,
            appearance: true,
          },
        });

        return {
          ...session,
          user: {
            id: dbUser.id,
            name: dbUser.name,
            username: dbUser.username,
            email: dbUser.email,
            image: dbUser.image,
            emailVerified: dbUser.emailVerified,
            tagline: dbUser.tagline,
            role: dbUser.role,
            handle: handle,
            verified: dbUser.verified ?? false,
            stripeSubscriptionStatus: dbUser.stripeSubscriptionStatus,
          },
        };
      }
      return session;
    },
    
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.role;
      }

      if (account?.state) {
        try {
          const parsedState = JSON.parse(account.state as string);
          if (parsedState?.role && token.sub) {
            token.role = parsedState.role;
          }
        } catch (error) {
          console.error("Failed to parse state:", error);
        }
      }
      
      return token;
    },
    
    redirect({ url, baseUrl }) {
      // Always redirect to home after sign-in
      return baseUrl;
    }
  },
  
  // Use JWT for session management
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Use standard adapter but with our custom adapter modifications applied
  adapter: customizeAdapter(DrizzleAdapter(db, pgTableHijack as unknown as any) as Adapter),
  
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // Critical setting to allow same email across providers
      allowDangerousEmailAccountLinking: true,

      profile(profile: GoogleProfile): User {
        // Generate username from profile name - cannot use await directly in this function
        // Using synchronous code and falling back to unique suffix generation
        const slug = slugify(profile.name, {
          ...slugSetting,
          replacement: "_",
        });
        
        return {
          id: profile.sub,
          name: profile.name,
          // Use a simpler username generation that doesn't require async DB check
          username: `${slug}_${profile.sub.substring(0, 5)}`,
          email: profile.email,
          image: profile.picture,
          role: "user", // Default role, will be updated in signIn callback if needed
          stripeSubscriptionStatus: "incomplete",
          emailVerified: profile.email_verified ? new Date() : null,
          tagline: "Software Developer",
        };
      },
    }),
  ],
  
  // Make sure to include the error page to handle errors
  pages: {
    signIn: "/onboard",
    error: "/onboard", // Redirect to onboard page on error
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *import { db } from '~/server/db';

 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
