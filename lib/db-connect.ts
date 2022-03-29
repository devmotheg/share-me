/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import mongoose from "mongoose";

const dbConnect = async () => {
	if (mongoose.connections[0].readyState) return;

	let dbConnectionStr = process.env.DB_LOCAL || "";
	if (process.env.DB_REMOTE && process.env.DB_PASS) {
		dbConnectionStr = process.env.DB_REMOTE.replace(
			/<password>/,
			process.env.DB_PASS
		);
	}

	await mongoose.connect(dbConnectionStr);
};

export default dbConnect;
