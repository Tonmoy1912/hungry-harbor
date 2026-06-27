
export async function uploadImageClient(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/items/upload-image", {
        method: "POST",
        body: formData,
        cache: "no-store"
    });
    const data = await res.json();
    if (!data.ok) {
        throw new Error(data.message);
    }
    return data.url;
}


export async function deleteImageClient(url) {
    await fetch("/api/items/remove-image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url }),
        cache: "no-store"
    });
    return;
}