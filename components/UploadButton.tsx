/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useState, useEffect } from "react";
import { FcExternal, FcRemoveImage } from "react-icons/fc";

import type { UploadButtonProps } from "../additional";
import { useAppContext } from "../contexts/AppProvider";

const uploadFile = (): Promise<null | Blob> => {
	const allowedTypes = {
		"image/png": true,
		"image/jpeg": true,
		"image/svg": true,
		"image/gif": true,
		"image/tiff": true,
	};

	return new Promise((resolve, reject) => {
		const $input = document.createElement("input");
		document.body.appendChild($input);

		$input.type = "file";
		$input.click(), $input.remove();

		$input.onchange = () => {
			if (!$input.files!.length || !($input.files![0].type in allowedTypes))
				return resolve(null);
			resolve($input.files![0]);
		};
	});
};

const UploadButton = ({ state, setState }: UploadButtonProps) => {
	const [src, setSrc] = useState("");
	const { setShouldAlertRerender, setAlertMessage, setAlertType } =
		useAppContext();

	const readAsImage = (
		image: Blob,
		cb: (result: string | ArrayBuffer | null) => void
	) => {
		if (!image) return;

		const reader = new FileReader();
		reader.readAsDataURL(image);

		reader.onload = () => cb(reader.result);
	};

	useEffect(() => {
		if (state.image) setSrc(state.image);
		else setSrc("");
	});

	return (
		<div className="mx-auto flex min-h-max w-fit items-center justify-center rounded bg-neutral-100 p-4 lg:w-3/6 lg:max-w-fit">
			{src ? (
				<div className="relative border-2 border-dotted border-neutral-400">
					<img className="objcet-contain w-full" src={src} alt="uploaded img" />
					<button
						className="absolute bottom-2 right-2"
						type="button"
						onClick={() => setState({ ...state, image: null })}>
						<span className="sr-only">delete image</span>
						<FcRemoveImage className="h-8 w-8" />
					</button>
				</div>
			) : (
				<button
					className="border-2 border-dotted border-neutral-400 p-8"
					type="button"
					onClick={async () => {
						const blob = await uploadFile();
						if (!blob) {
							setShouldAlertRerender(true);
							setAlertType("error");
							setAlertMessage("Invalid file, try again with another file");
						}

						readAsImage(blob as any, result =>
							setState({ ...state, image: result })
						);
					}}>
					<div className="mb-20 text-lg">
						<FcExternal className="mx-auto h-8 w-8" />
						Click to upload
					</div>
					<span className="text-neutral-500">
						Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF
						less than 10MB
					</span>
				</button>
			)}
		</div>
	);
};

export default UploadButton;
