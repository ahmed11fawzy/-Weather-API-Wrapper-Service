import { Redis } from 'ioredis';
import redisClient from '../config/redisConnection.js';
import { type Weather } from '../types/weatherDataInterface.js';
class RedisService {
  // @ts-ignore: Ignore TS2564 for this line
  private client: Redis;

  constructor() {
    // this.client Assign later, call async init
    this.init();
  }

  private async init() {
    this.client = await redisClient.getClient();
  }

  // Wait for Redis connection to be ready
  private async ensureConnected(): Promise<void> {
    if (!redisClient.isReady()) {
      console.log('Waiting for Redis connection...');
      await new Promise<void>((resolve, reject) => {
        this.client.on('connect', () => resolve());
        this.client.on('error', (err) => reject(err));
      });
    }
  }

  // Set a value in Redis
  public async set(key: string, value: Weather, expireInSeconds?: number): Promise<void> {
    await this.ensureConnected();
    if (expireInSeconds) {
      await this.client.set(key, JSON.stringify(value), 'EX', expireInSeconds);
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  // Get a value from Redis
  public async get(key: string): Promise<string | null> {
    await this.ensureConnected();
    return await this.client.get(key);
  }

  // Delete a key from Redis
  public async del(key: string): Promise<number> {
    await this.ensureConnected();
    return await this.client.del(key);
  }

  // Check if a key exists in Redis
  public async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
}

const redisService = new RedisService();
export default redisService;
