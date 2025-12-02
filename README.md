# Cloudinary Next.js E-commerce

A modern e-commerce application built with Next.js 15, Prisma, PostgreSQL, and Cloudinary. This project features a comprehensive admin dashboard for managing products, categories, orders, and store settings, as well as a customer-facing storefront.

## Features

### Admin Dashboard
-   **Product Management**: Create, read, update, and delete products with image uploads via Cloudinary.
-   **Category Management**: Organize products into categories with a dedicated management page.
-   **Order Management**: View and manage customer orders with status updates, filtering, and pagination.
-   **Banner Management**: Manage promotional banners for the storefront.
-   **Store Settings**: Configure store details like the store name.
-   **Authentication**: Secure admin access using NextAuth.js.

### Storefront
-   **Product Browsing**: Browse products with category filtering and search functionality.
-   **Product Details**: View detailed product information and images.
-   **Shopping Cart**: Add products to cart (implementation details may vary).
-   **User Accounts**: Customer registration and login.

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Image Storage**: [Cloudinary](https://cloudinary.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   PostgreSQL database
-   Cloudinary account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd cloudinary-next
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

    # NextAuth
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-super-secret-key"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME="your-cloud-name"
    CLOUDINARY_API_KEY="your-api-key"
    CLOUDINARY_API_SECRET="your-api-secret"
    ```

4.  **Database Setup:**

    Run Prisma migrations to set up the database schema:

    ```bash
    npx prisma migrate dev
    ```

    (Optional) Seed the database with initial data:

    ```bash
    npm run seed
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router directory.
    -   `admin/`: Admin dashboard routes and components.
    -   `(auth)/`: Authentication routes (login, register).
    -   `(customer)/`: Customer-facing storefront routes.
    -   `api/`: API routes.
-   `components/`: Reusable UI components.
-   `lib/`: Utility functions and configurations (Prisma, Cloudinary, Auth).
-   `prisma/`: Prisma schema and seed scripts.

## Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm start`: Starts the production server.
-   `npm run lint`: Runs ESLint.
-   `npm run seed`: Seeds the database.

## License

[MIT](LICENSE)
