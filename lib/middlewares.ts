/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import type { Auth, NextApiHandlerWithMiddleware } from "../additional";
import AppError from "./app-error";

export const runMiddleware = (
	req: NextApiRequest,
	res: NextApiResponse,
	fun: (...args: any[]) => void
) =>
	new Promise((resolve, reject) => {
		fun(req, res, (result: any) => {
			if (result instanceof Error) return reject(result);
			return resolve(result);
		});
	});

export const authFirewall =
	(auth: Auth): NextApiHandlerWithMiddleware =>
	async (req, res, next) => {
		const session = await getSession({ req });
		if (session && auth.guestsOnly)
			return next(new AppError("Only guests allowed", 401));
		if (!session && auth.usersOnly)
			return next(new AppError("Only users allowed", 401));

		next();
	};
