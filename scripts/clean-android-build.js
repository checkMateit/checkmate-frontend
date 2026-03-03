/**
 * Android 네이티브 빌드 캐시 삭제.
 * codegen이 아직 생성되지 않은 상태에서 gradlew clean을 쓰면 CMake 에러가 나므로,
 * .cxx / build 폴더를 지운 뒤 `yarn android` 또는 `npx react-native run-android`로 다시 빌드하세요.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, 'android', 'app', '.cxx'),
  path.join(root, 'android', 'app', 'build'),
  path.join(root, 'android', 'build'),
];

for (const dir of dirs) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
    console.log('Removed:', dir);
  }
}
console.log('Android build cache cleaned. Run: yarn android');
