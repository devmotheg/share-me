/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ParsedUrlQuery } from "querystring";
import { unlink, rename } from "fs/promises";
import path from "path";
import { getToken } from "next-auth/jwt";
import express from "express";
import multer from "multer";
import qs from "qs";

import dbConnect from "../../../lib/db-connect";
import { authFirewall } from "../../../lib/middlewares";
import User from "../../../models/user-model";
import Pin from "../../../models/pin-model";
import APIFeatures from "../../../lib/api-features";
import globalErrorHandler from "../../../lib/global-error-handler";
import AppError from "../../../lib/app-error";

export const config = {
	api: {
		externalResolver: true,
		bodyParser: false,
	},
};

const handler = express();
const PINS_IMAGES = "public/images/pins";

handler.use(express.json());
handler.use(authFirewall({ usersOnly: true }) as any);

handler.get("/api/pins", async (req, res, next) => {
	try {
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
	} catch (err) {
		globalErrorHandler(err, res as any);
	}
});

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, PINS_IMAGES);
		},
	}),
	fileFilter(req, file, cb) {
		if (!file.mimetype.startsWith("image"))
			return cb(new AppError("Invalid file type", 400));
		cb(null, true);
	},
});

handler.post("/api/pins", upload.single("image"), async (req, res, next) => {
	try {
		await dbConnect();

		const token = await getToken({ req });
		const user = await User.findOne({ _p: token?.id });

		const newFileName = `user-pin-${user._p}-${Date.now()}${path.extname(
			req.file!.originalname
		)}`;
		rename(
			`${PINS_IMAGES}/${req.file!.filename}`,
			`${PINS_IMAGES}/${newFileName}`
		);
		req.file!.filename = newFileName;

		const pin = await Pin.create({
			...req.body,
			userId: user._id,
			image: req.file!.filename,
		});

		res.status(201).json({
			status: "success",
			data: {
				pin,
			},
		});
	} catch (err) {
		unlink(`${PINS_IMAGES}/${req.file!.filename}`);
		globalErrorHandler(err, res as any);
	}
});

export default handler;
