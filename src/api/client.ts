import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzZmExNDczMC01MWE0LTQ2NzYtODBmNS1mZmZjY2QwODVjZTciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MTk0NzA2MywiZXhwIjoxNzcxOTUwNjYzfQ.qQWHgHn4NKuECPY-D3HaLG0cXwN2D7AbWjeUt1uyJS7b2bePekuqx2XqRfaBHJI-VzmeISAvNKt0hT84rrc9Eg',
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
