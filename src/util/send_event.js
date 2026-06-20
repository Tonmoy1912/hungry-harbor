export async function sendEventToSocketServer(uri, body) {
    if (!process.env.SS_HOST) {
        console.error("SS_HOST is not defined");
        return;
    }
    fetch(`${process.env.SS_HOST}${uri}`, {
        cache: "no-store",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Pass-Code": process.env.PASS_CODE
        },
        body: JSON.stringify(body)
    });
}