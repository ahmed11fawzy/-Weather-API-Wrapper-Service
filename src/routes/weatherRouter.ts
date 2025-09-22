import { Router } from 'express';
import { geCityWeather } from '../controller/weatherController.js';

const router = Router();

router.get('/city/:cityName', geCityWeather);

export default router;
