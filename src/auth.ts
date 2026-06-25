import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({
          email: String(credentials.email).toLowerCase(),
          userType: 'registered',
        });

        if (!user) return null;

        const isValid = await user.comparePassword(String(credentials.password));
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.profilePicture ?? null,
          role: user.role,
          personalityType: user.personalityType ?? null,
        };
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;

      await connectDB();

      const email = user.email?.toLowerCase();
      if (!email) return false;

      let dbUser = await User.findOne({ email, userType: 'registered' });

      if (!dbUser) {
        // Generate a unique username from the Google display name
        const baseUsername = (user.name ?? email.split('@')[0])
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '')
          .slice(0, 20);

        let username = baseUsername;
        let suffix = 1;
        while (await User.findOne({ username })) {
          username = `${baseUsername}_${suffix++}`;
        }

        dbUser = await User.create({
          userType: 'registered',
          email,
          googleId: account.providerAccountId,
          name: user.name ?? email,
          username,
          profilePicture: user.image ?? undefined,
          role: 'user',
        });
      } else if (!dbUser.googleId) {
        dbUser.googleId = account.providerAccountId;
        await dbUser.save();
      }

      // Attach DB id so jwt callback can read it
      user.id = dbUser._id.toString();
      (user as Record<string, unknown>).role = dbUser.role;
      (user as Record<string, unknown>).personalityType = dbUser.personalityType ?? null;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Record<string, unknown>).role as string;
        token.personalityType = (user as Record<string, unknown>).personalityType as string | null;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.personalityType = (token.personalityType as string | null) ?? undefined;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: { strategy: 'jwt' },
});
