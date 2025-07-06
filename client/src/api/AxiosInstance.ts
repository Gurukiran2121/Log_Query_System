import axios from "axios";

const url = `${import.meta.env.VITE_SERVER_BASE_URL}${
  import.meta.env.VITE_API_VERSION
}`;

const axiosConfig = {
  baseURL: url,

  timeout: 5000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const apiClient = axios.create(axiosConfig);

export default apiClient;
