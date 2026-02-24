import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { ApiResponse } from '../types/api';
import { UserResponse, UserUpdateReq } from '../types/users';

export const fetchUsers = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.users, { params });

export const fetchUserById = <T = unknown>(userId: string | number) =>
  apiClient.get<T>(`${ENDPOINTS.users}/${userId}`);

export const createUser = <T = unknown, P = unknown>(payload: P) =>
  apiClient.post<T>(ENDPOINTS.users, payload);

export const updateUser = <T = unknown, P = unknown>(userId: string | number, payload: P) =>
  apiClient.patch<T>(`${ENDPOINTS.users}/${userId}`, payload);

export const deleteUser = <T = unknown>(userId: string | number) =>
  apiClient.delete<T>(`${ENDPOINTS.users}/${userId}`);


export const getMyInfo = () => 
apiClient.get<ApiResponse<UserResponse>>(`${ENDPOINTS.users}/me`);

export const updateMyInfo = (payload: UserUpdateReq) =>
apiClient.patch<ApiResponse<UserResponse>>(`${ENDPOINTS.users}/me`, payload);

export const checkNickname = (nickname: string) =>
apiClient.get<ApiResponse<{isAvailable: boolean}>>(`${ENDPOINTS.users}/check-nickname`, {
  params: { nickname }
});

export const withdrawAccount = () =>
apiClient.patch<ApiResponse<void>>(`${ENDPOINTS.users}/me/withdraw`);