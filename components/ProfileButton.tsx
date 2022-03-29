/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import type { ProfileButtonProps } from "../additional";

const ProfileButton = ({ additionalStyles, circle }: ProfileButtonProps) => {
	const { data: session } = useSession();

	return (
		<Link href={`/user/${session?.id}`}>
			<a
				className={`items-center opacity-80 transition hover:opacity-100 ${additionalStyles}`}>
				<Image
					className={circle ? "rounded-full" : "rounded"}
					src={session?.user?.image!}
					alt="share me camera logo"
					width="42"
					height="42"
				/>
				<span className="sr-only">your profile</span>
			</a>
		</Link>
	);
};

export default ProfileButton;
