import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, StudyGroupCreateRes } from './studyGroupCreate';
import type { StudyGroupCardRes } from './studyGroupCard';

export const fetchStudyGroups = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.studyGroups, { params });

/** GET /study-groups/my — 내가 가입한 스터디 그룹 목록 (카드 배열). X-User-Id 필수 */
export const fetchMyStudyGroups = () =>
  apiClient.get<ApiResponse<StudyGroupCardRes[]>>(`${ENDPOINTS.studyGroups}/my`);

/** GET /study-groups/recommended — 추천 스터디 (로그인 시 선호 카테고리 기반, 비로그인 시 빈 배열). size 1~50, 기본 10 */
export const fetchRecommendedStudyGroups = (params?: { size?: number }) =>
  apiClient.get<ApiResponse<StudyGroupCardRes[]>>(`${ENDPOINTS.studyGroups}/recommended`, {
    params: params?.size != null ? { size: params.size } : undefined,
  });

export const fetchStudyGroupById = <T = unknown>(groupId: string | number) =>
  apiClient.get<T>(`${ENDPOINTS.studyGroups}/${groupId}`);

/** POST /study-groups. 응답은 ApiResponse<StudyGroupCreateRes> (data.groupId, data.createdAt) */
export const createStudyGroup = (payload: Record<string, unknown>) =>
  apiClient.post<ApiResponse<StudyGroupCreateRes>>(ENDPOINTS.studyGroups, payload);

export const updateStudyGroup = <T = unknown, P = unknown>(
  groupId: string | number,
  payload: P,
) => apiClient.patch<T>(`${ENDPOINTS.studyGroups}/${groupId}`, payload);

export const deleteStudyGroup = <T = unknown>(groupId: string | number) =>
  apiClient.delete<T>(`${ENDPOINTS.studyGroups}/${groupId}`);
