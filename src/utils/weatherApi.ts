import axios, { type AxiosResponse } from 'axios';

class WeatherApi {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getCityWeather(city: string): Promise<any> {
    const url: string = `${this.baseUrl}/${city}?key=${this.apiKey}`;
    console.log('🚀 ~ WeatherApi ~ getCityWeather ~ url:', url);

    const response: AxiosResponse = await axios.get(url);
    // console.log('🚀 ~ WeatherApi ~ getCityWeather ~ response:', response);
    const data = response.data as JSON;
    if (response.status !== 200) {
      throw new Error('Failed to fetch weather data');
    }
    return data;
  }
}

export default WeatherApi;
