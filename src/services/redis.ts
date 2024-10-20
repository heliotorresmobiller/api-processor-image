import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL,
});

async function connectRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
}

connectRedis();

export async function getCachedImage(key: string): Promise<string | null> {
    try {
        return await client.get(key);
    } catch (error) {
        console.error('Error getting cached image:', error);
        return null;
    }
}

export async function cacheImage(key: string, image: Buffer): Promise<void> {
    try {
        await client.set(key, image.toString('binary'), {
            EX: 60 * 60 * 24,
        });
    } catch (error) {
        console.error('Error caching image:', error);
    }
}
