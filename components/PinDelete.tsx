/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQueryClient, useMutation } from "react-query";
import axios from "axios";

import type { PinDeleteProps } from "../additional";
import { useAppContext } from "../contexts/AppProvider";

const PinDelete = ({ pin }: PinDeleteProps) => {
	const router = useRouter();
	const { data: session } = useSession();

	let kind = "home";
	if (router.query.categoryName) kind = "category";
	if (router.query.pinId) kind = "pin";

	const queryClient = useQueryClient();

	const mutation = useMutation<any, any, any>(
		async deletedPin => {
			const res = await axios.delete(`/api/pins/${deletedPin}`);
			return res.data;
		},
		{
			onSuccess() {
				queryClient.invalidateQueries(["pins", kind]);
				if (kind === "pin" && router.query.pinId === pin._u) router.push("/");
			},
		}
	);

	const { setAlertType, setAlertMessage, setShouldAlertRerender } =
		useAppContext();

	useEffect(() => {
		if (mutation.status === "error") {
			setShouldAlertRerender(true);
			setAlertType("error");
			setAlertMessage(
				(mutation.error as any)?.response?.data?.message ||
					(mutation.error as any)?.message
			);
		}
	}, [mutation.status]);

	if (session?.id !== pin.userId._p) return null;

	return (
		<button
			className="rounded-full bg-yellow-500 py-1 px-3 text-sm font-bold capitalize text-white transition-all hover:shadow disabled:bg-neutral-400"
			onClick={() => {
				mutation.mutate({ pinId: pin._id });
			}}
			disabled={mutation.isLoading}>
			delete
		</button>
	);
};

export default PinDelete;
