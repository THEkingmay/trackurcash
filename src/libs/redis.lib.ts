import { Redis } from "@upstash/redis";


const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getData<T>(key: string): Promise<T | null> {
    return redis.get<T>(key)
}

export async function setData(key: string, value: unknown, ex?: number): Promise<unknown> {
    return redis.set(key, value, ex ? { ex } : undefined);
}

export async function deleteData(key: string): Promise<number> {
    return redis.del(key);
}