/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Circles } from "react-loader-spinner";

const Loading = () => {
	return (
		<div className="my-8 mx-auto grid w-fit justify-items-center gap-1">
			<Circles color="rgb(234 179 8)" height={60} width={60} />
			<span className="text-sm font-bold capitalize">
				capturing your view... 😊
			</span>
		</div>
	);
};

export default Loading;
