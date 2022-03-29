/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import React, { useState, useContext } from "react";

import type { WrapperProps, AppContextVal } from "../additional";

const AppContext = React.createContext<AppContextVal>({
	isAsideOpen: false,
	openAside: () => {},
	closeAside: () => {},
	alertType: "success",
	setAlertType: () => {},
	alertMessage: "",
	setAlertMessage: () => {},
	shouldAlertRerender: false,
	setShouldAlertRerender: () => {},
});

const AppContextProvider = ({ children }: WrapperProps) => {
	const [isAsideOpen, setIsAsideOpen] = useState(false);
	const [alertType, setAlertType] =
		useState<AppContextVal["alertType"]>("success");
	const [alertMessage, setAlertMessage] =
		useState<AppContextVal["alertMessage"]>("");
	const [shouldAlertRerender, setShouldAlertRerender] = useState(false);

	const openAside = () => setIsAsideOpen(true);
	const closeAside = () => setIsAsideOpen(false);

	return (
		<AppContext.Provider
			value={{
				isAsideOpen,
				openAside,
				closeAside,
				alertType,
				setAlertType,
				alertMessage,
				setAlertMessage,
				shouldAlertRerender,
				setShouldAlertRerender,
			}}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => useContext(AppContext);

export { useAppContext };
export default AppContextProvider;
