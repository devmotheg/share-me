/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { GetServerSideProps } from "next";
import { useState } from "react";

import type { NextPageWithAuth, UserPageProps } from "../../../additional";
import ProfileHeader from "../../../components/ProfileHeader";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import MasonryLayout from "../../../components/MasonryLayout";
import dbConnect from "../../../lib/db-connect";
import UserModel from "../../../models/user-model";

const User: NextPageWithAuth = ({ user }: UserPageProps) => {
	const [active, setActive] = useState<"created" | "saved">("created");

	return (
		<>
			<Header />
			<main className="flex flex-col md:flex-row">
				<Aside />
				<div className="flex-grow space-y-6">
					<ProfileHeader user={user} active={active} setActive={setActive} />
					<div className="p-4">
						<MasonryLayout pins={[]} active={active} />
					</div>
				</div>
			</main>
		</>
	);
};

User.auth = {
	usersOnly: true,
};

export const getServerSideProps: GetServerSideProps = async context => {
	await dbConnect();

	const user = await UserModel.findOne({ _p: context.query.userId });

	if (!user)
		return {
			notFound: true,
		};

	return {
		props: {
			user: JSON.parse(JSON.stringify(user)),
		},
	};
};

export default User;
