/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import type { NextPageWithAuth } from "../../../additional";
import ProfileHeader from "../../../components/ProfileHeader";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import MasonryLayout from "../../../components/MasonryLayout";
import Loading from "../../../components/Loading";
import { useAppContext } from "../../../contexts/AppProvider";

const User: NextPageWithAuth = () => {
	const router = useRouter();
	const [active, setActive] = useState<"created" | "saved">("created");
	const { status, data, error } = useQuery(
		["userPins", router.query.userId, active],
		async ({ queryKey }) => {
			const res = await axios(
				`/api/users/${queryKey[1]}/pins?kind=${queryKey[2]}`
			);
			return res.data;
		}
	);
	const { setAlertType, setAlertMessage, setShouldAlertRerender } =
		useAppContext();

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
			<Header />
			<main className="flex flex-col md:flex-row">
				<Aside />
				<div className="flex-grow space-y-6">
					<ProfileHeader active={active} setActive={setActive} />
					<div className="p-4">
						{status === "error" ? (
							<span className="block text-center text-3xl font-bold">
								Couldn't fulfill the request
							</span>
						) : status === "loading" ? (
							<Loading />
						) : data.data.pins.length ? (
							<MasonryLayout pins={data.data.pins} />
						) : (
							<span className="block text-center text-3xl font-bold">
								No {active} pins found
							</span>
						)}
					</div>
				</div>
			</main>
		</>
	);
};

User.auth = {
	usersOnly: true,
};

export default User;
