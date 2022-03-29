/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ProfileTabProps } from "../additional";

const ProfileTab = ({
	text,
	active,
	clickHandler,
	isDisabled,
}: ProfileTabProps) => {
	return (
		<button
			className="rounded-full bg-yellow-500 py-1 px-3 font-bold capitalize text-white transition hover:opacity-100 hover:shadow"
			style={{
				color: active === text ? "white" : "black",
				backgroundColor: active === text ? "rgb(234 179 8)" : "transparent",
				opacity: active === text ? 1 : 0.8,
			}}
			onClick={clickHandler}
			disabled={isDisabled}>
			{text}
		</button>
	);
};

export default ProfileTab;
