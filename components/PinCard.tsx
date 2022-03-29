/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useRef } from "react";

import type { PinCardProps } from "../additional";
import PinImageDownload from "./PinImageDownload";
import PinUser from "./PinUser";
import PinImageLink from "./PinImageLink";
import PinSave from "./PinSave";
import PinDelete from "./PinDelete";

const PinCard = ({ pin }: PinCardProps) => {
	const router = useRouter();
	const $img = useRef<HTMLImageElement | null>(null);

	return (
		<div className="my-6 mx-3">
			<div className="group relative cursor-zoom-in overflow-hidden rounded">
				<div className="absolute top-0 left-0 z-10 flex w-full items-center justify-between p-2">
					<span className="opacity-0 transition hover:!opacity-100 group-hover:opacity-80">
						<PinImageDownload $img={$img} />
					</span>
					<span className="opacity-0 transition hover:!opacity-100 group-hover:opacity-80">
						<PinSave pin={pin} />
					</span>
				</div>
				<img
					ref={$img}
					className="min-h-[8rem] w-full bg-white object-cover"
					alt="pin image"
					src={`/images/pins/${pin.image}`}
					crossOrigin="anonymous"
					onClick={() => router.push(`/user/${pin.userId._p}/pin/${pin._u}`)}
				/>
				<div className="absolute left-0 bottom-0 flex w-full items-center justify-between p-2">
					<PinImageLink
						href={pin.destination}
						additionalStyles="w-full opacity-0 hover:!opacity-100 group-hover:opacity-80"
					/>
					<span className="opacity-0 transition hover:!opacity-100 group-hover:opacity-80">
						<PinDelete pin={pin} />
					</span>
				</div>
			</div>
			<PinUser user={pin.userId} />
		</div>
	);
};

export default PinCard;
