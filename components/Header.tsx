/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { FcMenu } from "react-icons/fc";

import ProfileButton from "./ProfileButton";
import { useAppContext } from "../contexts/AppProvider";

const Header = () => {
	const { openAside } = useAppContext();

	return (
		<header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-white p-2 md:hidden">
			<button onClick={openAside}>
				<span className="sr-only">open menu</span>
				<FcMenu className="h-10 w-10 opacity-80 transition hover:opacity-100" />
			</button>
			<strong className="text-xl font-bold capitalize">share me</strong>
			<ProfileButton additionalStyles="flex" circle={true} />
		</header>
	);
};

export default Header;
