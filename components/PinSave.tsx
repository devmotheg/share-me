/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";

import type { PinSaveProps } from "../additional";
import { useAppContext } from "../contexts/AppProvider";

const PinSave = ({ pin }: PinSaveProps) => {
	const queryClient = useQueryClient();
	const query = useQuery<any>(
		["pinSaves", pin._id],
		async ({ queryKey }) => {
			const saves = await axios(`/api/pins/${queryKey[1]}`);
			const isSaved = await axios(
				`/api/pins/${queryKey[1]}/saves?kind=boolean`
			);
			return {
				saves: saves.data.data.pin.saves,
				isSaved: isSaved.data.data.isSaved,
			};
		},
		{
			initialData: {
				saves: pin.saves,
				isSaved: null,
			},
		}
	);
	const mutation = useMutation<any, any, any>(
		async variables => {
			const method = variables.isSaved ? "delete" : "post";
			const res = await axios[method]("/api/saves", { pinId: variables.pinId });
			return res.data;
		},
		{
			onSuccess(data, { pinId }) {
				queryClient.invalidateQueries(["pinSaves", pinId]);
			},
		}
	);

	const { setAlertType, setAlertMessage, setShouldAlertRerender } =
		useAppContext();

	useEffect(() => {
		for (const asyncCall of [query, mutation]) {
			if (asyncCall.status === "error") {
				setShouldAlertRerender(true);
				setAlertType("error");
				setAlertMessage(
					(asyncCall.error as any)?.response?.data?.message ||
						(asyncCall.error as any)?.message
				);
			}
		}
	}, [query.status, mutation.status]);

	return (
		<button
			className="rounded-full bg-yellow-500 py-1 px-3 text-sm font-bold capitalize text-white transition-all hover:shadow disabled:bg-neutral-400"
			onClick={() => {
				mutation.mutate({ pinId: pin._id, isSaved: query.data.isSaved });
			}}
			disabled={mutation.isLoading || query.data.isSaved === null}>
			{!query.data.saves ? null : query.data.saves}{" "}
			{query.data.isSaved === null
				? "wait..."
				: query.data.isSaved
				? "unsave"
				: "save"}
		</button>
	);
};

export default PinSave;
