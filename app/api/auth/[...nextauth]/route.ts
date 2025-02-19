import NextAuth from "next-auth";
import User from "@/app/models/user";
import connectToDB from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Github({
      clientId: process.env.GIT_CLIENT_ID || "",
      clientSecret: process.env.GIT_SECRET_ID || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_SECRET_ID || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Ensure database connection is made
          await connectToDB();

          // Find user by email
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if password is valid
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // Return user if authentication is successful
          return user;
        } catch (error) {
          // Handle errors by returning null (unauthorized)
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        await connectToDB();

        // Ensure that email exists on the profile
        if (!profile?.email) {
          console.error("GitHub profile did not return an email");
          return false;
        }

        const existingUser = await User.findOne({ email: profile.email });
        if (!existingUser) {
          await User.create({
            name: profile?.name || "Unknown Name",
            email: profile.email,
          });
        }
      }
      return true;
    },

    // Handle JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name; // Assuming user object has `name`
        token.picture = user.image; // Assuming user object has `image`
      }
      return token;
    },
    // Handle session and merge user data with the session
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: token.picture,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin", // Adjust path to sign-in page if needed
  },
  secret: "Naveen", // Use env variable for secret
});

export { handler as GET, handler as POST };
// function GoogleProvider(arg0: {
//   clientId: string;
//   clientSecret: string;
// }): import("next-auth/providers/index").Provider {
//   throw new Error("Function not implemented.");
// }
