/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../../../additional";
import dbConnect from "../../../../../lib/db-connect";
import { runMiddleware, authFirewall } from "../../../../../lib/middlewares";
import User from "../../../../../models/user-model";
import Pin from "../../../../../models/pin-model";
import Save from "../../../../../models/save-model";
import globalErrorHandler from "../../../../../lib/global-error-handler";
import AppError from "../../../../../lib/app-error";
import APIFeatures from "../../../../../lib/api-features";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		await dbConnect();
		await runMiddleware(req, res, authFirewall({ usersOnly: true }));

		switch (req.method) {
			case "GET": {
				const user = await User.findOne({ _p: req.query.userId });

				if (!user) throw new AppError("The requested user doesn't exist", 404);

				let pins = [];
				if (req.query.kind === "created") {
					pins = await new APIFeatures(
						Pin.find({ userId: user._id }).populate("userId"),
						req.query
					)
						.sort()
						.paginate()
						.execute();
				} else if (req.query.kind === "saved") {
					pins = await Promise.all(
						(
							await new APIFeatures(
								Save.find({ userId: user._id }).populate("pinId"),
								req.query
							)
								.sort()
								.paginate()
								.execute()
						)
							.map(s => s.pinId)
							.map(async p => await p.populate("userId"))
					);
				}

				res.status(200).json({
					status: "success",
					data: {
						pins,
					},
				});
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
