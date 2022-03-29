/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Image from "next/image";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import type { NextPageWithAuth } from "../../additional";

const SignIn: NextPageWithAuth = () => {
	const handleSignIn = async () => {
		await signIn("google", { redirect: false });
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-black/60">
			<video
				className="absolute -z-10 h-full w-full object-cover"
				autoPlay
				loop>
				<source src="/videos/scroll.mp4" type="video/mp4" />
			</video>
			<div className="flex flex-col items-center gap-4">
				<Image
					src="/logo.png"
					alt="share me camera logo"
					width="65"
					height="65"
				/>
				<button
					className="flex items-center gap-2 rounded bg-neutral-200 p-2 text-lg transition hover:bg-white"
					onClick={handleSignIn}>
					<FcGoogle className="h-6 w-6" />
					Sign in with Google
				</button>
			</div>
		</main>
	);
};

SignIn.auth = {
	guestsOnly: true,
};

export default SignIn;
