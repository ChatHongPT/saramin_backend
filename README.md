# 🚀 Saramin API

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/database-MongoDB-green?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-repo)
[![API Docs](https://img.shields.io/badge/API-Swagger-blue)](http://localhost:3000/api-docs)

## 📋 프로젝트 개요

Saramin API는 채용 정보 검색 및 지원 관리를 위한 현대적이고 확장 가능한 RESTful API 서버입니다. 구직자와 기업을 연결하는 효율적인 플랫폼을 제공합니다.

## ✨ 주요 기능

## 🔍 기능 상세 소개

### 1. 🔐 인증 (Authentication)
- **회원가입/로그인**
  - 이메일, 소셜 로그인(구글, 카카오, 네이버) 지원
  - 비밀번호 복잡성 검증 및 암호화
  - 계정 잠금 및 비밀번호 찾기 기능

- **JWT 기반 인증**
  - Access Token 및 Refresh Token 메커니즘
  - 토큰 만료 시간 설정 및 자동 갱신
  - 보안 토큰 검증 및 무결성 체크

- **토큰 갱신**
  - 자동 토큰 리프레시
  - 중복 로그인 방지
  - 디바이스별 로그인 관리

- **프로필 관리**
  - 개인정보 수정
  - 프로필 이미지 업로드
  - 계정 보안 설정 (2차 인증 등)

### 2. 💼 채용공고 (Jobs)
- **채용공고 목록 조회**
  - 페이지네이션 지원
  - 최신순, 마감임박순 정렬
  - 채용공고 상태 표시 (접수중, 마감임박, 마감)

- **상세 정보 조회**
  - 기업 정보
  - 채용 조건 및 우대사항
  - 근무 환경 및 복지
  - 채용 프로세스 상세 설명

- **검색 및 필터링**
  - **키워드 검색**
    - 직무, 기술, 회사명 통합 검색
    - 자동완성 및 추천 키워드
  
  - **지역별 필터**
    - 근무 지역 세분화
    - 수도권, 지방, 해외 등 선택
  
  - **경력별 필터**
    - 신입, 경력, 경력무관
    - 세부 경력 연차 선택

  - **급여별 필터**
    - 연봉 범위 설정
    - 최저/최고 연봉 필터링
    - 직군별 평균 연봉 정보

  - **기술스택별 필터**
    - 주요 프로그래밍 언어
    - 프레임워크 및 라이브러리
    - 개발 도구 및 기술

- **조회수 기반 인기공고**
  - 실시간 조회수 집계
  - 주간/월간 인기 채용공고
  - 트렌딩 직군 및 기술 분석

- **연관 채용공고 추천**
  - 개인화된 추천 알고리즘
  - 사용자 지원 이력 기반 추천
  - 비슷한 프로필의 사용자 지원 공고 추천

### 3. 📝 지원 관리 (Applications)
- **채용공고 지원**
  - 원클릭 지원
  - 이력서 자동 선택/첨부
  - 지원서 임시 저장

- **지원 내역 조회**
  - 진행 상태별 필터링
  - 지원 이력 타임라인
  - 기업별 지원 현황

- **지원 상태 관리**
  - 서류 접수
  - 서류 심사
  - 면접 대기
  - 최종 합격/불합격

- **지원 취소**
  - 취소 가능 기간 안내
  - 취소 사유 선택
  - 취소 이력 관리

### 4. 📄 이력서 (Resumes)
- **이력서 작성**
  - 템플릿 제공
  - 자동 양식 채우기
  - 실시간 미리보기

- **이력서 관리**
  - 이력서 보관함
  - 가독성 점수
  - 맞춤형 컨설팅 제안

- **다중 버전 관리**
  - 최대 5개 이력서 저장
  - 용도별 이력서 분류
  - 버전 비교 기능

### 5. 🔖 북마크 (Bookmarks)
- **관심 채용공고 저장**
  - 폴더별 분류
  - 태그 기능
  - 만료 예정 공고 알림

- **북마크 목록 조회**
  - 최근 저장 순
  - 마감 임박 순
  - 관심 직군 우선 정렬

- **북마크 삭제**
  - 개별/다중 삭제
  - 자동 만료 공고 정리

### 6. 📊 리뷰 (Reviews)
- **회사/채용공고 리뷰 작성**
  - 평점 시스템
  - 익명/실명 리뷰 옵션
  - 상세 평가 항목 (기업문화, 업무환경 등)

- **리뷰 목록 조회**
  - 최신순/평점순 정렬
  - 좋아요/추천 기능
  - 검증된 리뷰 표시

- **리뷰 수정/삭제**
  - 작성 후 일정 기간 수정 가능
  - 수정 이력 추적
  - 부적절한 리뷰 신고 기능

### 7. 🔔 알림 (Notifications)
- **알림 목록 조회**
  - 지원 상태 변경 알림
  - 마감 임박 공고 알림
  - 맞춤형 채용 정보 알림

- **알림 삭제**
  - 개별/전체 삭제
  - 읽은 알림 자동 정리
  - 알림 보관 기능


## 🛠 기술 스택

![Node.js](https://img.shields.io/badge/Node.js-v18.0.0-339933?logo=nodedotjs)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?logo=swagger)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- MongoDB 데이터베이스

### 설치 및 설정

```bash
# 저장소 복제
git clone https://github.com/ChatHongPT/saramin_backend

# 의존성 설치
npm install

```
### Run Crawling

```bash
# 크롤러 실행(Data 폴더에 json 파일 저장)
npm run crawl

```
### 환경변수 구성

`.env` 파일에 다음 환경변수를 설정하세요:

```env
PORT=3000
MONGO_URI=mongodb+srv://test:test123@cluster0.vyeu8.mongodb.net/saramin_crawler
JWT_SECRET=saramin_jwt_secret_key_2023
JWT_REFRESH_SECRET=saramin_jwt_refresh_secret_key_2023
NODE_ENV=development
```

### 실행 방법

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

## 📚 API 문서

- 개발 환경: http://localhost:3000/api-docs
- 운영 환경: http://113.198.66.75:13085/api-docs

## 🔒 보안 특징

- CORS 설정
- Rate Limiting
- XSS 방지
- NoSQL Injection 방지
- 파라미터 오염 방지

## 🛡 에러 핸들링

- 환경별 차별화된 에러 응답
- 개발 환경에서 상세한 에러 메시지 및 스택 트레이스
- 표준화된 에러 응답 형식

## 📈 로깅

- HTTP 요청 로깅
- 에러 로깅
- 일별 로그 파일 관리

## 📄 라이센스

[MIT License](https://opensource.org/licenses/MIT)

---

🌟 **기여 및 피드백 환영합니다!**
