/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { unlink } from "fs/promises";
import path from "path";
import { getToken } from "next-auth/jwt";

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../../additional";
import dbConnect from "../../../../lib/db-connect";
import { runMiddleware, authFirewall } from "../../../../lib/middlewares";
import User from "../../../../models/user-model";
import Pin from "../../../../models/pin-model";
import globalErrorHandler from "../../../../lib/global-error-handler";
import AppError from "../../../../lib/app-error";

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
			case "GET": {
				const pin = await Pin.findOne({ _id: req.query.pinId });

				if (!pin) throw new AppError("The requested pin doesn't exist", 404);

				res.status(200).json({
					status: "success",
					data: {
						pin,
					},
				});
				break;
			}
			case "DELETE": {
				const pin = await Pin.findOneAndDelete({
					userId: user._id,
					pinId: req.query.pinId,
				});
				unlink(path.join(process.cwd(), `public/images/pins/${pin.image}`));

				res.status(204).end();
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
