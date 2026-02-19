import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export const fetchNotices = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.notices, { params });

export const fetchNoticeById = <T = unknown>(noticeId: string | number) =>
  apiClient.get<T>(`${ENDPOINTS.notices}/${noticeId}`);
