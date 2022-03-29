/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import User from "./user-model";
import Pin from "./pin-model";

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
			required: [true, "Comment must belong to a user"],
			validate: {
				validator: async (userId: mongoose.ObjectId) =>
					!!(await User.findOne(userId)),
				message: "Invalid user",
			},
		},
		pinId: {
			ref: "pin",
			type: mongoose.SchemaTypes.ObjectId,
			required: [true, "Comment must belong to a pin"],
			validate: {
				validator: async (pinId: mongoose.ObjectId) =>
					!!(await Pin.findOne(pinId)),
				message: "Invalid pin",
			},
		},
		text: {
			type: mongoose.SchemaTypes.String,
			required: [true, "Text is required"],
			minlength: [1, "Minimum length for text is 1"],
			maxlength: [256, "Maximum length for text is 256"],
		},
		createdAt: {
			type: mongoose.SchemaTypes.Date,
			default: Date.now,
		},
	},
	{
		toObject: { getters: true },
		toJSON: { getters: true },
	}
);

schema.index({ userId: 1, pinId: 1 });

const Comment = mongoose.models.comment || mongoose.model("comment", schema);

export default Comment;
