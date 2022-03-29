/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Router from "next/router";
import { useSession } from "next-auth/react";

import type { AuthFirewallProps } from "../additional";
import Loading from "./Loading";

const AuthFirewall = ({ auth, children }: AuthFirewallProps) => {
	const { data: session } = useSession({
		required: true,
		onUnauthenticated: () => {
			if (auth.usersOnly) Router.push("/auth/signin");
		},
	});

	if (session?.user && auth.guestsOnly) Router.push("/");
	else if (session?.user || auth.guestsOnly) return <>{children}</>;

	return <Loading />;
};

export default AuthFirewall;
