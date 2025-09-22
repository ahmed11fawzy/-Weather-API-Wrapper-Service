import type { Request, Response, NextFunction } from 'express';
import WeatherApi from '../utils/weatherApi.js';
import { configDotenv } from 'dotenv';

configDotenv();
export const geCityWeather = async (req: Request, res: Response, next: NextFunction) => {
  const cityName: string = req.params.cityName as string;
  try {
    if (!cityName) {
      throw new Error('City name is required');
    }
    const weatherApi = new WeatherApi(process.env.API_KEY as string, process.env.API_URL as string);
    const weatherData = await weatherApi.getCityWeather(cityName);
    console.log('🚀 ~ geCityWeather ~ weatherData:', weatherData);

    res.status(200).json({
      status: 'success',
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
};
