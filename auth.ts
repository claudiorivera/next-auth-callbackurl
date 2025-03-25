import NextAuth from "next-auth";
import "next-auth/jwt";

import { UnstorageAdapter } from "@auth/unstorage-adapter";
import Credentials from "next-auth/providers/credentials";
import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";

const storage = createStorage({
	driver: memoryDriver(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
	debug: !!process.env.AUTH_DEBUG,
	theme: { logo: "https://authjs.dev/img/logo-sm.png" },
	adapter: UnstorageAdapter(storage),
	providers: [
		Credentials({
			credentials: {
				username: { label: "Username is username" },
				password: { label: "Password is password" },
			},
			authorize: async ({ password, username }) =>
				username === "username" && password === "password"
					? { id: "1", name: "username" }
					: null,
		}),
	],
	basePath: "/auth",
	session: { strategy: "jwt" },
	callbacks: {
		authorized({ request, auth }) {
			const { pathname } = request.nextUrl;
			if (pathname === "/middleware-example") return !!auth;
			return true;
		},
		jwt({ token, trigger, session, account }) {
			if (trigger === "update") token.name = session.user.name;
			return token;
		},
		async session({ session, token }) {
			if (token?.accessToken) session.accessToken = token.accessToken;

			return session;
		},
	},
	experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
	interface Session {
		accessToken?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
	}
}
