import axios from "axios";
import store from "@/store";

const $axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

$axios.interceptors.request.use((config) => {
  const token = store.getters["cuser/getToken"];
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

$axios.interceptors.response.use(
  (response) => {
    if (response.data.msg) {
      let color = "";
      if (response.status >= 200 && response.status <= 299) {
        color = "success";
      } else if (response.status >= 400 && response.status <= 499) {
        color = "error";
      }
      store.dispatch("setSnackbar", {
        msg: response.data.msg,
        color: color,
      });
    }
    return response;
  },
  (err) => {
    if (err.response?.data?.msg) {
      store.dispatch("setSnackbar", {
        msg: err.response?.data?.msg,
        color: "error",
      });
    }
    return Promise.reject(err);
  }
);

export default $axios;
