/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type {
	NextComponentType,
	NextPage,
	NextApiHandler,
	NextApiResponse,
	NextApiRequest,
} from "next";
import type { AppProps } from "next/app";
import type { MutableRefObject, ReactElement } from "react";

interface User {
	_id: string;
	_p: string;
	email: string;
	image: string;
	name: string;
}

interface Pin {
	_id: string;
	_u: string;
	userId: User;
	image: string;
	title: string;
	about: string;
	destination: string;
	category: string;
	saves: number;
	comments?: Comment[];
}

export interface Comment {
	userId: User;
	pinId: Pin;
	text: string;
}

export interface Auth {
	usersOnly?: boolean;
	guestsOnly?: boolean;
}

export type NextPageWithAuth = NextPage<any> & {
	auth?: Auth;
};

export type AppPropsWithAuth = AppProps & {
	Component: NextComponentType & {
		auth?: Auth;
	};
};

export type HomePageProps = {
	pins: Pin[];
};

export type CategoryPageProps = HomePageProps;

export type UserPageProps = HomePageProps & {
	user: User;
};

export type UserPinPageProps = HomePageProps & {
	pin: Pin;
};

export type SearchPinPageProps = HomePageProps;

export type AuthFirewallProps = WrapperProps & {
	auth: Auth;
};

export type WrapperProps = {
	children: ReactElement | ReactElement[];
};

export type ProfileButtonProps = {
	circle: boolean;
	additionalStyles?: string;
};

export type ProfileHeaderProps = {
	active: "created" | "saved";
	setActive: (active: "created" | "saved") => void;
};

export type ProfileTabProps = {
	text: "created" | "saved";
	active: "created" | "saved";
	clickHandler: () => void;
	isDisabled: boolean;
};

export type PinCardProps = {
	pin: Pin;
};

export type PinDetailsProps = PinCardProps;

export type PinCommentsProps = PinCardProps;

export type PinImageDownloadProps = {
	$img: MutableRefObject<HTMLImageElement | null>;
};

export type PinSaveProps = PinCardProps;

export type PinImageLinkProps = {
	href: string;
	additionalStyles?: string;
};

export type PinDeleteProps = PinSaveProps;

export type PinUserProps = {
	user: User;
	text?: string;
};

export type UploadGroupProps = {
	id: string;
	placeholder?: string;
	fontSize?: string;
	additionalProps?: {
		[index: string]: any;
	};
};

export type UploadButtonProps = {
	state: any;
	setState: (state: any) => void;
};

export type MasonryLayoutProps = HomePageProps & {
	pin?: Pin;
	active?: "created" | "saved";
};

export type AlertsListProps = {
	alerts: Alert[];
};

export type AppContextVal = {
	isAsideOpen: boolean;
	openAside: () => void;
	closeAside: () => void;
	alertType: "success" | "error";
	setAlertType: any;
	alertMessage: string;
	setAlertMessage: any;
	shouldAlertRerender: boolean;
	setShouldAlertRerender: any;
};

export type NextApiRequestWithMiddleware = NextApiRequest & {
	[index: string]: any;
};

export type NextApiResponseWithMiddleware = NextApiResponse & {
	[index: string]: any;
};

export type NextApiHandlerWithMiddleware<T = any> = (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware<T>,
	next: (result?: any) => void
) => void | Promise<void>;
