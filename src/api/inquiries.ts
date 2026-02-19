import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export const fetchInquiries = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.inquiries, { params });

export const fetchInquiryById = <T = unknown>(inquiryId: string | number) =>
  apiClient.get<T>(`${ENDPOINTS.inquiries}/${inquiryId}`);

export const createInquiry = <T = unknown, P = unknown>(payload: P) =>
  apiClient.post<T>(ENDPOINTS.inquiries, payload);

export const updateInquiry = <T = unknown, P = unknown>(
  inquiryId: string | number,
  payload: P,
) => apiClient.patch<T>(`${ENDPOINTS.inquiries}/${inquiryId}`, payload);

export const deleteInquiry = <T = unknown>(inquiryId: string | number) =>
  apiClient.delete<T>(`${ENDPOINTS.inquiries}/${inquiryId}`);
