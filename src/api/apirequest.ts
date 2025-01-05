import axios from "axios";
import { useNetwork } from '@vueuse/core';

const { isOnline } = useNetwork();  // Reactively monitor network status

const saveOfflineApiRequest = (request: any) => {
    const offlineRequests = JSON.parse(localStorage.getItem("offlineApiRequests") || "[]");
    offlineRequests.push(request);
    localStorage.setItem("offlineApiRequests", JSON.stringify(offlineRequests));
};

const syncOfflineApiRequests = async () => {
    const offlineRequests = JSON.parse(localStorage.getItem("offlineApiRequests") || "[]");

    if (offlineRequests.length > 0) {
        for (const request of offlineRequests) {
            try {
                await sendApiRequest(request);
                console.log(`Synced request to ${request.url}`);
            } catch (error) {
                console.error(`Failed to sync request to ${request.url}`, error);
            }
        }
        localStorage.removeItem("offlineApiRequests"); // Clear stored requests after sync
    }
};

const sendApiRequest = async (request: any) => {
    const { url, method, body } = request;

    try {
        const response = await axios(url, {
            method: method,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            data: body,
        });
        console.log(`API request to ${url} successful`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`API request failed: ${error}`);
        throw error;
    }
};

const apiRequest = async (url: string, method: string = "POST", body: any = {}) => {
    console.log(isOnline.value);  // Reactive check for network status
    if (isOnline.value) {
        return sendApiRequest({ url, method, body });
    } else {
        saveOfflineApiRequest({ url, method, body });
        console.log(`Request to ${url} saved locally`);
    }
};

export default apiRequest;
