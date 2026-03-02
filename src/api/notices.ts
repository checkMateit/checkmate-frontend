import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { ApiResponse } from '../types/api'; // 공통 응답 타입
import { NoticeListResponse, NoticeDetail } from '../types/notice';

export const fetchNotices = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.notices, { params });

export const fetchNoticeById = <T = unknown>(noticeId: string | number) =>
  apiClient.get<T>(`${ENDPOINTS.notices}/${noticeId}`);

export const getNotices = (page = 0, size = 10) => {
  return apiClient.get<ApiResponse<NoticeListResponse>>('/notices', {
    params: { page, size },
  });
};

export const getNoticeDetail = (noticeId: number) => {
  return apiClient.get<ApiResponse<NoticeDetail>>(`/notices/${noticeId}`);
};