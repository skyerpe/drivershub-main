export interface IUser {
    discord_id: string;
    steam_id: string;

    username: string;
    avatarURL: string;

    permissions: number;
};

export interface APIUser {
    steam_id: string;
    discord_id: string;
    permissions: number;
    username: string;
    leaderboard: {
        monthly_mileage: number;
        alltime_mileage: number;
    };
    warns: {
        id: string;
        userId: string;
        createdById: string;
        description: string;
        createdTimestamp: number;
    }[];
};

export interface APIJob {
    job_id?: number;
    ts_job_id?: number;
    driver: {
        id: number;
        steam_id: string;
        username: string;
    };
    start_timestamp: number;
    stop_timestamp: number;
    driven_distance: number;
    fuel_used: number;
    cargo: {
        name: string;
        mass: number;
        damage: number;
    };
    source_city: string;
    source_company: string;
    destination_city: string;
    destination_company: string;
    truck: string;
    average_speed: number;
    top_speed: number;
};

export interface APIEvent {
    id: number;

    location: string;
    destination: string;

    meetup: number;
    departure: number;

    slot_id?: number;
    slot_image?: string;

    notes?: string;
};

export interface APIStats {
    jobs: number;
    drivers: number;
};

export interface Event extends APIEvent {
    name: string;
    banner: string | null;
};

export interface LeaderboardUser {
    steamId: string;
    username: string;
    distance: number;
    position: number;
};

export interface PostAuthLoginResponse {
    access_token: string;
};

export interface PostAuthLogoutResponse {
    message: string;
};

export interface SessionInfoResponse {
    access_token: string;
    steamId: string;
    avatarUrl: string;
    createdAt: number;
    expiresAt: number;
};

export interface UserInfoResponse {
    steamId: string;
    discordId: string;
    username: string;
    avatarUrl: string;
    permissions: number;
};

declare module "axios" {
    export interface AxiosRequestConfig {
        retry?: number;
        retryDelay?: number;
    };
};