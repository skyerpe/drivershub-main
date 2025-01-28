import type { NextRouter } from "next/router";
import { apiUrl } from "./contants";
import http from "./http";
import { store } from "./state";
import { toast } from "react-hot-toast";

export default async function handleLogout(router: NextRouter) {
    const setLoading = store.getActions().metadata.setLoading;

    const access_token = localStorage.getItem("access_token");
    if (!access_token) throw new Error("No access token found");

    setLoading(true);
    await http.post(apiUrl + "/auth/logout", { access_token })
        .then(() => {
            toast.success("Logged out successfully");
        }).finally(() => {
            setLoading(false);
        });

    localStorage.removeItem("access_token");

    router.push("/login");
};