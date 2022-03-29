/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { FcInternal } from "react-icons/fc";

import type { PinImageDownloadProps } from "../additional";

const downloadImage = ($img: HTMLImageElement) => {
	const $cnv = document.createElement("canvas"),
		ctx = $cnv.getContext("2d");

	($cnv.width = $img.width), ($cnv.height = $img.height);
	ctx?.drawImage($img, 0, 0);

	const $a = document.createElement("a");
	document.body.appendChild($a);

	($a.href = $cnv.toDataURL()), ($a.download = "@devmotheg.png");
	$a.click(), $a.remove();
};

const PinImageDownload = ({ $img }: PinImageDownloadProps) => {
	return (
		<button
			onClick={() => {
				if ($img.current) downloadImage($img.current);
			}}>
			<span className="sr-only">download image</span>
			<FcInternal className="h-8 w-8" />
		</button>
	);
};

export default PinImageDownload;
