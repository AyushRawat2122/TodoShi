import axios from "axios";
import { store } from "../store/store.js";
import { setServerReady } from "../store/userSlice.js";
import { app } from "../firebase/config.js";
import { getAuth } from "firebase/auth";

const baseUrl = import.meta.env.VITE_SERVER_URL;
const serverRequest = axios.create({
  baseURL: baseUrl,
});

const onFulfilled = (response) => {
  const currentState = store.getState();
  if (currentState?.user?.isServerReady === false) {
    store.dispatch(setServerReady(true));
  }
  return response;
};

const onRejected = (error) => {
  console.log(error);
  if (error.code === "ERR_NETWORK" && error.message === "Network Error") {
    store.dispatch(setServerReady(false));
  } else {
    return Promise.reject(error);
  }
};

const getCurrentUserToken = async () => {
  const user = getAuth(app).currentUser;
  return user ? user.getIdToken() : null;
};

serverRequest.interceptors.response.use(onFulfilled, onRejected);
serverRequest.interceptors.request.use(async function (config) {
  const token = await getCurrentUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default serverRequest;
