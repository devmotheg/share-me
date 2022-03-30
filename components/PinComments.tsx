/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";

import type { Comment, PinCommentsProps } from "../additional";
import PinUser from "./PinUser";
import Loading from "./Loading";
import { useAppContext } from "../contexts/AppProvider";

const PinComments = ({ pin }: PinCommentsProps) => {
	const $div = useRef<HTMLDivElement | null>(null);
	const query = useInfiniteQuery(
		["pinComments", pin._id],
		async ({ queryKey, pageParam = 1 }) => {
			const res = await axios.get(
				`/api/pins/${pin._id}/comments/?page=${pageParam}`
			);
			return res.data.data.comments;
		},
		{
			getNextPageParam(lastPage, allPages) {
				if (lastPage.length < 10) return;
				return allPages.length + 1;
			},
			initialData: { pages: [pin.comments], pageParams: [1] },
		}
	);
	const { setAlertType, setAlertMessage, setShouldAlertRerender } =
		useAppContext();

	useEffect(() => {
		if (query.status === "error") {
			setShouldAlertRerender(true);
			setAlertType("error");
			setAlertMessage(
				(query.error as any)?.response?.data?.message ||
					(query.error as any)?.message
			);
		}
	}, [query.status]);

	useEffect(() => {
		const listener = function (this: HTMLDivElement) {
			if (
				this.scrollTop >= this.clientHeight - 20 &&
				query.hasNextPage &&
				!query.isLoading
			)
				query.fetchNextPage();
		};

		$div.current?.addEventListener("scroll", listener);

		() => $div.current?.removeEventListener("scroll", listener);
	});

	return (
		<div className="mt-6">
			<span className="block text-2xl capitalize">comments</span>
			{query.status === "loading" ? (
				<Loading />
			) : (
				<div ref={$div} className="max-h-72 space-y-3 overflow-auto">
					{query.data?.pages.map((p: any) =>
						p.map((c: Comment) => (
							<PinUser key={JSON.stringify(c)} user={c.userId} text={c.text} />
						))
					)}
					{query.isFetchingNextPage && <Loading />}
				</div>
			)}
		</div>
	);
};

export default PinComments;
