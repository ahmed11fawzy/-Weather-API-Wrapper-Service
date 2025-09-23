import { config } from 'dotenv';
import { Redis, type RedisOptions } from 'ioredis';
import { parse } from 'url';

// Load environment variables
config();

interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db?: number;
}

class RedisClient {
  private static instance: RedisClient;
  private client: Redis;
  private isConnected: boolean = false;

  private constructor(config: RedisConfig) {
    const options: RedisOptions = {
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db ?? 0,
      retryStrategy: (times) => {
        console.log(`Retrying Redis connection (attempt ${times})...`);
        return Math.min(times * 100, 2000); // Exponential backoff
      },
      maxRetriesPerRequest: 20,
    };

    this.client = new Redis(options);

    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('Redis client connected');
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      console.error('Redis Client Error', err);
    });

    this.client.on('close', () => {
      console.log('Redis client disconnected');
      this.isConnected = false;
    });
  }

  public static getInstance(config: RedisConfig): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient(config);
    }
    return RedisClient.instance;
  }

  public async getClient(): Promise<Redis> {
    if (!this.isConnected) {
      await this.waitForConnection();
    }
    return this.client;
  }

  private async waitForConnection(timeoutMs: number = 10000): Promise<void> {
    if (this.isConnected) return;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Redis connection timed out'));
      }, timeoutMs);

      this.client.on('connect', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.client.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  public isReady(): boolean {
    return this.isConnected;
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
    }
  }
}

// Parse REDIS_URL or use defaults
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const parsedUrl = parse(redisUrl.startsWith('redis://') ? redisUrl : `redis://${redisUrl}`);
const redisConfig: RedisConfig = {
  host: parsedUrl.hostname || 'localhost',
  port: parsedUrl.port ? Number(parsedUrl.port) : Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD as string,
  db: Number(process.env.REDIS_DB) || 0,
};

console.log('🚀 ~ process.env.REDIS_URL:', process.env.REDIS_URL);

// Export singleton instance
const redisClient = RedisClient.getInstance(redisConfig);
export default redisClient;
