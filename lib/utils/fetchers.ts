import type { APIGameEvent } from "@truckersmp_official/api-types/v2";
import type { APIEvent } from "../../types";
import { apiUrl } from "../contants";
import http from "../http";

export const getAPIEvents = async () => {
    const res = await http.get<APIEvent[]>("https://api.anchen.org/events");
    return res.data;
};

export const getTMPEvent = async (id: number) => {
    const res = await http.get<{ response: APIGameEvent; }>(`${apiUrl}/tmp/event/${id}`);
    return res.data.response;
};