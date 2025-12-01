# 조장 매니저 배포 가이드 (Deploy to Vercel)

핸드폰으로 접속하기 위해 **Vercel**에 무료로 배포하는 방법입니다.
딱 5분만 투자하세요! 🚀

## 1. GitHub에 코드 올리기
1.  [GitHub](https://github.com)에 로그인합니다.
2.  우측 상단 `+` 버튼 -> `New repository` 클릭.
3.  **Repository name**에 `team-leader-assistant` 입력 후 `Create repository` 클릭.
4.  생성된 페이지에서 `…or push an existing repository from the command line` 부분의 코드를 복사합니다.
    (보통 아래와 비슷합니다)
    ```bash
    git remote add origin https://github.com/YOUR_ID/team-leader-assistant.git
    git branch -M main
    git push -u origin main
    ```
5.  터미널에 복사한 코드를 붙여넣고 엔터를 칩니다.

## 2. Vercel에 배포하기
1.  [Vercel](https://vercel.com)에 접속하여 로그인합니다. (GitHub 아이디로 로그인 추천)
2.  대시보드에서 `Add New...` -> `Project` 클릭.
3.  방금 올린 `team-leader-assistant` 레포지토리 옆의 `Import` 버튼 클릭.

## 3. 환경변수 설정 (중요! ⭐)
배포 설정 화면에서 **Environment Variables** 섹션을 찾아 펼칩니다.
아래 두 가지 값을 복사해서 넣어주세요. (Supabase 연동을 위해 필수입니다)

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fjrmpknxhjasrgkathdt.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (기존 값 유지) |
| `GEMINI_API_KEY` | `YOUR_GEMINI_API_KEY` (Google AI Studio에서 발급받은 키) |

> **팁**: 값을 하나씩 넣고 `Add` 버튼을 눌러주세요.

## 4. 배포 완료
1.  `Deploy` 버튼을 클릭합니다.
2.  1~2분 정도 기다리면 폭죽이 터지며 배포가 완료됩니다! 🎉
3.  생성된 도메인(예: `team-leader-assistant.vercel.app`)을 클릭해서 접속해보세요.
4.  이제 이 주소를 카톡방 공지에 올리고 핸드폰으로 쓰시면 됩니다!
