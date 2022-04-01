/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import Masonry from "react-masonry-css";
import axios from "axios";

import type { MasonryLayoutProps } from "../additional";
import PinCard from "./PinCard";
import { useAppContext } from "../contexts/AppProvider";
import Loading from "./Loading";

const breakpointColumnsObj = {
	default: 5,
	640: 1,
	1024: 2,
	1280: 3,
	1536: 4,
};

const MasonryLayout = ({ pin, pins, active }: MasonryLayoutProps) => {
	const router = useRouter();

	let kind = "home";
	if (router.query.categoryName) kind = "category";
	if (router.query.pinId) kind = "pin";
	else if (router.query.userId) kind = "user";
	if (router.query.title) kind = "search";

	const {
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		status,
		data,
		error,
	} = useInfiniteQuery<any, any, any, any>(
		[
			"pins",
			kind,
			router.query.categoryName,
			router.query.title,
			pin?._id,
			pin?.category,
			router.query.userId,
			active,
		],
		async ({ queryKey, pageParam = 1 }) => {
			let endpoint = `/api/pins?page=${pageParam}`;
			if (queryKey[1] === "category") endpoint += `&category=${queryKey[2]}`;
			if (queryKey[1] === "search")
				endpoint += `&title[regex]=^${queryKey[3]}&title[options]=$i`;
			if (queryKey[1] === "pin")
				endpoint += `&_id[ne]=${queryKey[4]}&category=${queryKey[5]}`;
			if (queryKey[1] === "user")
				endpoint = `/api/users/${queryKey[6]}/pins?kind=${queryKey[7]}`;

			const res = await axios(endpoint);
			return res.data.data.pins;
		},
		{
			getNextPageParam(lastPage, allPages) {
				if (lastPage.length < 10) return;
				return allPages.length + 1;
			},
			initialData: pins.length ? { pages: [pins], pageParams: [1] } : undefined,
		}
	);

	const { setAlertType, setAlertMessage, setShouldAlertRerender } =
		useAppContext();

	useEffect(() => {
		const listener = () => {
			if (
				window.innerHeight + window.scrollY >=
				document.body.scrollHeight - 20
			)
				if (hasNextPage && status !== "loading") fetchNextPage();
		};
		window.addEventListener("scroll", listener);
		return () => window.removeEventListener("scroll", listener);
	});

	useEffect(() => {
		if (status === "error") {
			setShouldAlertRerender(true);
			setAlertType("error");
			setAlertMessage(
				(error as any)?.response?.data?.message || (error as any)?.message
			);
		}
	}, [status]);

	return (
		<>
			{status === "error" ? (
				<span className="block text-center text-3xl font-bold">
					Couldn't fulfill the request
				</span>
			) : status === "loading" ? (
				<Loading />
			) : !data?.pages[0].length ? (
				<span className="block text-center text-3xl font-bold">
					No {active ? active : null} pins found
				</span>
			) : (
				<Masonry
					className="mx-auto flex max-w-7xl"
					breakpointCols={breakpointColumnsObj}>
					{data?.pages.map((p: any) =>
						p.map((c: any) => <PinCard key={JSON.stringify(c)} pin={c} />)
					)}
				</Masonry>
			)}
			{isFetchingNextPage && <Loading />}
		</>
	);
};

export default MasonryLayout;
