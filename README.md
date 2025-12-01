# 조장 매니저 (Team Leader Assistant)

조장님의 업무를 도와주는 스마트한 비서, **조장 매니저**입니다.
출석 체크, 회의록 작성, 과제 관리 등 반복적인 업무를 자동화하여 리더십에만 집중하세요!

## 🚀 시작하기

### 1. 로컬 실행
터미널에서 아래 명령어를 입력하여 개발 서버를 실행합니다.

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 앱을 확인하세요.

### 2. 배포하기 (Vercel)
핸드폰이나 다른 기기에서 접속하려면 배포가 필요합니다.
자세한 방법은 **[DEPLOY.md](DEPLOY.md)** 파일을 참고하세요.

## ✨ 주요 기능
- **대시보드**: 조원 현황과 오늘의 할 일을 한눈에 파악
- **모임 관리**: 클릭 한 번으로 출석 체크 & 키워드만으로 회의록 자동 생성
- **과제 관리**: 제출 여부 체크 & 독려 메시지(보고서) 자동 생성
- **데이터 동기화**: Supabase 연동으로 언제 어디서나 데이터 접근 가능

## 🛠 기술 스택
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase
- **Deployment**: Vercel
