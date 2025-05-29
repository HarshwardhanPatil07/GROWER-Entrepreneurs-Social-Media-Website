import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "./db";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "./auth";
import { verificationDocuments } from "./db/schema/verifications";

// Create a new UploadThing instance
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB" } }).onUploadComplete(() => {
    console.log("Upload Complete");
  }),

  // New route for verification documents
  verificationDocuments: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "8MB", maxFileCount: 5 }, 
  })
    .middleware(async ({ req }) => {
      // Authenticate user
      const session = await getServerSession(authOptions);
      
      // Check if user is authenticated
      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      // Check if the user has the startup role to upload verification docs
      if (session.user.role !== "startup") {
        throw new UploadThingError("Only startup users can submit verification documents");
      }

      // Return user ID to be used in onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Determine file content type based on extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const contentType = 
        fileExtension === 'pdf' ? 'application/pdf' :
        fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg' :
        fileExtension === 'png' ? 'image/png' :
        fileExtension === 'gif' ? 'image/gif' :
        'application/octet-stream';

      // Store the uploaded file reference in the database
      const [document] = await db
        .insert(verificationDocuments)
        .values({
          userId: metadata.userId,
          documentType: file.name.toLowerCase().includes("dpiit") 
            ? "dpiit" 
            : file.name.toLowerCase().includes("gstin") || file.name.toLowerCase().includes("gst")
            ? "gstin"
            : file.name.toLowerCase().includes("pan")
            ? "panCard"
            : file.name.toLowerCase().includes("aadhaar") || file.name.toLowerCase().includes("aadhar")
            ? "aadhaar"
            : "otherDoc",
          documentUrl: file.url,
          documentKey: file.key,
          fileSize: file.size.toString(),
          fileName: file.name,
          contentType: contentType, // Using determined content type instead of non-existent mime property
        })
        .returning();

      if (document) {
        return {
          documentId: document.id,
          url: file.url
        };
      }
      
      return {
        url: file.url
      };
    }),
} satisfies FileRouter;

// Export as ourFileRouter to match the import in the API route
export const ourFileRouter = fileRouter;

export type OurFileRouter = typeof fileRouter;

// Export utapi instance that provides the right methods
export const utapi = createUploadthing();
