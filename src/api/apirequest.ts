import axios from "axios";
import { useNetwork } from '@vueuse/core';
import socket from "@/plugins/socket";

const { isOnline } = useNetwork();  // Reactively monitor network status

const saveOfflineApiRequest = (request: any) => {
    const offlineRequests = JSON.parse(localStorage.getItem("offlineApiRequests") || "[]");
    offlineRequests.push(request);
    localStorage.setItem("offlineApiRequests", JSON.stringify(offlineRequests));
};

const syncOfflineApiRequests = async (room:string|null) => {
    const offlineRequests = JSON.parse(localStorage.getItem("offlineApiRequests") || "[]");

    for (const request of offlineRequests) {
        console.log(`Syncing request to ${request.url}`);
        try {
            let result = await sendApiRequest(request);
            console.log(result);
            console.log(`Synced request to ${request.url}`);
            // remove request from offline storage
            offlineRequests.splice(offlineRequests.indexOf(request), 1);
        } catch (error) {
            console.error(`Failed to sync request to ${request.url}`, error);
        }
    }

    localStorage.setItem("offlineApiRequests", JSON.stringify(offlineRequests));
    if (room != null){
        socket.emit("reload_messages", room);
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
    } catch (error: any) {
        // Check if error.response is defined
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Unauthorized request, redirecting to login");
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else {
                console.error(`API request failed with status ${error.response.status}: ${error.message}`);
            }
        } else if (error.request) {
            // Handle cases where the request was made but no response was received
            console.error("No response received from server:", error.request);
        } else {
            // Handle other unexpected errors
            console.error("Error creating the request:", error.message);
        }

        // Rethrow the error for further handling if needed
        throw error;
    }

};

// Event listener for network status
window.addEventListener('online', () => {
    console.log("Network is back online, syncing messages...");
    if (isOnline.value) {
        syncOfflineApiRequests(null)
    }
});

window.addEventListener('offline', () => {
    console.log("Network is offline, saving messages locally...");
});

const apiRequest = async (url: string, method: string = "POST", body: any = {}) => {
    //console.log(isOnline.value);  // Reactive check for network status
    if (isOnline.value) {
        return sendApiRequest({ url, method, body });
    } else {
        saveOfflineApiRequest({ url, method, body });
        console.log(`Request to ${url} saved locally`);
    }
};

export const watchLocalStorage = (room:string) => {
    setInterval(async () => {
        const offlineRequests = JSON.parse(localStorage.getItem("offlineApiRequests") || "[]");

        // Only proceed if there are unsynced requests and the user is online
        if (offlineRequests.length > 0 && isOnline.value) {
            console.log("Attempting to sync unsynced requests...");
            try {
                await syncOfflineApiRequests(room);


                console.log("All unsynced requests processed.");
            } catch (error) {
                console.error("Error syncing offline requests:", error);
            }
        } else if (offlineRequests.length === 0) {
            console.log("No offline requests to sync.");
        }
    }, 10000); // Check every 10 seconds
};

export default apiRequest;
