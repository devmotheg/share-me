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
			required: [true, "Save must belong to a user"],
			validate: {
				validator: async (userId: mongoose.ObjectId) =>
					!!(await User.findOne(userId)),
				message: "Invalid user",
			},
		},
		pinId: {
			ref: "pin",
			type: mongoose.SchemaTypes.ObjectId,
			required: [true, "Save must belong to a pin"],
			validate: {
				validator: async (pinId: mongoose.ObjectId) =>
					!!(await Pin.findOne(pinId)),
				message: "Invalid pin",
			},
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

schema.index({ userId: 1, pinId: 1 }, { unique: true });

schema.post("save", async function () {
	const saves = await this.constructor.count({ pinId: this.pinId });
	await Pin.findByIdAndUpdate(this.pinId, { saves });
});

schema.pre(/^delete/, async function (next) {
	this.saves = await this.model.find(this._conditions);

	next();
});

schema.post(/^delete/, async function () {
	for (const save of this.saves) {
		const saves = await save.constructor.count({ pinId: save.pinId });
		await Pin.findByIdAndUpdate({ _id: save.pinId }, { saves });
	}
});

const Save = mongoose.models.save || mongoose.model("save", schema);

export default Save;
