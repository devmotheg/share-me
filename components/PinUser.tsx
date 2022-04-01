/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Link from "next/link";
import Image from "next/image";

import type { PinUserProps } from "../additional";

const PinUser = ({ user, text }: PinUserProps) => {
	return (
		<Link href={`/user/${user._p}`}>
			<a className="my-3 flex w-fit items-center gap-2">
				<div className="flex shrink-0 items-center overflow-hidden rounded-full bg-white shadow-md">
					<Image src={user.image} alt="user image" width="38" height="38" />
				</div>
				<div>
					<span className="max-w-full break-all font-bold">{user?.name}</span>
					{text && <p className="max-w-full break-all text-sm">{text}</p>}
				</div>
			</a>
		</Link>
	);
};

export default PinUser;
