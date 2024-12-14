# Saramin API

채용 정보 검색 및 지원 관리를 위한 RESTful API 서버

## 기능 소개

### 1. 인증 (Authentication)
- 회원가입/로그인
- JWT 기반 인증
- 토큰 갱신
- 프로필 관리

### 2. 채용공고 (Jobs)
- 채용공고 목록 조회
- 상세 정보 조회
- 검색 및 필터링
  - 키워드 검색
  - 지역별 필터
  - 경력별 필터
  - 급여별 필터
  - 기술스택별 필터
- 조회수 기반 인기공고
- 연관 채용공고 추천

### 3. 지원 관리 (Applications)
- 채용공고 지원
- 지원 내역 조회
- 지원 상태 관리
- 지원 취소

### 4. 이력서 (Resumes)
- 이력서 작성
- 이력서 관리
- 다중 버전 관리

### 5. 북마크 (Bookmarks)
- 관심 채용공고 저장
- 북마크 목록 조회
- 북마크 삭제

### 6. 리뷰 (Reviews)
- 회사/채용공고 리뷰 작성
- 리뷰 목록 조회
- 리뷰 수정/삭제

### 7. 알림 (Notifications)
- 지원 상태 변경 알림
- 새로운 채용공고 알림
- 알림 목록 조회
- 알림 삭제

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: Express Validator
- **Logging**: Winston

## 시작하기

### 요구사항

- Node.js 18.0.0 이상
- MongoDB

### 설치

```bash
# 저장소 복제
git clone [repository-url]

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
```

### 환경변수 설정

\`.env\` 파일에 다음 환경변수를 설정하세요:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/saramin
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
```

### 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

## API 문서

- 개발 환경: http://localhost:3000/api-docs
- 운영 환경: http://113.198.66.75:13085/api-docs

## 보안

- CORS 설정
- Rate Limiting
- XSS 방지
- NoSQL Injection 방지
- Parameter Pollution 방지

## 에러 처리

- 운영 환경과 개발 환경의 에러 응답 구분
- 상세한 에러 메시지 및 스택 트레이스 (개발 환경)
- 표준화된 에러 응답 형식

## 로깅

- HTTP 요청 로깅
- 에러 로깅
- 일별 로그 파일 관리

## 라이센스

MIT License