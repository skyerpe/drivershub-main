import axios, { AxiosError } from "axios";

const http = axios.create({
    maxRedirects: 0,
    timeout: 30_000
});

http.interceptors.response.use(undefined, async (error: AxiosError) => {
    const { config, message } = error;

    if (!config || !config.retry)
        return Promise.reject(error);

    if (
        !message.includes("write EPROTO")
        && !`${error.response?.status}`.startsWith("5")
    )
        return Promise.reject(error);

    config.retry -= 1;

    await sleep(config.retryDelay ?? 500);

    return await http(config);
});

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export default http;