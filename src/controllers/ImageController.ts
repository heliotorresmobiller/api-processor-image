import { Request, Response } from 'express';
import { getS3Object } from '../services/aws';
import { getCachedImage, cacheImage } from '../services/redis';
import { processImage } from '../services/image';

export async function handleImageProcessor(req: Request, res: Response): Promise<any> {
    const { key } = req.params;
    const { w, h, q = 85, fm, gray = 0 } = req.query;

    const width = w ? parseInt(w as string, 10) : undefined;
    const height = h ? parseInt(h as string, 10) : undefined;
    const quality = parseInt(q as string, 10);
    const format = fm as 'jpeg' | 'png' | 'webp' | undefined;
    const grayscale = parseInt(gray as string, 10) === 1;

    const cacheKey = `${key}?w=${w}&h=${h}&q=${q}&fm=${fm}&gray=${gray}`;

    const cachedImage = await getCachedImage(cacheKey);
    if (cachedImage) {
        return res.type(format || 'jpeg').send(Buffer.from(cachedImage, 'binary'));
    }

    try {
        const originalBuffer = await getS3Object(key);

        const processedImage = await processImage(originalBuffer, { width, height, format, quality, grayscale });

        await cacheImage(cacheKey, processedImage);

        res.type(format || 'jpeg').send(processedImage);
    } catch (error) {
        res.status(500).send('Error processing image');
    }
}
