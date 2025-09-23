import type { Request, Response, NextFunction } from 'express';
import WeatherApi from '../utils/weatherApi.js';
import { configDotenv } from 'dotenv';
import redisService from '../services/redis.service.js';
configDotenv();
export const geCityWeather = async (req: Request, res: Response, next: NextFunction) => {
  const cityName: string = req.params.cityName as string;
  try {
    if (!cityName) {
      throw new Error('City name is required');
    }

    // Check cache first
    let weatherData;
    let weather = await redisService.get(cityName);
    if (weather) {
      console.log('Cache hit for city:', cityName);
      weatherData = JSON.parse(weather);
    } else {
      console.log('Cache miss for city:', cityName);

      const weatherApi = new WeatherApi(
        process.env.API_KEY as string,
        process.env.API_URL as string,
      );
      weatherData = await weatherApi.getCityWeather(cityName);
      // Store in cache for 10 minutes
      await redisService.set(cityName, weatherData, 60 * 60);
    }
    res.status(200).json({
      status: 'success',
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
};
