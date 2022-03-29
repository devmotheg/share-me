/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { GetServerSideProps } from "next";

import type {
	NextPageWithAuth,
	UserPinPageProps,
} from "../../../../additional";
import Header from "../../../../components/Header";
import Subheader from "../../../../components/Subheader";
import Aside from "../../../../components/Aside";
import PinDetails from "../../../../components/PinDetails";
import MasonryLayout from "../../../../components/MasonryLayout";
import dbConnect from "../../../../lib/db-connect";
import Pin from "../../../../models/pin-model";
import Comment from "../../../../models/comment-model";
import APIFeatures from "../../../../lib/api-features";

const UserPin: NextPageWithAuth = ({ pin, pins }: UserPinPageProps) => {
	return (
		<>
			<Header />
			<main className="flex flex-col md:flex-row">
				<Aside />
				<div className="flex-grow space-y-6 p-4">
					<Subheader />
					<PinDetails pin={pin} />
					{!!pins.length && (
						<>
							<span className="block pt-8 text-center text-2xl font-bold capitalize">
								more like this
							</span>
							<MasonryLayout pin={pin} pins={pins} />
						</>
					)}
				</div>
			</main>
		</>
	);
};

UserPin.auth = {
	usersOnly: true,
};

export const getServerSideProps: GetServerSideProps = async context => {
	Comment;
	await dbConnect();

	const pin = await Pin.findOne({ _u: context.query.pinId })
		.populate("userId")
		.populate({
			path: "comments",
			options: {
				limit: 10,
			},
		});

	if (!pin)
		return {
			notFound: true,
		};

	pin.comments = await Promise.all(
		pin.comments.map(async (c: any) => await c.populate("userId"))
	);

	const pins = await new APIFeatures(
		Pin.find({ _u: { $ne: pin._u }, category: pin.category }).populate(
			"userId"
		),
		context.query
	)
		.sort()
		.paginate()
		.execute();

	return {
		props: {
			pin: JSON.parse(JSON.stringify(pin)),
			pins: JSON.parse(JSON.stringify(pins)),
		},
	};
};

export default UserPin;
