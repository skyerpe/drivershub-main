import { createTheme, ThemeProvider } from "@mui/material";
import { StoreProvider } from "easy-peasy";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import AdminMenu from "../components/navbar/AdminMenu";
import Menu from "../components/navbar/Menu";
import { closeNavbar } from "../lib/navbar";
import { store } from "../lib/state";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/globals.css";

const Toaster = dynamic(
    () => import("react-hot-toast").then((c) => c.Toaster),
    { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
    const setFetching = store.getActions().metadata.setFetching;
    const theme = createTheme({
        palette: {
            mode: "dark"
        }
    });
    const router = useRouter();

    const [isFailed, setIsFailed] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [redirected, setRedirected] = useState(false);

    const fetchUserData = () => store.getActions().user.fetchUserData()
        .finally(() => setIsFetching(false))
        .then(() => setIsFailed(false))
        .catch(() => setIsFailed(true));

    useEffect(() => {
        if (localStorage["theme"] === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        };
        router.events.on("routeChangeError", () => {
            closeNavbar();
        });
        router.events.on("routeChangeComplete", () => {
            fetchUserData();
        });
    }, []);

    useEffect(() => {
        fetchUserData();

        window.addEventListener("focus", fetchUserData);
    }, []);

    useEffect(() => {
        setFetching(isFetching);
    }, [isFetching]);

    if (isFailed && router.pathname !== "/login") {
        !redirected && !!router.push("/login").then(() => setRedirected(false)) && setRedirected(true);
    };
    if (!isFetching && !isFailed && router.pathname === "/login") {
        !redirected && !!router.push("/").then(() => setRedirected(false)) && setRedirected(true);
    };
    if (!isFetching && !isFailed && router.pathname.startsWith("/admin") && !store.getState().user.data?.permissions.has("Access")) {
        !redirected && !!router.push("/").then(() => setRedirected(false)) && setRedirected(true);
    };

    return (
        <StoreProvider store={store}>
            <Head>
                <title>anchen Logistics</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            <Toaster />
            <Loader />
            {!isFetching ?
                <ThemeProvider theme={theme}>
                    {router.pathname !== "/login" && !isFailed && (router.pathname.startsWith("/admin") ? <AdminMenu /> : <Menu />)}
                    {isFailed ? router.pathname === "/login" ? <Component {...pageProps} /> : <></> : <Component {...pageProps} />}
                </ThemeProvider> : <></>}
        </StoreProvider>
    );
};