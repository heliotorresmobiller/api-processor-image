import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function getS3Object(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
    });

    const data = await s3.send(command);

    if (data.Body && data.Body instanceof ReadableStream) {
        return await streamToBuffer(data.Body);
    } else {
        throw new Error('Expected data.Body into ReadableStream: ' + typeof data.Body);
    }
}

async function streamToBuffer(readableStream: ReadableStream<any>): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    const reader = readableStream.getReader();
    let done, value;

    while ({ done, value } = await reader.read(), !done) {
        chunks.push(value);
    }

    return Buffer.concat(chunks);
}
