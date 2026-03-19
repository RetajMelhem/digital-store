# Digital Store

A bilingual digital storefront built with Next.js, Tailwind CSS, Prisma, and PostgreSQL. The project is designed for selling digital products with Arabic and English support, a streamlined checkout flow, order tracking, review moderation, and a protected admin area.

## Overview

This application provides a lightweight e-commerce workflow for digital products such as subscriptions, private account delivery, and customer-account activation services. It focuses on a simple purchase experience, localized content, and practical store management tools.

## Features

- Arabic and English storefront with localized content
- Product catalog with categories, pricing, and delivery types
- Cart and checkout flow optimized for digital orders
- Order creation with phone-based customer details
- WhatsApp payment follow-up link generation
- Admin dashboard for products, orders, and reviews
- Review moderation workflow
- Basic rate limiting for order submission and admin login
- Prisma-based PostgreSQL data layer

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod

## Project Structure

```text
app/          App Router pages, API routes, and admin screens
components/   Reusable UI components
lib/          Shared utilities, validation, auth, and constants
prisma/       Prisma schema, migrations, and seed script
public/       Static assets
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- PostgreSQL database

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Update the environment variables in `.env`.

4. Generate the Prisma client:

```bash
npm run prisma:generate
```

5. Apply database migrations:

```bash
npm run prisma:migrate
```

6. Seed the database with sample products and reviews:

```bash
npm run prisma:seed
```

7. Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Use the following variables in your `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/digital_store?schema=public"
ADMIN_PASSWORD="change-this-password"
ADMIN_SESSION_SECRET="replace-with-a-long-random-secret"
CLIQ_PHONE="your-cliq-number"
WHATSAPP_PHONE="your-whatsapp-number"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DEFAULT_LOCALE="ar"
RATE_LIMIT_WINDOW_MS="60000"
RATE_LIMIT_MAX_REQUESTS="5"
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Database Models

The core schema includes:

- `Product` for catalog entries
- `Order` for customer purchases
- `OrderItem` for product line items
- `Review` for product reviews and moderation
- `OrderStatusEvent` for order history tracking

## Admin Area

The project includes a protected admin interface for:

- Managing products
- Reviewing recent orders
- Updating order status
- Moderating reviews

For production use, make sure you set a strong `ADMIN_PASSWORD` and a long random `ADMIN_SESSION_SECRET`.

## Deployment Notes

- Configure all environment variables in your hosting platform
- Use a production PostgreSQL database
- Run Prisma migrations during deployment
- Do not commit your real `.env` file
- Replace example values with real production credentials before deploying

The project includes a `vercel-build` script for environments that need Prisma generation, migration deployment, and a production build in one step.

## Security Notes

- Never publish real secrets in `.env.example`
- Use a unique, high-entropy session secret in production
- Treat example phone numbers and payment contact details as placeholders
- Review the repository history before making the project public to ensure no previous secrets were committed

## License

This project is provided as-is. Add a license if you plan to distribute or open-source it publicly.
