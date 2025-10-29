# CrossField

CrossField is a Next.js application that curates collaboration opportunities, original posts, and news written by the CrossField team. Visitors can explore collaborations, submit new requests for review, catch up on news, and subscribe for updates. An admin-only space provides moderation tools and content management.

## Tech Stack

- [Next.js 14](https://nextjs.org/) with the App Router and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://www.prisma.io/) ORM with SQLite for local development (PostgreSQL in production)
- [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) for simple credential authentication

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file from the provided template:

   ```bash
   cp .env.example .env
   ```

   Update the values as needed. A SQLite database is configured by default. Supply the admin credentials:

   - `ADMIN_USERNAME` – defaults to `Admin`
   - `ADMIN_PASSWORD_HASH` – bcrypt hash of the admin password
   - `ADMIN_JWT_SECRET` – a random string used to sign the admin session cookie

   To generate a bcrypt hash for the default password `Team11**` (or any other value), run:

   ```bash
   node scripts/generate-admin-hash.js "Team11**"
   ```

3. **Prepare the database**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to explore the experience. Use `/admin/login` for the admin tools.

## Features

- **Marketing site** with a hero experience, curated posts, and recent news
- **Collaborations index** featuring filters, status-aware cards, and pagination
- **Collaboration submission** form with client/server validation and review workflow
- **News publishing** with individual article pages rendered from Markdown
- **Email capture** modal with duplicate protection and CSV export
- **Admin dashboard** with moderation queues, CRUD tooling for posts/news, and subscriber management

## Scripts

- `npm run dev` – start the Next.js development server
- `npm run build` – create a production build
- `npm run start` – run the production server
- `npm run lint` – run Next.js linting
- `npm run prisma:migrate` – run Prisma migrations in development
- `npm run prisma:generate` – regenerate Prisma client

## Deployment Notes

- Update `DATABASE_URL` to point at your production PostgreSQL instance.
- Keep `ADMIN_JWT_SECRET` strong and private.
- Set `ADMIN_PASSWORD_HASH` from the generated script output.

Enjoy curating collaborations with CrossField!
