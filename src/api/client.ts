import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzZmExNDczMC01MWE0LTQ2NzYtODBmNS1mZmZjY2QwODVjZTciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MjM3MTgzMSwiZXhwIjoxNzcyMzc1NDMxfQ.nRQktY0PqPX7VT-ERLfk-ImkY7yv_Vq-m5sqyzbpNM1wXLuLKd7hmoZKx7Rj6IPcVP216LSldTGyQYNFDhnrhg',
    'X-User-Id': '3fa14730-51a4-4676-80f5-fffccd085ce7',
    'X-User-Role': 'USER',
  },
});

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};
