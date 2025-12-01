# Deployment Guide for Vercel

This guide outlines the steps to deploy the `cloudinary-next` application to Vercel.

## Prerequisites

- A Vercel account (https://vercel.com/signup)
- A GitHub repository containing this project

## Environment Variables

The following environment variables are required for the application to function correctly. You will need to add these in the Vercel project settings under **Settings > Environment Variables**.

| Variable Name | Description |
| :--- | :--- |
| `DATABASE_URL` | Connection string for your PostgreSQL database (e.g., from Neon, Supabase, or Railway). |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name. |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Your Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret. |
| `NEXT_AUTH_SECRET` | A random string used to encrypt session data. You can generate one with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | The URL of your deployed application (e.g., `https://your-project.vercel.app`). |

## Deployment Steps

1.  **Push to GitHub**: Ensure your latest changes are pushed to your GitHub repository.
2.  **Import Project in Vercel**:
    - Go to your Vercel dashboard.
    - Click **Add New > Project**.
    - Select your GitHub repository.
3.  **Configure Project**:
    - **Framework Preset**: Next.js (should be detected automatically).
    - **Root Directory**: `./` (default).
    - **Build Command**: `prisma generate && next build` (or `npm run build` which runs this).
    - **Output Directory**: `.next` (default).
    - **Install Command**: `npm install` (default).
4.  **Add Environment Variables**:
    - Expand the **Environment Variables** section.
    - Add all the variables listed in the table above.
5.  **Deploy**:
    - Click **Deploy**.
    - Vercel will build and deploy your application.

## Post-Deployment

- **Database Migration**: If you are using a new database, you may need to run migrations. Since `prisma generate` is part of the build, the client will be generated, but you might need to run `npx prisma db push` or `npx prisma migrate deploy` from your local machine (connected to the production database) or via a Vercel build command override if you have a migration strategy.
    - *Recommendation*: Connect to your production database locally and run `npx prisma db push` to ensure the schema is up to date.

## Troubleshooting

- **Build Failures**: Check the "Build Logs" in Vercel for error messages. Common issues include missing environment variables or type errors.
- **Runtime Errors**: Check the "Runtime Logs" (Functions tab) if the application crashes after deployment.
