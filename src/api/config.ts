import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:8080',
  android: 'http://10.0.2.2:8080',
});

/** AuthController @RequestMapping("/auth") + @PostMapping("/google") → /auth/google. 게이트웨이(8080)가 /auth/** 를 user-service로 라우팅함. */
export const AUTH_GOOGLE_URL = `${API_BASE_URL}/auth/google`;

export const API_TIMEOUT_MS = 15000;
