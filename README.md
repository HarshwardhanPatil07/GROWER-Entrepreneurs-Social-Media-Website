# GROWER-Entrepreneurs-Social-Media-Website

🚀 **Status**: Deployment Ready - Dependencies Resolved

A modern social media platform for entrepreneurs built with Next.js, TypeScript, Tailwind CSS, Drizzle ORM, tRPC, and more.

## Prerequisites

- Node.js (>= 18.x)
- npm (>= 9.x) or Yarn
- (Optional) Docker (for running a local PostgreSQL instance)

## Getting Started

1. Clone the repository
   ```powershell
   git clone https://github.com/your-org/GROWER-Entrepreneurs-Social-Media-Website.git
   cd GROWER-Entrepreneurs-Social-Media-Website
   ```

2. Install dependencies
   ```powershell
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the project root and add the following variables:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/mydb
   NODE_ENV=development
   NEXTAUTH_SECRET=your-nextauth-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   UPLOADTHING_SECRET=your-uploadthing-secret
   STRIPE_PK=your-stripe-publishable-key
   STRIPE_SK=your-stripe-secret-key
   STRIPE_PRICE_ID=your-stripe-price-id
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   USER=your-email-user
   PASS=your-email-password
   TO=recipient-email-address
   NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
   NEXT_PUBLIC_GENERATIVE_AI_KEY=your-generative-ai-key
   ```

## Available Scripts

Use PowerShell (Windows) or your preferred shell to run the following commands:

- **Development**
  ```powershell
  npm run dev       # or yarn dev
  ```
  Starts the development server at http://localhost:3000

- **Production Development**
  ```powershell
  npm run dev-prod  # or yarn dev-prod
  ```
  Runs development with `.env.production` settings

- **Build**
  ```powershell
  npm run build     # or yarn build
  ```
  Builds the application for production

- **Start**
  ```powershell
  npm run start     # or yarn start
  ```
  Starts the production server

- **Drizzle ORM**
  ```powershell
  npm run db:generate   # generate migration files
  npm run db:push       # push migrations to the database
  npm run db:studio     # open Drizzle Studio at http://localhost:5000
  npm run db:dev        # generate, push, and open studio
  ```

## Environment Variables Reference

All required environment variables are defined in `src/env.mjs`. Refer to that file for details on each variable and adjust as needed.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes and enhancements.

## License

[MIT](https://opensource.org/licenses/MIT)