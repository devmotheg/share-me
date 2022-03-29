/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { GetServerSideProps } from "next";

import type { NextPageWithAuth, HomePageProps } from "../additional";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import Aside from "../components/Aside";
import MasonryLayout from "../components/MasonryLayout";
import dbConnect from "../lib/db-connect";
import Pin from "../models/pin-model";
import APIFeatures from "../lib/api-features";

const Home: NextPageWithAuth = ({ pins }: HomePageProps) => {
	return (
		<>
			<Header />
			<main className="flex flex-col md:flex-row">
				<Aside />
				<div className="flex-grow space-y-6 p-4">
					<Subheader />
					<MasonryLayout pins={pins} />
				</div>
			</main>
		</>
	);
};

Home.auth = {
	usersOnly: true,
};

export const getServerSideProps: GetServerSideProps = async context => {
	await dbConnect();
	const pins = await new APIFeatures(
		Pin.find({}).populate("userId"),
		context.query
	)
		.sort()
		.paginate()
		.execute();

	return {
		props: {
			pins: JSON.parse(JSON.stringify(pins)),
		},
	};
};

export default Home;
