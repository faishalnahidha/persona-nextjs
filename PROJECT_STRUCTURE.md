# Project Structure

## Overview
Next.js 16 application for personality assessment with MongoDB integration.

## Directory Structure

```
persona-nextjs/
├── public/                           # Static assets
│   ├── images/
│   │   ├── avatar-tp/                # MBTI type avatar images (.webp)
│   │   │   └── avatar-tp-{type}.webp # (enfp, entj, esfp, isfj, ...)
│   │   └── illustration/             # MBTI personality SVG illustrations
│   │       ├── svg-{type}.svg        # Full illustrations (all 16 types)
│   │       ├── svg-thumbnail-{type}.svg
│   │       └── svg-withframe-{type}.svg
│   └── logo-persona-full.svg
│
├── scripts/                          # Utility/seed scripts
│   ├── debug-env.ts                  # Environment variable debugger
│   ├── question-data.json            # Raw question data for seeding
│   └── seed-assessment.ts            # DB seed script for assessments
│
└── src/
    ├── app/                          # Next.js App Router directory
    │   ├── (auth)/                   # Route group (unauthenticated routes)
    │   │   ├── login/                # Login page (placeholder)
    │   │   └── register/             # Register page (placeholder)
    │   ├── (protected)/              # Route group (auth-required routes)
    │   │   ├── dashboard/            # Dashboard page (placeholder)
    │   │   └── profile/              # Profile page (placeholder)
    │   ├── (public)/                 # Route group (public routes)
    │   │   ├── assessment/
    │   │   │   └── [slug]/           # Dynamic route segment
    │   │   │       ├── page.tsx      # Assessment page
    │   │   │       ├── AssessmentClient.tsx
    │   │   │       ├── ScoreBadge.tsx
    │   │   │       └── result/
    │   │   │           └── [resultId]/
    │   │   │               ├── page.tsx
    │   │   │               └── ResultClient.tsx
    │   │   └── content/
    │   │       └── [slug]/           # Dynamic content page (placeholder)
    │   ├── admin/                    # Admin section (placeholders)
    │   │   ├── assessments/
    │   │   │   └── new/
    │   │   ├── content/
    │   │   │   └── new/
    │   │   └── users/
    │   ├── api/                      # API routes
    │   │   ├── assessment/
    │   │   │   ├── submit/
    │   │   │   │   └── route.ts      # Assessment submission endpoint
    │   │   │   └── [id]/             # Single assessment endpoint (placeholder)
    │   │   ├── auth/                 # Auth endpoint (placeholder)
    │   │   ├── content/
    │   │   │   └── [id]/             # Single content endpoint (placeholder)
    │   │   ├── test-db/
    │   │   │   └── route.ts          # Database test endpoint
    │   │   └── users/                # Users endpoint (placeholder)
    │   ├── globals.css               # Global styles
    │   ├── layout.tsx                # Root layout component
    │   └── page.tsx                  # Home page
    │
    ├── components/                   # React components
    │   ├── admin/                    # Admin-specific components (placeholder)
    │   ├── assessment/               # Assessment-specific components (placeholder)
    │   ├── content/                  # Content-specific components (placeholder)
    │   ├── layout/                   # Layout components (placeholder)
    │   ├── ui/                       # Shadcn UI components
    │   │   ├── accordion.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── drawer.tsx
    │   │   ├── field.tsx
    │   │   ├── form.tsx
    │   │   ├── input-group.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── popover.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   └── table.tsx
    │   ├── header.tsx                # Site-wide header component
    │   └── hero-form.tsx             # Hero section form component
    │
    ├── lib/                          # Utility libraries
    │   ├── auth/                     # Auth configuration (placeholder)
    │   ├── constants/
    │   │   ├── personality-groups.ts # MBTI group definitions
    │   │   ├── personality-names.ts  # MBTI type names/labels
    │   │   └── points.ts             # Scoring points configuration
    │   ├── db/                       # Database related code
    │   │   ├── models/               # Mongoose models
    │   │   │   ├── Assessment.ts
    │   │   │   ├── Content.ts
    │   │   │   ├── Result.ts
    │   │   │   └── User.ts
    │   │   └── mongodb.ts            # MongoDB connection utility
    │   ├── fonts.ts                  # Font configuration
    │   └── utils.ts                  # General utility functions
    │
    └── types/                        # TypeScript type definitions (placeholder)
```

## Key Files

### App Router (`src/app/`)
- **`layout.tsx`**: Root layout with metadata and global styles
- **`page.tsx`**: Home page component
- **`globals.css`**: Global CSS styles and Tailwind configuration

### Auth Routes (`src/app/(auth)/`)
Placeholder directories for login and register pages.

### Protected Routes (`src/app/(protected)/`)
Placeholder directories for authenticated-only pages (dashboard, profile).

### Public Routes (`src/app/(public)/`)
- **`assessment/[slug]/page.tsx`**: Dynamic assessment page
- **`assessment/[slug]/AssessmentClient.tsx`**: Client component for assessment interaction
- **`assessment/[slug]/ScoreBadge.tsx`**: Score badge display component
- **`assessment/[slug]/result/[resultId]/page.tsx`**: Result display page
- **`assessment/[slug]/result/[resultId]/ResultClient.tsx`**: Client component for result display
- **`content/[slug]/`**: Dynamic content/article page (placeholder)

### Admin Routes (`src/app/admin/`)
Placeholder section for admin management of assessments, content, and users.

### API Routes (`src/app/api/`)
- **`assessment/submit/route.ts`**: Handles assessment submission
- **`assessment/[id]/`**: Single assessment CRUD endpoint (placeholder)
- **`auth/`**: NextAuth.js handler (placeholder)
- **`content/[id]/`**: Single content CRUD endpoint (placeholder)
- **`test-db/route.ts`**: Database connection testing endpoint
- **`users/`**: User management endpoint (placeholder)

### Components (`src/components/`)
- **`header.tsx`**: Site-wide navigation header
- **`hero-form.tsx`**: Home page hero section with form
- **`ui/`**: Shadcn UI primitives — Accordion, Avatar, Badge, Button, Calendar, Card, Drawer, Field, Form, Input, InputGroup, Label, NavigationMenu, Popover, RadioGroup, Select, Separator, Table

### Database (`src/lib/db/`)
- **`mongodb.ts`**: MongoDB connection setup
- **Models**:
  - `Assessment.ts`: Assessment data model
  - `Content.ts`: Content data model
  - `Result.ts`: Result data model
  - `User.ts`: User data model

### Utilities (`src/lib/`)
- **`auth/`**: Auth configuration (placeholder)
- **`fonts.ts`**: Font loading configuration (Readex Pro, Open Sans, Arvo, Geist Mono)
- **`utils.ts`**: General utility functions
- **`constants/points.ts`**: Scoring points configuration
- **`constants/personality-groups.ts`**: MBTI personality group definitions
- **`constants/personality-names.ts`**: MBTI type name/label mappings

### Static Assets (`public/images/`)
- **`avatar-tp/`**: MBTI personality type avatar images (`.webp`)
- **`illustration/`**: 16 MBTI type SVG illustrations in three variants: default, thumbnail, and withframe
- **`logo-persona-full.svg`**: Full application logo

### Scripts (`scripts/`)
- **`seed-assessment.ts`**: Seeds assessment data into MongoDB
- **`question-data.json`**: Source question data for seeding
- **`debug-env.ts`**: Utility to debug environment variable loading

## Technology Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **Database**: MongoDB (Mongoose 9.1.3)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI, Radix UI
- **Icons**: Tabler Icons React
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js 5.0.0-beta.30
