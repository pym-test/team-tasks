# api

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/login | Google OAuth 로그인 플로우 시작, 인증 URL로 리다이렉트 | 불필요 |
| GET | /api/auth/callback | OAuth 콜백 처리 후 세션 쿠키 발급, 앱으로 리다이렉트 | 불필요 |
| POST | /api/auth/logout | 세션 쿠키 무효화 후 로그아웃 | 필요 |
| GET | /api/tasks | 일감 목록 조회 (쿼리 파라미터 assignee_id·q로 필터) | 필요 |
| POST | /api/tasks | 새 일감 생성, created_by는 세션 사용자로 자동 설정 | 필요 |
| PATCH | /api/tasks/[id] | 일감 수정 (title·assignee_id·status 부분 업데이트) | 필요 |
| DELETE | /api/tasks/[id] | 일감 영구 삭제 | 필요 |
