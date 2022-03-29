/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import mongoose from "mongoose";

const schema = new mongoose.Schema({
	_p: {
		type: mongoose.SchemaTypes.String,
		unique: true,
	},
	name: {
		type: mongoose.SchemaTypes.String,
	},
	email: {
		type: mongoose.SchemaTypes.String,
	},
	image: {
		type: mongoose.SchemaTypes.String,
	},
	createdAt: {
		type: mongoose.SchemaTypes.Date,
		default: Date.now,
	},
});

schema.index({ _p: 1 });

const User = mongoose.models.user || mongoose.model("user", schema);

export default User;
