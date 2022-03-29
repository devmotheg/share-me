/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

import User from "./user-model";
import categories from "../data/categories";

const schema = new mongoose.Schema(
	{
		_u: {
			type: mongoose.SchemaTypes.Buffer,
			immutable: true,
			unique: true,
			default: uuidv4,
			get: (_u: Buffer) => _u.toString(),
		},
		userId: {
			ref: "user",
			type: mongoose.SchemaTypes.ObjectId,
			required: [true, "Pin must belong to a user"],
			validate: {
				validator: async (userId: mongoose.ObjectId) =>
					!!(await User.findOne(userId)),
				message: "Invalid user",
			},
		},
		image: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Image is required"],
		},
		title: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Title is required"],
			minlength: [8, "Minimum length for title is 8"],
			maxlength: [32, "Maximum length for title is 32"],
		},
		about: {
			type: mongoose.SchemaTypes.String,
			required: [true, "About is required"],
			minlength: [16, "Minimum length for about is 16"],
			maxlength: [96, "Maximum length for about is 96"],
		},
		destination: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Destination link is required"],
			validate: [validator.isURL, "Invalid destination link"],
		},
		category: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Category is required"],
			validate: {
				validator: (category: string) => categories.includes(category),
				message: "Invalid category",
			},
		},
		saves: {
			type: mongoose.SchemaTypes.Number,
			default: 0,
		},
		createdAt: {
			type: mongoose.SchemaTypes.Date,
			default: Date.now,
		},
	},
	{
		toObject: { getters: true, virtuals: true },
		toJSON: { getters: true, virtuals: true },
	}
);

schema.virtual("comments", {
	ref: "comment",
	localField: "_id",
	foreignField: "pinId",
});

schema.index({ _u: 1 }).index({ userId: 1 }).index({ title: 1 });

const Pin = mongoose.models.pin || mongoose.model("pin", schema);

export default Pin;
