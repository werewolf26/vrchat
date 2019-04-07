import axios, { AxiosResponse, AxiosInstance } from "axios";
import { VRChatConfig } from "./types";
import * as requestBuilder from "./requestBuilder";
import { VRCHAT_API_BASE_URL } from "./constants";
import { generateRequestURL } from "./requestBuilder";

const generateAxiosInstanceByCookie = (cookie: string[]) => {
  return axios.create({
    baseURL: VRCHAT_API_BASE_URL,
    headers: {
      Cookie: cookie
    }
  });
};

const getConfig = async (): Promise<VRChatConfig | null> => {
  try {
    const response: AxiosResponse<VRChatConfig> = await requestBuilder.config();

    return response.data;
  } catch {
    return null;
  }
};

export const requests = {
  get: async (
    axiosInstance: AxiosInstance | null,
    endpoint: string,
    params?: { [key: string]: string | number | boolean }
  ) => {
    if (axiosInstance === null) {
      throw new Error("Authentication required");
    }

    return axiosInstance.get(generateRequestURL(endpoint), { params });
  },

  post: async (
    axiosInstance: AxiosInstance | null,
    endpoint: string,
    params?: { [key: string]: string | number | boolean }
  ) => {
    if (axiosInstance === null) {
      throw new Error("Authentication required");
    }

    return axiosInstance.post(generateRequestURL(endpoint), { params });
  },

  put: async (
    axiosInstance: AxiosInstance | null,
    endpoint: string,
    params?: { [key: string]: string | number | boolean }
  ) => {
    if (axiosInstance === null) {
      throw new Error("Authentication required");
    }

    return axiosInstance.put(generateRequestURL(endpoint), { params });
  },

  delete: async (
    axiosInstance: AxiosInstance | null,
    endpoint: string,
    params?: { [key: string]: string | number | boolean }
  ) => {
    if (axiosInstance === null) {
      throw new Error("Authentication required");
    }

    return axiosInstance.delete(generateRequestURL(endpoint), { params });
  }
};

export const getAPIKey = async (): Promise<string | null> => {
  const config = await getConfig();

  if (config === null) {
    return null;
  }

  return config.apiKey;
};

export const login = async (
  apiKey: string,
  username: string,
  password: string
): Promise<AxiosInstance> => {
  // If the status code is 401, API key may be invalid or authentication may have failed.
  const { headers } = await requestBuilder.login(apiKey, username, password);

  if (!headers.hasOwnProperty("set-cookie")) {
    throw new Error("Cookie does not exist");
  }

  return generateAxiosInstanceByCookie(headers["set-cookie"]);
};

export const logout = async (axiosInstance: AxiosInstance) => {
  await requestBuilder.logout(axiosInstance);
};
