# Persona Test NEXT

Indonesian web app for a free online MBTI personality test and career self-discovery. _Kenali diri untuk temukan pekerjaan terbaik_: take the test, see your type, then use personality guides to find a better career fit.

This project is a revamp and remake of the previous site [test.persona.my.id](https://test.persona.my.id), rebuilt with Next.js and Tailwind CSS.

## Current state

The public test path works end to end. Content, points, and a logged-in home are modeled but not shipped as pages.

**Working**

- Home page with a guest form (name, date of birth, gender) that starts the test at `/assessment/mbti-v1`
- Published assessment loaded from MongoDB: 70 forced-choice questions across Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving
- Scoring that returns percentages per trait, a primary type (for example `INFJ`), and up to two alternative types when a dimension is close
- Result page with the type name, Keirsey-style group (SJ, NT, NF, SP), and score bars
- Guest user and result saved in MongoDB on submit
- Accounts with email and password, plus Google sign-in (Auth.js). Registration can attach an existing guest result to the new account
- Header shows the session and can sign out. Middleware sends unauthenticated visits to `/dashboard` toward `/login`

**Not built yet**

- Article, blog, and book pages. Header links are anchors only. The `Content` model and read-progress fields exist
- Dashboard and any other signed-in area beyond the login redirect
- Admin tools for assessments or articles
- Points. The user model can award them; the submit route does not call that yet
- The home-page “Login” control still points at `#login` instead of `/login`

## Tech Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- MongoDB with Mongoose
- Auth.js 5 (credentials and Google, JWT sessions)
- Tailwind CSS 4 and shadcn/ui
- React Hook Form and Zod
