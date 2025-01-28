import { Action, action } from "easy-peasy";

export interface MetadataStore {
    isFetching: boolean;
    isLoading: boolean;

    setFetching: Action<MetadataStore, boolean>;
    setLoading: Action<MetadataStore, boolean>;
};

const metadata: MetadataStore = {
    isFetching: false,
    isLoading: false,

    setFetching: action((state, payload) => {
        state.isFetching = payload;
    }),
    setLoading: action((state, payload) => {
        state.isLoading = payload;
    })
};

export default metadata;