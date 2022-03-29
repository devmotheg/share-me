/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FcSearch, FcAddImage } from "react-icons/fc";

import ProfileButton from "./ProfileButton";

const Subheader = () => {
	const [search, setSearch] = useState("");
	const router = useRouter();

	return (
		<nav className="flex items-center gap-3">
			<form className="flex max-w-full flex-grow flex-row-reverse items-center gap-4 rounded bg-white p-2 px-3 shadow">
				<input
					className="peer flex-grow bg-transparent text-lg outline-0 placeholder:capitalize placeholder:text-neutral-500 placeholder:transition focus:placeholder:opacity-0"
					type="text"
					placeholder="search"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<button
					className="focus:peer opacity-60 transition hover:opacity-100 peer-focus:opacity-100"
					onClick={e => {
						e.preventDefault();
						if (search) router.push(`/search/pin?title=${search}`);
					}}>
					<span className="sr-only">search pin</span>
					<FcSearch className="h-5 w-5" />
				</button>
			</form>
			<ProfileButton additionalStyles="hidden md:flex" circle={false} />
			<Link href="/new-pin">
				<a>
					<FcAddImage className="h-14 w-14 opacity-80 transition hover:opacity-100" />
				</a>
			</Link>
		</nav>
	);
};

export default Subheader;
