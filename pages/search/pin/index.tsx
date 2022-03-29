/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { GetServerSideProps } from "next";

import type { NextPageWithAuth, SearchPinPageProps } from "../../../additional";
import Header from "../../../components/Header";
import Subheader from "../../../components/Subheader";
import Aside from "../../../components/Aside";
import MasonryLayout from "../../../components/MasonryLayout";
import dbConnect from "../../../lib/db-connect";
import APIFeatures from "../../../lib/api-features";
import Pin from "../../../models/pin-model";

const SearchPin: NextPageWithAuth = ({ pins }: SearchPinPageProps) => {
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

SearchPin.auth = {
	usersOnly: true,
};

export const getServerSideProps: GetServerSideProps = async context => {
	await dbConnect();
	const pins = await new APIFeatures(
		Pin.find({ title: { $regex: context.query.title } }).populate("userId"),
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

export default SearchPin;
