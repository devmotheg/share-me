/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../additional";
import { readFile } from "fs/promises";
import path from "path";
import getConfig from "next/config";
import globalErrorHandler from "../../../lib/global-error-handler";

const { serverRuntimeConfig } = getConfig();

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		const img = await readFile(
			path.join(
				serverRuntimeConfig.PROJECT_ROOT,
				`public/images/pins/${req.query.imageName}`
			)
		);

		res.status(200).send(img);
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
