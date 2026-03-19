# LMS Backend Setup Instructions

The backend application has been fully scaffolding following a strict Modular/MVC layout, using Express, Node.js, and Prisma ORM. 

## Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database (running locally or via Docker)

## Setup Steps

1. **Environment Variables**: A `.env.example` file has been provided in the root directory. Run the following command or explicitly rename the file to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Modify the `DATABASE_URL` line inside the `.env` file to point to your live PostgreSQL database instance.*

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Database Migration Pipeline**:
   Since the schema has been prepared, push your schema directly to your Postgres database using Prisma:
   ```bash
   npx prisma db push
   ```
   *Note: This avoids creating formal migration `.sql` files for local dev speed. To properly create migration files, use `npx prisma migrate dev`.*

4. **Seed Database**:
   Populate the database with the dummy data requested (1 admin, 2 students, courses, 3 lessons, 2 exams):
   ```bash
   npm run seed
   ```

5. **Start Dev Server**:
   Boots up Nodemon targeting `src/server.js`:
   ```bash
   npm run dev
   ```

## API Highlights
- `GET /auth/google` (Sign-in using browser)
- `GET /users` (Fetch Admin users)
- `GET /lessons/:courseId` (Displays sequentially unlocked lessons based on `userId`)
- `GET /exams/:courseId` (Displays sequentially unlocked exams based on `userId`)
- `GET /progress/:userId` (Completion metric tracker)
