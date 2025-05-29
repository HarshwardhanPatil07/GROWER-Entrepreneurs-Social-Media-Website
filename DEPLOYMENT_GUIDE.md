# Production Environment Variables for Vercel Deployment
# Copy these to your Vercel project settings > Environment Variables
# Replace placeholder values with your actual credentials

# Database
DATABASE_URL=your_neon_database_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# AI
NEXT_PUBLIC_GENERATIVE_AI_KEY=your_google_ai_api_key

# Stripe Payment (use your actual keys)
STRIPE_PK=pk_test_your_stripe_publishable_key
STRIPE_SK=sk_test_your_stripe_secret_key
STRIPE_PRICE_ID=price_your_stripe_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# UploadThing
UPLOADTHING_SECRET=sk_live_your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# URLs
NEXT_PUBLIC_VERCEL_URL=https://your-vercel-domain.vercel.app

# OAuth Providers (use your actual credentials)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (if using NodeMailer)
TO=your_email@example.com
USER=your_name
PASS=your_email_password

# IMPORTANT NOTES:
# 1. Replace all placeholder values with your actual credentials
# 2. Update OAuth callback URLs in Google Console and GitHub settings
# 3. Consider using production Stripe keys for live deployment
# 4. Ensure database is accessible from Vercel's IP ranges
