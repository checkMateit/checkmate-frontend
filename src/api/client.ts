import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYmQxYTkyMS00ZGZmLTRkYzYtODQxZi1hNzUwMTcwYmVhOWMiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzIzNDk3NTgsImV4cCI6MTc3MjM1MzM1OH0.JUOEaAMr4bsQfrfFQ2THszoR9zwzV2-7S7iVdFz1sI_n8P6zPIxaqwp6FoAAsBWtwMa3F8I9yC1uiOCHC82cew',
    'X-User-Id': 'fbd1a921-4dff-4dc6-841f-a750170bea9c',
    'X-User-Role': 'ADMIN',
  },
});

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};
