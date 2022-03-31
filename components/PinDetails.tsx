/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useState, useEffect, useRef } from "react";
import { useQueryClient, useMutation } from "react-query";
import axios from "axios";

import type { PinDetailsProps } from "../additional";
import PinImageDownload from "./PinImageDownload";
import PinSave from "./PinSave";
import PinDelete from "./PinDelete";
import PinImageLink from "./PinImageLink";
import PinUser from "./PinUser";
import ProfileButton from "./ProfileButton";
import PinComments from "./PinComments";
import { useAppContext } from "../contexts/AppProvider";

const PinDetails = ({ pin }: PinDetailsProps) => {
	const [comment, setComment] = useState("");
	const $img = useRef<HTMLImageElement | null>(null);

	const queryClient = useQueryClient();
	const mutation = useMutation<any, any, { pinId: string; text: string }>(
		async newComment => {
			const res = await axios.post("/api/comments", newComment);
			return res.data.data;
		},
		{
			onSuccess() {
				setComment("");
				queryClient.invalidateQueries(["pinComments", pin._id]);
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

	return (
		<div className="my-5 mx-auto flex max-w-4xl flex-col items-center gap-4 lg:flex-row">
			<img
				ref={$img}
				className="w-full rounded bg-white object-contain lg:w-3/6"
				src={`/api/images/${pin.image}`}
				alt="pin image"
				crossOrigin="anonymous"
			/>
			<div className="w-full flex-grow">
				<div className="my-2 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<span className="opacity-80 transition hover:opacity-100">
							<PinImageDownload $img={$img} />
						</span>
						<span className="opacity-80 transition hover:opacity-100">
							<PinSave pin={pin} />
						</span>
					</div>

					<div className="flex items-center gap-4">
						<PinImageLink
							href={pin.destination}
							additionalStyles="opacity-80 transition hover:opacity-100"
						/>
						<span className="opacity-80 transition hover:opacity-100">
							<PinDelete pin={pin} />
						</span>
					</div>
				</div>
				<div className="mb-4">
					<strong className="mb-1 block break-all text-4xl font-bold">
						{pin.title}
					</strong>
					<p className="break-all">{pin.about}</p>
				</div>
				<PinUser user={pin.userId} />
				<PinComments pin={pin} />
				<form className="flex items-center gap-2 pt-6 pb-2">
					<ProfileButton additionalStyles="flex" circle={true} />
					<input
						className=" flex-grow rounded-full bg-white py-2 px-4 shadow outline-0 placeholder:capitalize placeholder:text-neutral-500 placeholder:transition focus:placeholder:opacity-0"
						type="text"
						value={comment}
						onChange={e => setComment(e.target.value)}
						placeholder="comment"
					/>
					<button
						className="rounded-full bg-yellow-500 py-1 px-3 font-bold capitalize text-white opacity-80 transition hover:opacity-100 hover:shadow disabled:bg-neutral-400"
						onClick={() => mutation.mutate({ pinId: pin._id, text: comment })}
						disabled={mutation.isLoading}>
						comment
					</button>
				</form>
			</div>
		</div>
	);
};

export default PinDetails;
