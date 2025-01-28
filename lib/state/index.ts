import { createStore } from "easy-peasy";
import user, { type UserStore } from "./user";
import metadata, { type MetadataStore } from "./metadata";

export interface ApplicationStore {
    user: UserStore;
    metadata: MetadataStore;
};

const state: ApplicationStore = {
    user,
    metadata
};

export const store = createStore(state);