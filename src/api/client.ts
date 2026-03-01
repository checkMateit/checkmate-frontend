import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

/** client 기본 헤더에 박아둔 사용자 UUID (담당 팀원 방식) */
const DEFAULT_USER_ID = 'fbd1a921-4dff-4dc6-841f-a750170bea9c';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYmQxYTkyMS00ZGZmLTRkYzYtODQxZi1hNzUwMTcwYmVhOWMiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzI0MDU0MjIsImV4cCI6MTc3MjQwOTAyMn0.Hij8PbB0CxtBM--N7OyU797u91PQ0Rn6aWRf8B8v_rtAu4IoH5S_9KMWHb-NkG9iZS27j6zKwvzsyZimMi6EBg',
    'X-User-Id': DEFAULT_USER_ID,
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

/** study-service 등에서 사용하는 사용자 식별자. 로그인 후 설정 필요. */
export const setUserId = (userId: string | null) => {
  if (userId) {
    apiClient.defaults.headers.common['X-User-Id'] = userId;
  } else {
    delete apiClient.defaults.headers.common['X-User-Id'];
  }
};

/** 현재 로그인 사용자 ID. client 기본 헤더와 동일한 값 사용. */
export const getCurrentUserId = (): string | null => DEFAULT_USER_ID;

/** 현재 로그인 사용자 표시 이름. 실제 앱에서는 프로필/인증 연동 시 교체. */
export const getCurrentUserDisplayName = (): string => '회원';
