/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import dbConnect from "../../../lib/db-connect";
import User from "../../../models/user-model";
import globalErrorHandler from "../../../lib/global-error-handler";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_SECRET!,
		}),
	],
	pages: {
		signIn: "/auth/signin",
		signOut: "/",
		error: "/",
		verifyRequest: "/",
		newUser: "/",
	},
	callbacks: {
		signIn: async ({ user, account }) => {
			try {
				await dbConnect();
				if (!(await User.findOne({ _p: account.providerAccountId })))
					await User.create({ ...user, _p: account.providerAccountId });

				return true;
			} catch (err) {
				globalErrorHandler(err);

				return false;
			}
		},
		async jwt({ token, account }) {
			if (account) token.id = account.providerAccountId;
			return token;
		},
		async session({ session, token }) {
			session.id = token.id;
			return session;
		},
	},
});
