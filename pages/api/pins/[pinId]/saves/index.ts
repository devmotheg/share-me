/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { getToken } from "next-auth/jwt";

import {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../../../additional";
import dbConnect from "../../../../../lib/db-connect";
import { runMiddleware, authFirewall } from "../../../../../lib/middlewares";
import User from "../../../../../models/user-model";
import Save from "../../../../../models/save-model";
import globalErrorHandler from "../../../../../lib/global-error-handler";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		await dbConnect();
		await runMiddleware(req, res, authFirewall({ usersOnly: true }));
		const token = await getToken({ req });

		switch (req.method) {
			case "GET": {
				const user = await User.findOne({ _p: token?.id });

				if (req.query.kind === "boolean") {
					const isSaved = !!(await Save.count({
						userId: user._id,
						pinId: req.query.pinId,
					}));

					res.status(200).json({
						status: "success",
						data: {
							isSaved,
						},
					});
				}
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
