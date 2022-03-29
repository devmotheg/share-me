/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { getToken } from "next-auth/jwt";

import {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../additional";
import dbConnect from "../../../lib/db-connect";
import { runMiddleware, authFirewall } from "../../../lib/middlewares";
import User from "../../../models/user-model";
import Save from "../../../models/save-model";
import globalErrorHandler from "../../../lib/global-error-handler";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		await dbConnect();
		await runMiddleware(req, res, authFirewall({ usersOnly: true }));
		const token = await getToken({ req });

		const user = await User.findOne({ _p: token?.id });
		switch (req.method) {
			case "POST": {
				const save = await Save.create({
					...req.body,
					userId: user._id,
				});

				res.status(201).json({
					status: "success",
					data: {
						save,
					},
				});
				break;
			}
			case "DELETE": {
				await Save.deleteOne({
					...req.body,
					userId: user._id,
				});

				res.status(204).end();
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
