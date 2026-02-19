import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export const fetchStudyGroups = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.studyGroups, { params });

export const fetchStudyGroupById = <T = unknown>(groupId: string | number) =>
  apiClient.get<T>(`${ENDPOINTS.studyGroups}/${groupId}`);

export const createStudyGroup = <T = unknown, P = unknown>(payload: P) =>
  apiClient.post<T>(ENDPOINTS.studyGroups, payload);

export const updateStudyGroup = <T = unknown, P = unknown>(
  groupId: string | number,
  payload: P,
) => apiClient.patch<T>(`${ENDPOINTS.studyGroups}/${groupId}`, payload);

export const deleteStudyGroup = <T = unknown>(groupId: string | number) =>
  apiClient.delete<T>(`${ENDPOINTS.studyGroups}/${groupId}`);
