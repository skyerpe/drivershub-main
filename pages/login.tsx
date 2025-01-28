import { faDiscord, faSteam } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiUrl } from "../lib/contants";
import http from "../lib/http";
import { store } from "../lib/state";
import type { PostAuthLoginResponse } from "../types";

export default function Login() {
    const router = useRouter();
    useOauthHook();

    return (
        <div className="absolute flex items-center justify-center h-screen w-full">
            <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur w-80 rounded-lg">
                <div className="text-white/80 text-center text-4xl my-4">Login</div>

                <div className="flex flex-row items-center justify-center select-none text-white/80">
                    <div
                        className="p-2 mx-2 my-4 bg-white/5 backdrop-blur rounded-lg hover:cursor-pointer"
                        onClick={() => onDiscordLogin(router)}
                    ><FontAwesomeIcon icon={faDiscord} /> Discord</div>
                    <div
                        className="p-2 mx-2 my-4 bg-white/5 backdrop-blur rounded-lg hover:cursor-pointer"
                        onClick={() => toast.error("no")}
                    ><FontAwesomeIcon icon={faSteam} /> Steam</div>
                </div>
            </div>
        </div>
    );
};

function useOauthHook() {
    const router = useRouter();

    useEffect(() => {
        const { code } = router.query;

        if (code && window.opener) {
            window.opener.postMessage({ code }, "*");
            window.close();
        };
    }, [router.query]);
};

function onDiscordLogin(router: NextRouter) {
    router;
    const setLoading = store.getActions().metadata.setLoading;
    const clientId = process.env["NEXT_PUBLIC_CLIENT_ID"] ? process.env["NEXT_PUBLIC_CLIENT_ID"] : "";
    const redirectUri = process.env["NEXT_PUBLIC_REDIRECT_URI"] ? process.env["NEXT_PUBLIC_REDIRECT_URI"] : "https://hub.anchen.org/login";

    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;

    const newWindow = window.open(url, "modal", `height=675,width=875,top=${window.innerHeight / 2 - 287.5},left=${window.innerWidth / 2 - 192.5}`);

    if (newWindow) {
        newWindow.focus();

        window.onmessage = (m) => {
            const { code } = m.data as { code?: string };
            if (!code) return;

            setLoading(true);

            const body = {
                provider: "discord",
                code,
                scope: "identify"
            };

            http.post<PostAuthLoginResponse>(apiUrl + "/auth/login", body, {
                timeout: 5_000
            }).then((res) => {
                const { access_token } = res.data;
                setLoading(false);

                window.localStorage.setItem("access_token", access_token);

                window.location.href = "/";
                // router.push("/");
            }).catch((err) => {
                console.error(err);
                setLoading(false);

                switch (err.response?.status) {
                    case 404:
                        toast.error(<div>
                            You don&apos;t seem to be a driver for anchen yet.
                            You can apply{" "}
                            <Link href="https://truckersmp.com/vtc/55939" className="text-sky-600">here</Link>.
                        </div>, { id: "error", duration: 10000 });
                        break;
                    default:
                        toast.error("An unknown error occured. Please try again later.", { id: "error" });
                        break;
                };
            });
        };
    };
};