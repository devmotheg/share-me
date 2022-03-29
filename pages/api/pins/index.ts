/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ParsedUrlQuery } from "querystring";
import { unlink } from "fs/promises";
import path from "path";
import { getToken } from "next-auth/jwt";
import multer from "multer";
import qs from "qs";

import {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../additional";
import dbConnect from "../../../lib/db-connect";
import { runMiddleware, authFirewall } from "../../../lib/middlewares";
import User from "../../../models/user-model";
import Pin from "../../../models/pin-model";
import APIFeatures from "../../../lib/api-features";
import globalErrorHandler from "../../../lib/global-error-handler";
import AppError from "../../../lib/app-error";

export const config = {
	api: {
		bodyParser: false,
	},
};

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
				const pins = await new APIFeatures(
					Pin.find({}).populate("userId"),
					qs.parse(req.url?.split("?")[1] as string) as ParsedUrlQuery
				)
					.filter()
					.sort()
					.paginate()
					.execute();

				res.status(200).json({
					status: "success",
					data: {
						pins,
					},
				});
				break;
			}
			case "POST": {
				try {
					const user = await User.findOne({ _p: token?.id });

					const upload = multer({
						storage: multer.diskStorage({
							destination(req, file, cb) {
								cb(null, path.join(process.cwd(), "public/images/pins"));
							},
							filename(req, file, cb) {
								cb(
									null,
									`user-pin-${user._p}-${Date.now()}${path.extname(
										file.originalname
									)}`
								);
							},
						}),
						fileFilter(req, file, cb) {
							if (!file.mimetype.startsWith("image"))
								return cb(new AppError("Invalid file type", 400));
							cb(null, true);
						},
					});

					await runMiddleware(req, res, upload.single("image"));

					const pin = await Pin.create({
						...req.body,
						userId: user._id,
						image: req.file.filename,
					});

					res.status(201).json({
						status: "success",
						data: {
							pin,
						},
					});
				} catch (err) {
					unlink(
						path.join(process.cwd(), `public/images/pins/${req.file.filename}`)
					);
					throw err;
				}
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
