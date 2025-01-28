import { Action, Thunk, action, thunk } from "easy-peasy";
import { toast } from "react-hot-toast";
import type { UserInfoResponse } from "../../types";
import anchenAPI from "../anchenAPI";
import Permissions from "../Permissions";

export interface UserData {
    discordId: string;
    steamId: string;
    username: string;
    avatarURL: string;

    permissions: Permissions;
};

export interface UserStore {
    data: UserData | undefined;
    setUserData: Action<UserStore, UserData>;
    updateUserData: Action<UserStore, Partial<UserData>>;
    fetchUserData: Thunk<UserStore, undefined, any, UserStore, Promise<void>>;
};

const user: UserStore = {
    data: undefined,

    setUserData: action((state, payload) => {
        state.data = payload;
    }),

    updateUserData: action((state, payload) => {
        // @ts-expect-error
        state.data = { ...state.data, ...payload };
    }),

    fetchUserData: thunk(async (actions) => {
        const access_token = localStorage.getItem("access_token");
        if (!access_token) throw new Error("No access token found");

        const user = await anchenAPI.get<UserInfoResponse>("/auth/userInfo", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).catch((err) => {
            console.error(err);

            if (!err.response) {
                toast.error("Something went wrong, please try refreshing the page");
            } else if (err.response?.status === 401) {
                toast.error("Your session has expired, please login again");
                localStorage.removeItem("access_token");
            };

            throw err;
        });

        actions.setUserData({
            discordId: user.data.discordId,
            steamId: user.data.steamId,
            username: user.data.username,
            avatarURL: user.data.avatarUrl,
            permissions: new Permissions(user.data.permissions)
        });
    })
};

export default user;