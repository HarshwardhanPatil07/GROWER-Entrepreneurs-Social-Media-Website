// filepath: d:\VIT\Grower\src\server\db\schema\investments.ts
import { relations, sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { articles } from "./articles";
import { users } from "./users";

// Investment status options
export const investmentStatusEnum = pgEnum("investment_status", [
  "pending",
  "accepted",
  "declined",
  "completed"
]);

// Investments table - stores investment proposals from investors
export const investments = pgTable(
  "investments",
  {
    id: text("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    
    // Reference to the investor
    investorId: text("investor_id")
      .references(() => users.id)
      .notNull(),
    
    // Reference to the idea/article
    ideaId: text("idea_id")
      .references(() => articles.id)
      .notNull(),
    
    // Reference to the startup founder
    founderId: text("founder_id")
      .references(() => users.id)
      .notNull(),
    
    // Investment details
    amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
    equityPercentage: decimal("equity_percentage", { precision: 5, scale: 2 }).notNull(),
    message: text("message"),
    status: investmentStatusEnum("status").default("pending").notNull(),
    
    // Contract details (for accepted/completed investments)
    contractDetails: text("contract_details"),
    
    // Timestamps
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    
    // When the investment was accepted/declined
    respondedAt: timestamp("responded_at", { mode: "date" }),
    
    // When the investment was completed (funds transferred)
    completedAt: timestamp("completed_at", { mode: "date" }),
  },
  (investments) => ({
    investorIdIdx: index("investor_id_idx").on(investments.investorId),
    ideaIdIdx: index("idea_id_idx").on(investments.ideaId),
    founderIdIdx: index("founder_id_idx").on(investments.founderId),
  }),
);

// Define relationships
export const investmentsRelations = relations(investments, ({ one }) => ({
  investor: one(users, {
    fields: [investments.investorId],
    references: [users.id],
    relationName: "investor_investments",
  }),
  idea: one(articles, {
    fields: [investments.ideaId],
    references: [articles.id],
    relationName: "idea_investments",
  }),
  founder: one(users, {
    fields: [investments.founderId],
    references: [users.id],
    relationName: "founder_investments",
  }),
}));

// Update user relations
export const usersInvestmentsRelations = {
  investorInvestments: {
    relationName: "investor_investments",
  },
  founderInvestments: {
    relationName: "founder_investments",
  },
};