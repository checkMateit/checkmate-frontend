import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

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

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};
