import axios from "axios";

const baseUrl = import.meta.env.VITE_SERVER_URL;
const serverRequest = axios.create({
  baseURL: baseUrl,
});

export default serverRequest;
