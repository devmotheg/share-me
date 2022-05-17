/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FcHome, FcFolder, FcOpenedFolder } from "react-icons/fc";
import { CgClose } from "react-icons/cg";

import { useAppContext } from "../contexts/AppProvider";
import categories from "../data/categories";

const Aside = () => {
	const { pathname, query } = useRouter();
	const { isAsideOpen, closeAside } = useAppContext();

	return (
		<aside
			className="fixed top-0 left-0 z-30 h-full min-h-screen w-4/6 shrink-0 overflow-y-auto bg-white py-4 pr-3 shadow-lg transition-all md:sticky md:w-fit md:!translate-y-0"
			style={{
				transform: `translateX(${isAsideOpen ? 0 : -100}%)`,
			}}>
			<button
				className="absolute top-6 right-6 rounded-full bg-white p-1 shadow md:hidden"
				onClick={closeAside}>
				<span className="sr-only">close menu</span>
				<CgClose className="h-8 w-8 -scale-x-100 text-yellow-500 opacity-80 transition hover:opacity-100" />
			</button>
			<div className="pl-4 pr-12">
				<Image
					src="/logo.png"
					alt="share me camera logo"
					width="65"
					height="65"
				/>
			</div>
			<Link href="/">
				<a
					className="group mt-1 flex items-center gap-2 border-r-2 border-solid pl-4 pr-12 capitalize transition hover:text-black"
					style={{
						color: pathname === "/" ? "black" : "rgb(115 115 115)",
						borderColor: pathname === "/" ? "black" : "transparent",
					}}>
					<FcHome
						className="h-5 w-5 transition group-hover:opacity-100"
						style={{
							opacity: pathname === "/" ? 1 : 0.6,
						}}
					/>
					home
				</a>
			</Link>
			<strong className="mt-6 block min-w-max pl-4 pr-12 text-lg font-normal capitalize">
				discover categories
			</strong>
			<ul className="mt-2 space-y-2">
				{categories.map(c => {
					let Icon = FcFolder;
					if (query.categoryName === c) Icon = FcOpenedFolder;

					return (
						<li key={c}>
							<Link href={`/category/${c}`}>
								<a
									className="group flex w-full items-center gap-2 border-r-2 border-solid py-2 pl-4 pr-12 text-lg capitalize transition hover:text-black"
									style={{
										color:
											query.categoryName === c ? "black" : "rgb(115 115 115)",
										borderColor:
											query.categoryName === c ? "black" : "transparent",
									}}>
									<Icon
										className="h-6 w-6 transition group-hover:opacity-100"
										style={{
											opacity: query.categoryName === c ? 1 : 0.6,
										}}
									/>
									{c}
								</a>
							</Link>
						</li>
					);
				})}
				<li className="relative max-w-full pt-16">
					<a
						className="absolute top-1/2 left-1/2 mx-auto block w-4/6 -translate-x-1/2 -translate-y-1/2 text-center text-sm font-bold"
						href="https://github.com/devmotheg">
						Made w/ ❤ by Mohamed Muntasir
					</a>
				</li>
			</ul>
		</aside>
	);
};

export default Aside;
