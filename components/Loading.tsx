/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Circles } from "react-loader-spinner";

const Loading = () => {
	return (
		<div className="my-8 mx-auto w-fit">
			<Circles color="rgb(234 179 8)" height={60} width={60} />
		</div>
	);
};

export default Loading;
