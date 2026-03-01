import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2YmNkYjA3Yi0wNzRkLTRkOGUtYmQ5Yy04ODlhYjNmMWFjMWEiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MjExMDU5NiwiZXhwIjoxNzcyMTE0MTk2fQ.R8e2CQGMalESu3UF4PO537jIIBfdYyftmGviKqZkOMY2tE88SuCBnXronzkys0Qw0PCq22DMOY3ENh2mENaOng',
    'X-User-Id': '6bcdb07b-074d-4d8e-bd9c-889ab3f1ac1a',
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

/** study-service 등에서 사용하는 사용자 식별자. 로그인 후 설정 필요. */
export const setUserId = (userId: string | null) => {
  if (userId) {
    apiClient.defaults.headers.common['X-User-Id'] = userId;
  } else {
    delete apiClient.defaults.headers.common['X-User-Id'];
  }
};
