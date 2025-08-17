import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL;
const serverRequest = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});

export default serverRequest;
