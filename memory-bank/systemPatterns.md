# System Patterns

- 폴더 구조: src/pages(페이지), src/components(공통 UI), src/stores(상태), src/queries(API), memory-bank(문서)
- 상태 관리: Zustand 기반 전역 상태(user, category, product 등)
- 라우팅: React Router v6, 인증 라우트(RequireAuth) 분리
- 디자인: MUI, Tailwind CSS 혼용, 공통 컴포넌트 분리
- API 연동: queries/index.ts, model/ 하위에 데이터 모델 분리
