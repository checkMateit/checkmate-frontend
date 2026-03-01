import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzZmExNDczMC01MWE0LTQ2NzYtODBmNS1mZmZjY2QwODVjZTciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MjM0MzIzNCwiZXhwIjoxNzcyMzQ2ODM0fQ.wvU5D07MmDNvj9sqxAQt2PeNj05b9g8Wwxm1k28vEBiyJf-GN1Hn60gJmcroqjyW3XhSNsBId83ZUWmMLgjCNg',
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
