import { sendEventToSocketServer } from "@/util/send_event";
export function itemUpdateSync(userId) {
    try {
        sendEventToSocketServer("/api/items/item-update");
    }
    catch (err) {
        console.log("Faild to sync item update", err.message);
    }
}