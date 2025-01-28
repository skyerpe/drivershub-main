import type { IUser } from "../types";
import Permissions from "./Permissions";

export default class User {
    private flags: number;

    discordId: string;
    steamId: string;
    username: string;
    avatarURL: string;

    constructor(user: IUser) {
        this.flags = user.permissions;
        this.discordId = user.discord_id;
        this.steamId = user.steam_id;
        this.username = user.username;
        this.avatarURL = user.avatarURL;
    };

    get permissions(): Permissions {
        return new Permissions(this.flags);
    };

    toJSON(): IUser {
        return {
            discord_id: this.discordId,
            steam_id: this.steamId,
            username: this.username,
            permissions: this.permissions.bitfield,
            avatarURL: this.avatarURL
        };
    };
};