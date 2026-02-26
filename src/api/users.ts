import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { ApiResponse } from '../types/api';
import { UserResponse, UserUpdateReq } from '../types/users';

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