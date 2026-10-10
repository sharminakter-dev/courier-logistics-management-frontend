import {ofetch} from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

const apiClient = ofetch.create({
    baseURL: BASE_URL
});

export default apiClient;