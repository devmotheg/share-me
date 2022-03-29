/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { FcLink } from "react-icons/fc";

import type { PinImageLinkProps } from "../additional";

const PinImageLink = ({ href, additionalStyles }: PinImageLinkProps) => {
	const formatedHrf =
		href.startsWith("https://") || href.startsWith("https://")
			? href
			: `http://${href}`;

	return (
		<span
			className={`flex w-2/3 max-w-max items-end gap-2 rounded-full bg-white p-2 hover:shadow ${additionalStyles}`}>
			<FcLink className="h-5 w-5 shrink-0" />
			<a className="truncate break-all font-bold" href={formatedHrf}>
				{href}
			</a>
		</span>
	);
};

export default PinImageLink;
