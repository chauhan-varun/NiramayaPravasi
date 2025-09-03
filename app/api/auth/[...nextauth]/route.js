import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb";
import dbConnect from "../../../../lib/db";
import { comparePassword, generateToken } from "../../../../lib/auth";
import SuperAdmin from "../../../../models/SuperAdmin";
import Admin from "../../../../models/Admin";
import Doctor from "../../../../models/Doctor";

// Configure NextAuth options
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // We'll determine the role later in callbacks
        };
      },
    }),
    // Credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        await dbConnect();
        let user;

        // Find the user based on role and email
        switch (credentials.role) {
          case "superadmin":
            user = await SuperAdmin.findOne({ email: credentials.email });
            break;
          case "admin":
            user = await Admin.findOne({ email: credentials.email });
            break;
          case "doctor":
          case "pending_doctor":
            user = await Doctor.findOne({ email: credentials.email });
            // Check if the doctor is approved
            if (user && user.status !== "approved" && user.role !== "doctor") {
              throw new Error("Your account is pending approval");
            }
            break;
          default:
            return null;
        }

        if (!user) {
          return null;
        }

        const isPasswordValid = await comparePassword(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          // For SuperAdmin, check if MFA is needed
          mfaEnabled: user.mfaEnabled,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    // Add role and other custom fields to the JWT token
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        
        // If it's an OAuth sign-in, we need to check which role the user belongs to
        if (account?.provider === "google") {
          await dbConnect();
          
          // Check if user exists in any of our role collections
          const superAdmin = await SuperAdmin.findOne({ email: token.email });
          if (superAdmin) {
            token.role = "superadmin";
            token.userId = superAdmin._id.toString();
            return token;
          }
          
          const admin = await Admin.findOne({ email: token.email });
          if (admin) {
            token.role = "admin";
            token.userId = admin._id.toString();
            return token;
          }
          
          const doctor = await Doctor.findOne({ email: token.email });
          if (doctor) {
            // Check if doctor is approved
            if (doctor.status !== "approved" && doctor.role !== "doctor") {
              token.role = "pending_doctor";
              token.status = doctor.status;
            } else {
              token.role = "doctor";
            }
            token.userId = doctor._id.toString();
            return token;
          }
          
          // If no existing user found, treat as doctor registration
          // This is where you'd create a new pending doctor record
          // We'll handle this separately in a custom sign-in page
          token.role = "unknown";
        }
      }
      return token;
    },
    // Make role and other custom fields available to the client
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.userId;
        
        // Create a JWT for our API
        if (token.userId && token.role) {
          session.apiToken = generateToken({
            id: token.userId,
            role: token.role,
          });
        }
        
        // For doctors, include approval status
        if (token.role === "pending_doctor") {
          session.user.status = token.status;
        }
      }
      return session;
    },
    // Control OAuth sign in/up behavior based on role collections
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await dbConnect();
        const email = profile.email;
        
        // Check if user exists in any role collection
        const superAdmin = await SuperAdmin.findOne({ email });
        const admin = await Admin.findOne({ email });
        const doctor = await Doctor.findOne({ email });
        
        // If not found in any collection, we'll create a pending doctor account
        if (!superAdmin && !admin && !doctor) {
          // Create a new pending doctor
          // In a real implementation, you would redirect to a role selection page first
          try {
            await Doctor.create({
              email,
              role: "pending_doctor",
              status: "pending",
              // No password hash for OAuth users
            });
          } catch (error) {
            console.error("Error creating doctor account:", error);
            return false;
          }
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

// Create handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
