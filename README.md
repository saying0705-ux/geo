# NE능률 GEO 진단 v5

## 변경 사항 (v4 → v5)

- **로그인 제거.** 접속 암호 없이 바로 트랙 선택 화면이 뜹니다. `ACCESS_CODE` 환경변수와 `/api/auth`는 삭제했습니다.
- **보고서 저장(기록) 기능 추가.** Step 4에서 「보고서 저장」을 누르면 Step 5 「기록」 보관함에 남습니다. 최근 50건까지 보관되며, 개별 HTML 다운로드·전체 JSON 내보내기/가져오기가 가능합니다.

> 주의: 로그인이 없으므로 배포 URL을 아는 사람은 누구나 API를 호출해 Anthropic 사용량을 소비할 수 있습니다. 내부 인원에게만 URL을 공유하십시오. URL을 외부에 공개해야 한다면 다시 알려주십시오 — 암호 로그인을 되살리는 건 언제든 가능합니다.

## 1. GitHub에 올리기

```bash
cd ne-geo-audit
git init
git add .
git commit -m "GEO 진단 v5 - 로그인 제거, 보고서 저장 기능"
git branch -M main
git remote add origin https://github.com/{계정}/ne-geo-audit.git
git push -u origin main
```

## 2. Vercel 배포

1. vercel.com → New Project → 저장소 Import
2. Framework Preset: **Other**
3. **Environment Variables**에 아래 하나만 추가:

   | Key | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | console.anthropic.com에서 발급한 키 |

   Production / Preview / Development **세 환경 모두 체크**하고 저장하십시오. (누락 시 실배포에 반영되지 않습니다.)

4. 환경변수를 추가/수정한 뒤에는 **Deployments → 최신 배포 → ⋯ → Redeploy** 를 반드시 실행하십시오. 저장만으로는 기존 배포에 반영되지 않습니다.
5. API 키를 아직 넣지 않아도 배포는 됩니다. 이 경우 화면 상단에 "로컬 채점 모드"로 표시되고, 자동 측정 탭만 못 쓰며 나머지(수동 캡처 + 로컬 채점 + 보고서)는 정상 작동합니다.

## 3. 사용 흐름

1. URL 접속 → **트랙 선택** (초등부/중등부/고등부/B2B/정확성/전체) — 로그인 없음
2. Step 1(환경 점검, 생략 가능) → Step 2(실측) → Step 3(진단) → Step 4(보고서)
3. Step 4에서 **「보고서 저장」**을 누르면 Step 5 「기록」 보관함에 타임스탬프와 함께 남습니다
4. 여러 명이 각자 다른 트랙을 측정한 경우, 각자 **JSON 백업**(상단 버튼)을 받아 팀장님께 전달 → Step 1 하단 "다른 트랙 데이터 합치기"에 순서대로 붙여넣어 통합

## 4. 데이터 보관 범위 (중요)

이 앱은 데이터베이스가 없습니다. 아래 두 가지는 **브라우저(localStorage)에만** 저장되며 다른 기기·다른 브라우저와 동기화되지 않습니다.

- 측정 관측 데이터 (`ne_geo_state`)
- 저장된 보고서 보관함 (`ne_geo_reports`)

브라우저 캐시를 지우면 사라집니다. 중요한 기록은 Step 5에서 HTML로 다운로드하거나, 상단 JSON 백업을 주기적으로 받아두십시오.
