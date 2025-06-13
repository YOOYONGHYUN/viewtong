# 📦 viewtong-react

**viewtong-react**는 상품 관리(상세, 등록, 수정, 리스트 등) 기능을 제공하는 리액트 기반 웹 서비스입니다.  
MUI, TailwindCSS, React Query, Zustand 등 최신 프론트엔드 스택과,
API 타입 자동화를 위한 **orval**을 활용하여 개발 효율성과 일관성을 높였습니다.

---

## 주요 기능

- **상품 상세/등록/수정/리스트** 등 상품 관리 전반
- 반응형 UI, 일관된 디자인 시스템(MUI + TailwindCSS)
- 관리자/브랜드별 분기 처리 및 UX 최적화
- 상태 관리(Zustand), 서버 상태 관리(React Query)
- API 타입/쿼리 자동화(orval)

---

## 폴더 구조

```
src/
  ├── components/         # 공통 UI 컴포넌트
  ├── lib/                # 유틸리티, 커스텀 훅 등
  ├── pages/              # 라우트별 페이지 컴포넌트
  │    └── product/       # 상품 관련 페이지
  ├── queries/            # 서버 API 쿼리 및 모델 (orval로 자동 생성)
  ├── stores/             # Zustand 상태 관리
  └── App.tsx             # 라우터 및 앱 엔트리
```

---

## 주요 기술 스택

- **React 18+**
- **TypeScript**
- **React Router**
- **Zustand** (상태 관리)
- **React Query** (서버 상태 관리)
- **MUI** (Material UI)
- **TailwindCSS**
- **react-hot-toast** (알림)
- **DOMPurify** (XSS 방지)
- **orval** (OpenAPI 기반 API 타입/쿼리 자동 생성)

---

## API 타입/쿼리 자동화 (orval)

- **orval**은 OpenAPI(Swagger) 스펙을 기반으로 API 타입, 쿼리 함수, React Query 훅 등을 자동 생성합니다.
- `src/queries/` 폴더 내 API 관련 파일들은 orval로 관리됩니다.
- OpenAPI 스펙이 변경되면 아래 명령어로 타입/쿼리를 자동 갱신할 수 있습니다.

```bash
yarn orval
```

---

## 환경 변수

- `.env` 파일에 아래와 같은 환경 변수를 설정해야 합니다.
  ```
  REACT_APP_CLOUDFRONT_URL=...
  REACT_APP_NEW_CLOUDFRONT_URL=...
  ```

---

## 실행 방법 (Yarn 기준)

1. 패키지 설치
   ```
   yarn install
   ```
2. 개발 서버 실행
   ```
   yarn start
   ```
3. (API 스펙 변경 시) orval로 타입/쿼리 자동 생성
   ```
   yarn orval
   ```
4. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 커밋/코딩 컨벤션

- 변수, 함수명은 일관된 네이밍(카멜케이스) 사용
- 불필요한 콘솔로그, TODO, placeholder 금지
- UX, 디자인, 접근성 항상 고려

---

## 기여 방법

1. 이슈 등록 및 브랜치 생성
2. 기능 개발 후 PR 요청
3. 코드 리뷰 및 머지

---

## 라이선스

- 사내 프로젝트이므로 별도 라이선스 없음 (필요시 추가)

---

## 문의

- PM 또는 프론트엔드 담당자에게 문의

---

**추가로 orval 설정법, OpenAPI 스펙 위치, 실제 API 예시 등이 필요하다면 말씀해 주세요!**
