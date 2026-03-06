# Project Structure

## Overview
Next.js 16 application for personality assessment with MongoDB integration.

## Directory Structure

```
src/
├── app/                          # Next.js App Router directory
│   ├── (public)/                 # Route group (public routes)
│   │   └── assessment/
│   │       └── [id]/             # Dynamic route segment
│   │           ├── page.tsx      # Assessment page
│   │           ├── AssessmentClient.tsx
│   │           └── result/
│   │               └── [resultId]/
│   │                   ├── page.tsx
│   │                   └── ResultClient.tsx
│   ├── api/                      # API routes
│   │   ├── assessment/
│   │   │   └── submit/
│   │   │       └── route.ts      # Assessment submission endpoint
│   │   └── test-db/
│   │       └── route.ts          # Database test endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Home page
│
├── components/                   # React components
│   └── ui/                       # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── table.tsx
│
└── lib/                          # Utility libraries
    ├── constants/
    │   └── points.ts             # Points/constants configuration
    ├── db/                       # Database related code
    │   ├── models/               # Mongoose models
    │   │   ├── Assessment.ts
    │   │   ├── Content.ts
    │   │   ├── Result.ts
    │   │   └── User.ts
    │   └── mongodb.ts            # MongoDB connection utility
    ├── fonts.ts                  # Font configuration
    └── utils.ts                  # General utility functions
```

## Key Files

### App Router (`src/app/`)
- **`layout.tsx`**: Root layout with metadata and global styles
- **`page.tsx`**: Home page component
- **`globals.css`**: Global CSS styles and Tailwind configuration

### Public Routes (`src/app/(public)/assessment/`)
- **`[id]/page.tsx`**: Dynamic assessment page
- **`[id]/AssessmentClient.tsx`**: Client component for assessment interaction
- **`[id]/result/[resultId]/page.tsx`**: Result display page
- **`[id]/result/[resultId]/ResultClient.tsx`**: Client component for result display

### API Routes (`src/app/api/`)
- **`assessment/submit/route.ts`**: Handles assessment submission
- **`test-db/route.ts`**: Database connection testing endpoint

### Components (`src/components/ui/`)
Shadcn UI components:
- Button, Card, Form, Input, Label, Table

### Database (`src/lib/db/`)
- **`mongodb.ts`**: MongoDB connection setup
- **Models**:
  - `Assessment.ts`: Assessment data model
  - `Content.ts`: Content data model
  - `Result.ts`: Result data model
  - `User.ts`: User data model

### Utilities (`src/lib/`)
- **`fonts.ts`**: Font loading configuration (Readex Pro, Open Sans, Arvo, Geist Mono)
- **`utils.ts`**: General utility functions
- **`constants/points.ts`**: Points/constants configuration

## Technology Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **Database**: MongoDB (Mongoose 9.1.3)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI, Radix UI
- **Icons**: Tabler Icons React
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js 5.0.0-beta.30
