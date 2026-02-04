import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            username?: string;
            role?: string;
            coolchat?: string;
        } & DefaultSession["user"]
    }

    interface User {
        username?: string;
        role?: string;
        coolchat?: string;
    }

    declare module "next-auth/jwt" {
        interface JWT {
            username?: string;
            role?: string;
            coolchat?: string;
        }

    }
}