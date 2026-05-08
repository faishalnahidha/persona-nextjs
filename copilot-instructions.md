# Persona NextJS - Copilot Instructions

This is a **Next.js 16 personality assessment application** using MongoDB, TypeScript, and Tailwind CSS. See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed directory layout.

## Quick Start

### Environment Setup

Add `.env.local` at project root (required):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/persona-db
NEXTAUTH_SECRET=generate-random-string
NEXTAUTH_URL=http://localhost:3000
```

### Build & Run

- **Dev**: `npm run dev` → runs on `http://localhost:3000`
- **Build**: `npm run build`
- **Start**: `npm start` (production)
- **Lint**: `npm run lint`
- **Seed DB**: `npx tsx scripts/seed-assessment.ts` (loads test data)

## Architecture

### Core Domain: MBTI Personality Assessment

- **Flow**: Guest enters name/DOB → answers 70 questions (4 dimensions) → system scores → results saved
- **Scoring**: `Assessment.calculateResult()` (static method in [src/lib/db/models/Assessment.ts](src/lib/db/models/Assessment.ts)) calculates letter frequencies per dimension (0-100%)
- **Data Models**: Assessment (questions), User (guest/registered), Result (scores), Content (articles)
- **Key Files**:
  - Submission: [src/app/api/assessment/submit/route.ts](src/app/api/assessment/submit/route.ts)
  - UI: [src/app/(public)/assessment/[slug]/AssessmentClient.tsx](<src/app/(public)/assessment/[slug]/AssessmentClient.tsx>)

### App Router & Layering

- **Route Groups**: `(public)`, `(protected)`, `(auth)`, `admin/` for logical organization
- **Server/Client Split**:
  - Server: RSC fetches/validates data, serializes to client (use `.lean()` for JSON perf)
  - Client: React hooks, vanilla `fetch()`, minimal state management
  - No Redux—just component state + `sessionStorage` for persistence
- **API Pattern**: Connect DB → validate → model ops → JSON response (see submit route)

### Database

- **Connection**: Singleton pattern in [src/lib/db/mongodb.ts](src/lib/db/mongodb.ts) with global caching
- **Models**: Mongoose schemas in [src/lib/db/models/](src/lib/db/models/)
  - `Assessment`: Questions + metadata + static `calculateResult()`
  - `User`: Guest + registered users (unified, awardPoints method pre-built)
  - `Result`: Stores test results (only 1 active per user via `getActiveResult()`)
  - `Content`: Articles linked to personality types

### UI Framework

- **Shadcn/UI + Radix**: Primitive components in [src/components/ui/](src/components/ui/)
- **Styling**: Tailwind CSS 4 (PostCSS config at [postcss.config.mjs](postcss.config.mjs))
- **Icons**: Tabler Icons React + Lucide React
- **Forms**: React Hook Form + Zod validation

## Development Conventions

### Naming & Organization

- Route groups use parentheses: `(public)`, `(auth)`, `(protected)`
- Dynamic routes use `[param]` (e.g., `[slug]`, `[id]`)
- Client components marked with `'use client'` at top
- Utility functions in `src/lib/` organized by domain: `db/`, `auth/`, `constants/`

### Frontend Styling & Components

- **Tailwind CSS Only**: Use Tailwind utility classes exclusively for layout and spacing; no custom CSS files or inline styles
- **Shadcn/UI First**: Use Shadcn components for all interactive elements (Button, Card, Input, Form, etc.)
  - Before using: verify installed with `npx shadcn@latest list`
  - Install missing: `npx shadcn@latest add [component-name]`
  - Import: `@/components/ui/[component-name]`
  - Use built-in variants; extend in component files if needed
- **Icons**: '@tabler/icons-react' primary, 'lucide-react' fallback
- **Typography & Theme**: Apply globals.css design tokens and Tailwind semantic colors
- **Responsive Design**: Use Tailwind breakpoints (sm, md, lg, xl, 2xl)

### React & Next.js

- **Prefer Server Components**: Only use `'use client'` when interactivity or hooks are required
- **Route Group Pattern**: Organize with `(public)`, `(protected)`, `(auth)`, `admin/` groups
- **Form Handling**: React Hook Form + Zod validation on client and server
- **Server vs Client**: RSC handles data fetching/validation; pass serialized data to client components

### TypeScript & Type Safety

- Strict TSConfig enabled
- Mongoose models define shape at DB layer
- API responses typed via TypeScript interfaces (not just Zod)
- No `any` types—infer or define explicitly
- For complex layouts, prioritize CSS Grid/Flexbox

### Database Queries

- Always connect via `connectDB()` in API routes (idempotent)
- Use `.lean()` when serializing to JSON for performance
- Model methods kept static where possible (e.g., `Assessment.calculateResult()`)
- Store guest/temporary state in `sessionStorage` for form persistence

### Error Handling

- Add error.tsx files in route groups for graceful error UI
- API routes: Validate input with Zod; respond with `{ error: string }` on failure
- Client components: try/catch for fetch calls; display user-friendly error messages
- Database: Handle connection errors gracefully

### Design-to-Code (Penpot)

- When provided a Penpot URL, use Penpot MCP tools to inspect design before coding
- Extract design tokens (colors, spacing, typography) and map to globals.css or Tailwind
- Don't hallucinate properties—ask if Penpot value is missing

### Coding Standards: DO NOT

- Add comments explaining obvious code
- Add unrequested features
- Use external libraries beyond: Next.js, Tailwind, Shadcn, Tabler Icons, Lucide React, React Hook Form, Zod
- Use raw hex codes or pixel measurements for styling
- Create additional components unless explicitly requested

### Common Patterns: When Adding Features

| Task                     | Example                                                       |
| ------------------------ | ------------------------------------------------------------- |
| **New question set**     | Add to Assessment model, update calculateResult() logic       |
| **Store guest data**     | Use Result model with User ref, sessionStorage for form state |
| **New personality type** | Extend scoring dimensions in Assessment model                 |
| **Protected page**       | Create in `(protected)/` route group (auth middleware TBD)    |
| **Admin panel**          | Add under `admin/` route group (auth TBD)                     |

## Known Limitations & TODOs

- **Auth incomplete**: NextAuth scaffolding exists but not configured—login/register pages designed but non-functional
- **Session state fragile**: `sessionStorage` only survives tab—consider IndexedDB/cookies for persistence
- **Points system ready**: Code exists in User model but commented out in submit route
- **No error boundaries**: Add error.tsx files to route groups for graceful failures
- **Question counts**: Hardcoded to {EI:10, SN:20, TF:20, JP:20} (line 216 in Assessment model)

## Helpful Scripts

- `scripts/seed-assessment.ts`: Seeds questions + content to DB
- `scripts/question-data.json`: MBTI question bank (imported by seed script)
- `scripts/debug-env.ts`: Test environment variables

## Code Quality

- ESLint config at [eslint.config.mjs](eslint.config.mjs)—run `npm run lint` before commits
- Component variants managed via `class-variance-authority` (CVA)
- CSS utilities via `tailwind-merge` + `clsx` for safe class merging

## Dependency Notes

- **Mongoose 9.1.3**: Ensure MONGODB_URI includes auth if DB requires credentials
- **NextAuth 5.0.0-beta (pre-release)**: May have breaking changes before stable release
- **React 19.2.3**: Supports async components and transitions (not fully leveraged yet)

## AI Agent Notes

When implementing features, prioritize:

1. Update DB model + static methods first (domain logic)
2. Add API route for data operations
3. Create Server Component to fetch
4. Add Client Component for interactivity
5. Update types in `src/types/` if adding new domains
