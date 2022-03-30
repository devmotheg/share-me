/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "react-query";
import axios from "axios";

import type { NextPageWithAuth } from "../../additional";
import Header from "../../components/Header";
import Subheader from "../../components/Subheader";
import Aside from "../../components/Aside";
import UploadButton from "../../components/UploadButton";
import UploadGroup from "../../components/UploadGroup";
import categories from "../../data/categories";
import { useAppContext } from "../../contexts/AppProvider";

const NewPin: NextPageWithAuth = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session } = useSession();
	const [state, setState] = useState({
		image: null,
		title: "",
		about: "",
		destination: "",
		category: "",
	});

	const mutation = useMutation<
		any,
		any,
		{
			data: FormData;
			isInCorrectFilling: boolean;
		}
	>(
		async variables => {
			if (variables.isInCorrectFilling)
				throw new Error("Fill in all the required fields to create a pin");

			const res = await axios.post("/api/pins", variables.data);
			return res.data;
		},
		{
			onSuccess(data) {
				queryClient.invalidateQueries(["pins"])
				router.push(`/user/${session?.id}/pin/${data.data.pin._u}`);
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
		<>
			<Header />
			<main className="flex flex-col md:flex-row">
				<Aside />
				<div className="flex-grow space-y-6 p-4">
					<Subheader />
					<form className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-center">
						<UploadButton state={state} setState={setState} />
						<div className="flex-grow space-y-8">
							<UploadGroup
								id="title"
								placeholder="Add your title"
								fontSize="text-3xl"
								additionalProps={{
									value: state.title,
									onChange: (e: ChangeEvent<HTMLInputElement>) =>
										setState({ ...state, title: e.target.value }),
								}}
							/>
							<UploadGroup
								id="about"
								placeholder="Tell everyone what your Pin is about"
								fontSize="text-xl"
								additionalProps={{
									value: state.about,
									onChange: (e: ChangeEvent<HTMLInputElement>) =>
										setState({ ...state, about: e.target.value }),
								}}
							/>
							<UploadGroup
								id="destination"
								placeholder="Add a destination link"
								fontSize="text-xl"
								additionalProps={{
									value: state.destination,
									onChange: (e: ChangeEvent<HTMLInputElement>) =>
										setState({ ...state, destination: e.target.value }),
								}}
							/>
							<div>
								<label
									className="mb-2 block text-xl font-bold capitalize"
									htmlFor="select">
									choose pin category
								</label>
								<select
									className="w-full rounded-lg border-b-2 border-solid border-neutral-300 py-2 capitalize outline-none"
									id="select"
									value={state.category}
									onChange={e =>
										setState({ ...state, category: e.target.value })
									}>
									<option className="rounded-lg" value="" disabled>
										select category
									</option>
									{categories.map(c => (
										<option key={c} className="rounded-lg" value={c}>
											{c}
										</option>
									))}
								</select>
							</div>
							<div className="flex">
								<button
									className="ml-auto rounded-full bg-yellow-500 py-1 px-3 font-bold capitalize text-white opacity-80 transition-all hover:opacity-100 hover:shadow disabled:bg-neutral-400"
									onClick={e => {
										e.preventDefault();
										let isInCorrectFilling = false;
										if (
											!Object.values(state).reduce(
												(acc, val) => acc && !!val,
												true
											)
										)
											isInCorrectFilling = true;

										const data = new FormData();
										for (const key in state)
											data.append(key, state[key as keyof typeof state]!);
										mutation.mutate({ data, isInCorrectFilling });
									}}
									disabled={mutation.isLoading}>
									upload pin
								</button>
							</div>
						</div>
					</form>
				</div>
			</main>
		</>
	);
};

NewPin.auth = {
	usersOnly: true,
};

export default NewPin;
