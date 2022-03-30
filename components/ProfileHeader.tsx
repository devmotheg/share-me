/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { CgLogOff } from "react-icons/cg";

import type { ProfileHeaderProps } from "../additional";
import ProfileTab from "./ProfileTab";

const ProfileHeader = ({ user, active, setActive }: ProfileHeaderProps) => {
	return (
		<div>
			<div className="relative h-96">
				<button
					className="absolute top-6 right-6 z-10 rounded-full bg-white p-1 opacity-80 shadow transition hover:opacity-100"
					onClick={() => signOut()}>
					<span className="sr-only">sign out</span>
					<CgLogOff className="h-8 w-8 text-yellow-500" />
				</button>
				<Image
					src="/images/wallpaper.png"
					layout="fill"
					objectFit="cover"
					priority
				/>
			</div>
			<div className="-translate-y-12">
				<div className="mx-auto flex w-fit items-center overflow-hidden rounded-full bg-white shadow-lg">
					<Image src={user?.image!} width="90" height="90" />
				</div>
				<span className="mt-1 block text-center text-3xl font-bold">
					{user?.name}
				</span>
				<div className="mt-5 flex items-center justify-center gap-4">
					<ProfileTab
						text="created"
						active={active}
						clickHandler={() => setActive("created")}
						isDisabled={false}
					/>
					<ProfileTab
						text="saved"
						active={active}
						clickHandler={() => setActive("saved")}
						isDisabled={false}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;
