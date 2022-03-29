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
import Comment from "../../../../../models/comment-model";
import APIFeatures from "../../../../../lib/api-features";
import globalErrorHandler from "../../../../../lib/global-error-handler";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		await dbConnect();
		await runMiddleware(req, res, authFirewall({ usersOnly: true }));

		switch (req.method) {
			case "GET": {
				const comments = await new APIFeatures(
					Comment.find({
						pinId: req.query.pinId,
					}).populate("userId"),
					req.query
				)
					.filter()
					.sort()
					.paginate()
					.execute();

				res.status(200).json({
					status: "success",
					data: {
						comments,
					},
				});
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
