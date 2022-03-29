/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useState, useEffect } from "react";
import { HiBadgeCheck, HiFire } from "react-icons/hi";
import { CgClose } from "react-icons/cg";

import { useAppContext } from "../contexts/AppProvider";

const Alert = () => {
	const [isVisible, setIsVisible] = useState(false);
	const {
		alertType: type,
		alertMessage: message,
		shouldAlertRerender,
		setShouldAlertRerender,
	} = useAppContext();

	const Icon = type === "success" ? HiBadgeCheck : HiFire;

	useEffect(() => {
		const timeout = setTimeout(() => setIsVisible(!!message), 100);
		return () => clearTimeout(timeout);
	}, [shouldAlertRerender]);

	useEffect(() => {
		if (shouldAlertRerender) {
			setShouldAlertRerender(false);
			setIsVisible(false);
		}
	}, [shouldAlertRerender]);

	return (
		<div
			className="fixed right-4 z-40 flex items-center justify-between gap-4 rounded border-l-4 border-solid bg-white p-4 shadow-md transition-all"
			style={{
				bottom: isVisible ? "1rem" : "-1rem",
				opacity: isVisible ? 1 : 0,
				visibility: isVisible ? "visible" : "hidden",
				borderColor: type === "success" ? "rgb(34 197 94)" : "rgb(239 68 68)",
			}}>
			<div className="mr-3 flex items-center gap-2">
				<Icon
					className="h-6 w-6 shrink-0"
					style={{
						color: type === "success" ? "rgb(34 197 94)" : "rgb(239 68 68)",
					}}
				/>
				<p className="max-w-xs break-all text-lg">{message}</p>
			</div>
			<button
				onClick={() => {
					setIsVisible(false);
				}}>
				<CgClose
					className="h-8 w-8 shrink-0 opacity-80 hover:opacity-100"
					style={{
						color: type === "success" ? "rgb(34 197 94)" : "rgb(239 68 68)",
					}}
				/>
			</button>
		</div>
	);
};

export default Alert;
