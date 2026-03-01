import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

/** study-service 등에서 사용하는 사용자 식별자. 로그인 후 설정 필요. */
export const setUserId = (userId: string | null) => {
  if (userId) {
    apiClient.defaults.headers.common['X-User-Id'] = userId;
  } else {
    delete apiClient.defaults.headers.common['X-User-Id'];
  }
};
