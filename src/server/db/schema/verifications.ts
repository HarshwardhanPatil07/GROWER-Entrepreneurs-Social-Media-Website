import { 
    pgTable, 
    serial, 
    text, 
    timestamp, 
    boolean,
    json,
    pgEnum,
    uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Verification status enumeration
export const verificationStatusEnum = pgEnum("verification_status", [
    "pending", 
    "approved", 
    "rejected"
]);

// Document types enumeration
export const documentTypeEnum = pgEnum("document_type", [
    // Startup documents
    "dpiit", 
    "gstin", 
    "panCard", 
    "aadhaar", 
    "otherDoc",
    
    // Investor documents
    "bankStatement",
    "investorProof"
]);

// Verification documents - stores references to uploaded documents
export const verificationDocuments = pgTable("verification_documents", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    documentType: documentTypeEnum("document_type").notNull(),
    documentUrl: text("document_url").notNull(),
    documentKey: text("document_key").notNull(), // Storage path/key
    uploadedAt: timestamp("uploaded_at").defaultNow(),
    fileSize: text("file_size"), // Size of the file
    fileName: text("file_name"), // Original file name
    contentType: text("content_type"), // MIME type
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Verification requests - tracks each verification request by a startup
export const verificationRequests = pgTable("verification_requests", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    status: verificationStatusEnum("status").default("pending"),
    requestedAt: timestamp("requested_at").defaultNow(),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by"), // Admin ID who reviewed
    notes: text("notes"),
    documents: json("documents"), // IDs of associated documents
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});