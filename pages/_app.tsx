/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import "../styles/globals.css";

import dynamic from "next/dynamic";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";

import type { AppPropsWithAuth } from "../additional";
import AppContextProvider from "../contexts/AppProvider";
import AuthFirewall from "../components/AuthFirewall";
import Alert from "../components/Alert";

const ProgressBar = dynamic(() => import("../components/ProgressBar"), {
	ssr: false,
});

const queryClient = new QueryClient();

function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
	return (
		<>
			<Head>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon.png"></link>
				<title>Share Me</title>
			</Head>
			<QueryClientProvider client={queryClient}>
				<SessionProvider session={session}>
					<AppContextProvider>
						<ProgressBar />
						<Alert />
						{Component.auth ? (
							<AuthFirewall auth={Component.auth}>
								<Component {...pageProps} />
							</AuthFirewall>
						) : (
							<Component {...pageProps} />
						)}
					</AppContextProvider>
				</SessionProvider>
			</QueryClientProvider>
		</>
	);
}

export default App;
