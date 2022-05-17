/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ParsedUrlQuery } from "querystring";
import { v2 as cloudinary } from "cloudinary";
import { getToken } from "next-auth/jwt";
import qs from "qs";

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db-connect";
import { authFirewall, runMiddleware } from "../../../lib/middlewares";
import User from "../../../models/user-model";
import Pin from "../../../models/pin-model";
import APIFeatures from "../../../lib/api-features";
import globalErrorHandler from "../../../lib/global-error-handler";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
	secure: true,
});

const config = {
	api: {
		bodyParser: {
			sizeLimit: "10mb",
		},
	},
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		switch (req.method) {
			case "GET":
				await dbConnect();

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
			case "POST":
				await dbConnect();

				await runMiddleware(req, res, authFirewall({ usersOnly: true }));

				const token = await getToken({ req });
				const user = await User.findOne({ _p: token?.id });

				const cloudinaryResponse = await cloudinary.uploader.upload(
					req.body.image,
					{
						upload_preset: "dev_setups",
					}
				);

				const pin = await Pin.create({
					...req.body,
					userId: user._id,
					image: cloudinaryResponse.public_id,
				});

				res.status(201).json({
					status: "success",
					data: {
						pin,
					},
				});
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export { config };
export default handler;
