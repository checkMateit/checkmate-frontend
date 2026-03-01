/**
 * 개발용 인증 정보 (로그인 화면 없이 API 연동 테스트용)
 * 브라우저에서 http://localhost:8085/oauth2/authorization/google 로 로그인 후
 * 받은 accessToken / refreshToken 을 여기에 넣고 사용.
 * 배포 전 반드시 제거하거나 환경변수로 전환할 것.
 */

/** OAuth2 로그인 후 받은 accessToken (JWT). Authorization: Bearer 로 전송됨 */
export const DEV_ACCESS_TOKEN =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1MWMxOTU2Ni05MGQyLTQ0OTUtOTFkMC00Y2Q0OTgxMjQ4MjIiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MjM0MjkzNSwiZXhwIjoxNzcyOTQ3NzM1fQ.Jmd1ZHNT8XT7x9o-iYm7kdL-AK-8nrloOQ8HcgK7m9RtPcshlFoT1EtmSXIsA5pqwHcjMfqyL9ODyGl8A6Drqg';

/** JWT payload 의 sub (사용자 UUID). study-service 의 X-User-Id 로 전송됨 */
export const DEV_USER_ID = '51c19566-90d2-4495-91d0-4cd498124822';

/** 개발용 인증 사용 여부. true 면 앱 시작 시 위 토큰/유저ID 로 API 헤더 설정 */
export const USE_DEV_AUTH = true;

/** 현재 로그인 사용자 ID (개발용). 실제 앱에서는 AuthContext 등에서 가져올 것 */
export const getCurrentUserId = (): string | null =>
  USE_DEV_AUTH ? DEV_USER_ID : null;
