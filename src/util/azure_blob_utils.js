import { BlobServiceClient } from "@azure/storage-blob";
import { v4 } from 'uuid';


const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

const containerClient = blobServiceClient.getContainerClient(containerName);

export async function uploadImage(file) {

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extension =
        file.name.split(".").pop();

    const fileName = file.name.split(".")[0];

    const blobName =
        `${fileName}-${v4()}.${extension}`;

    const blockBlobClient =
        containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
            blobContentType: `image/${extension}`
        },
    })
    return { blobName, imageUrl: blockBlobClient.url };
}

export async function deleteBlob(imageUrl) {
    const blobName = imageUrl.split("/").pop();
    const blockBlobClient =
        containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
}

