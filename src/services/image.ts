import sharp from 'sharp';

interface ProcessImageOptions {
    width?: number;
    height?: number;
    format?: 'jpeg' | 'png' | 'webp';
    quality?: number;
    grayscale?: boolean;
}

export async function processImage(
    buffer: Buffer,
    { width, height, format, quality = 85, grayscale = false }: ProcessImageOptions
): Promise<Buffer> {
    let image = sharp(buffer);

    if (width || height) {
        image = image.resize(width, height, {
            fit: 'contain'
        });
    }

    if (grayscale) {
        image = image.grayscale();
    }

    if (format) {
        image = image.toFormat(format, { quality });
    }

    return await image.toBuffer();
}
