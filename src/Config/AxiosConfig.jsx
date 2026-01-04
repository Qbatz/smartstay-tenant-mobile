import axios from "axios";
import { retriveData } from "../Utils/Storage"
import { BASE_URL as URL } from "../Utils/Constant";

const AxiosConfig = axios.create({
  baseURL: URL(),
  headers: {
    "Content-Type": "application/json",
  },
});


AxiosConfig.interceptors.request.use(
  async (config) => {
    console.log(config)
    const token = await retriveData("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("sending request without Authorization");
    }
    return config;
  },
  (error) => {
    console.log(error)
    return Promise.reject(error);
  }
);

export default AxiosConfig;
