import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

/** client 기본 헤더에 박아둔 사용자 UUID (담당 팀원 방식) */
const DEFAULT_USER_ID = '51c19566-90d2-4495-91d0-4cd498124822';
const DEFAULT_USER_ROLE = 'USER';
const DEFAULT_DISPLAY_NAME = '회원';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',

    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2YmM2MDlkMC1iYjJhLTRmOTAtOTIyZi00YjU3NmI0MjllMGIiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MjM2NjQ1MCwiZXhwIjoxNzcyMzcwMDUwfQ.WRLUKDIwgJ3eaMZH31xSlyk0rCORelcdzmPXeox9KcaeLl4C7dYDVt7Nv-8CxWsJqyuDMC6jYFY_kZvd2viWOg',
    'X-User-Id': '6bc609d0-bb2a-4f90-922f-4b576b429e0b',
    'X-User-Role': 'USER',


  },
});

let currentUserDisplayName: string | null = DEFAULT_DISPLAY_NAME;

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};


export const setUserId = (userId?: string) => {


  if (userId) {
    apiClient.defaults.headers.common['X-User-Id'] = userId;
  } else {
    delete apiClient.defaults.headers.common['X-User-Id'];
  }
};

export const setUserRole = (role?: string) => {
  if (role) {
    apiClient.defaults.headers.common['X-User-Role'] = role;
  } else {
    delete apiClient.defaults.headers.common['X-User-Role'];
  }
};

export const setCurrentUserDisplayName = (displayName?: string | null) => {
  currentUserDisplayName = displayName?.trim() || DEFAULT_DISPLAY_NAME;
};

export const getCurrentUserId = (): string | null => {
  const userId = apiClient.defaults.headers.common['X-User-Id'];
  if (typeof userId === 'string' && userId.trim()) {
    return userId;
  }
  return DEFAULT_USER_ID;
};

export const getCurrentUserRole = (): string => {
  const role = apiClient.defaults.headers.common['X-User-Role'];
  if (typeof role === 'string' && role.trim()) {
    return role;
  }
  return DEFAULT_USER_ROLE;
};

export const getCurrentUserDisplayName = (): string => currentUserDisplayName ?? DEFAULT_DISPLAY_NAME;
