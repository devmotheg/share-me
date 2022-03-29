/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

class AppError extends Error {
	statusCode: number;
	status: "successs" | "fail" | "error";
	fromApp: boolean;

	constructor(message: string, statusCode: number) {
		super(message);

		this.statusCode = statusCode;
		this.status = ~~(statusCode / 100) === 4 ? "fail" : "error";

		this.fromApp = true;
		Error.captureStackTrace(this);
	}
}

export default AppError;
