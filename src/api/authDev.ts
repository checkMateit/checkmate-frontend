/**
 * 개발용 인증 정보 (로그인 화면 없이 API 연동 테스트용)
 * 브라우저에서 http://localhost:8085/oauth2/authorization/google 로 로그인 후
 * 받은 accessToken / refreshToken 을 여기에 넣고 사용.
 * 배포 전 반드시 제거하거나 환경변수로 전환할 것.
 */

/** OAuth2 로그인 후 받은 accessToken (JWT). Authorization: Bearer 로 전송됨 */
export const DEV_ACCESS_TOKEN =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZDNhZjhlZi1lZDBkLTQxYTYtYjllNC03MzZkNmY3ZDM5Y2MiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MjM0MzIxMSwiZXhwIjoxNzcyOTQ4MDExfQ.Bapxi9kMw8gPPaJQOHn9sUP41tWh6pY-hbX10L0L46m36xVov_erNfu0W3GacXusWvYyhDQyEi7umjl1R9zrWg';

/** JWT payload 의 sub (사용자 UUID). study-service 의 X-User-Id 로 전송됨 */
export const DEV_USER_ID = 'ad3af8ef-ed0d-41a6-b9e4-736d6f7d39cc';

/** 개발용 인증 사용 여부. true 면 앱 시작 시 위 토큰/유저ID 로 API 헤더 설정 */
export const USE_DEV_AUTH = true;

/** 현재 로그인 사용자 ID (개발용). 실제 앱에서는 AuthContext 등에서 가져올 것 */
export const getCurrentUserId = (): string | null =>
  USE_DEV_AUTH ? DEV_USER_ID : null;
