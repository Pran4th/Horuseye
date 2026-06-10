import { type DefaultSession, type NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";

// 1. Update type declarations to include refresh token and expiration
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    gateway_token?: string;
    error?: "RefreshAccessTokenError"; // Use a more specific error for refresh failure
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    gateway_token: string;
    refresh_token: string;
    expires_at: number;
    error?: "RefreshAccessTokenError";
  }
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `expires_at`.
 */
async function refreshGatewayToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.GATEWAY_API_URL}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.refresh_token}`,
        },
      },
    );

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      gateway_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      expires_at: Math.floor(Date.now() / 1000 + 60 * 60),
    };
  } catch (error) {
    console.error("Error refreshing gateway token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Step 2: Handle initial sign-in
      if (account && user) {
        try {
          const response = await fetch(
            `${process.env.GATEWAY_API_URL}/api/v1/auth/google/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: account.id_token }),
            },
          );
          console.log("Response from gateway:", response);
          if (!response.ok) {
            throw new Error("Failed to exchange token with gateway");
          }

          const tokens = (await response.json()) as {
            access_token: string;
            refresh_token: string;
          };

          token.gateway_token = tokens.access_token;
          token.refresh_token = tokens.refresh_token;
          token.expires_at = Math.floor(Date.now() / 1000 + 60 * 60); // Set expiry for 1 hour
          return token;
        } catch (error) {
          console.error("Error exchanging token with gateway:", error);
          // On failure, return an empty token to prevent login
          return null;
        }
      }

      if (token.error === "RefreshAccessTokenError") {
        return null; // Ends the session
      }

      // Step 3: Handle subsequent requests and silent refresh
      // If the access token has not expired yet, return it
      if (Date.now() < token.expires_at * 1000) {
        return token;
      }

      // If the access token has expired, try to refresh it
      console.log("Gateway token has expired. Refreshing...");
      return refreshGatewayToken(token);
    },

    async session({ session, token }) {
      // Step 4: Pass the (potentially refreshed) token and error to the client
      if (token) {
        session.gateway_token = token.gateway_token;
        session.error = token.error;
        if (token.sub) {
          session.user.id = token.sub;
        }
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
