import AWS from 'aws-sdk'

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export async function getS3Object(key: string): Promise<Buffer> {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
    };

    const data = await s3.getObject(params).promise();

    if (data.Body && Buffer.isBuffer(data.Body)) {
        return data.Body as Buffer;
    } else {
        throw new Error('Expected Body to be a Buffer, got: ' + typeof data.Body);
    }
}
