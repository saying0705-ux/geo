# NE능률 GEO 진단 v4

## 1. GitHub에 올리기

```bash
cd ne-geo-audit
git init
git add .
git commit -m "GEO 진단 v4"
git branch -M main
git remote add origin https://github.com/{계정}/ne-geo-audit.git
git push -u origin main
```

## 2. Vercel 배포

1. vercel.com → New Project → 방금 만든 GitHub 저장소 Import
2. Framework Preset: **Other** (정적 파일 + 서버리스 함수, 빌드 명령 없음)
3. **Environment Variables** 에 다음 두 개를 추가 (필수):

   | Key | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | console.anthropic.com에서 발급한 키 |
   | `ACCESS_CODE` | 팀 내부 접속 암호 (예: `NE2026GEO`) — 직원에게 이 값을 알려주면 로그인 화면에서 입력 |

4. Deploy 클릭 → 완료되면 `https://ne-geo-audit-xxxx.vercel.app` 형태의 URL 발급

이 두 값을 넣지 않으면 화면 상단에 "로컬 채점 모드"로 표시되며, 이때도 측정 자체는 계속 진행됩니다 (자동채점만 규칙 기반으로 대체).

## 3. 월요일 테스트 운영

1. 직원에게 배포 URL + `ACCESS_CODE` 값만 전달합니다. 계정 생성 불필요.
2. 직원이 접속하면 **트랙 선택 화면**이 뜹니다 — 초등부/중등부/고등부/B2B/정확성 중 담당 트랙 하나를 고르게 하십시오. 트랙당 문항 수:

   | 트랙 | 문항 | 기본 엔진(ChatGPT+네이버) 기준 예상 소요 |
   |---|---|---|
   | 초등부 | 4 | 약 15분 |
   | 중등부 | 3 | 약 12분 |
   | 고등부 | 2 | 약 8분 |
   | B2B | 2 | 약 8분 |
   | 정확성 검증 | 3 | 약 12분 (브랜드명 포함, 오류 직접 확인 필요) |

3. 여러 명이 나눠서 하려면 각자 다른 트랙을 고르게 하고, 끝나면 **JSON 백업**을 눌러 파일을 팀장님께 전달받으십시오.
4. 팀장님 화면의 Step 1 하단 "다른 트랙 데이터 합치기"에 각자의 JSON을 순서대로 붙여넣으면 전체 데이터가 하나로 모입니다.
5. 전체 데이터가 모이면 Step 3(진단) → Step 4(보고서)에서 통합 보고서가 나옵니다.

## 4. 데이터 보관 주의

이 앱은 별도 데이터베이스가 없습니다. 측정 데이터는 **각자의 브라우저(localStorage)에만** 저장됩니다. 브라우저 캐시를 지우면 데이터가 사라지므로, 측정이 끝나면 반드시 JSON 백업을 받아두십시오.

## 5. v3 → v4 수정 사항

- 채점 실패 시에도 로컬 규칙 기반 채점으로 자동 전환되어 절대 멈추지 않음
- 순위 입력칸의 예시 placeholder("2")가 실제 값처럼 보이던 문제 수정, 미노출 시 필드 비활성화
- 경쟁사 사전에 해외 리더스 시리즈 13종 추가 (Acorn, ORT, Step Into Reading, National Geographic Kids 등) — 이전 버전은 국내 ELT 출판사만 인식해 실제 경쟁 구도의 상당 부분을 놓치고 있었음
- 이미지 CDN·플랫폼 자체 도메인(images.openai.com 등)이 출처로 오인식되던 문제 수정
- 로그인 게이트 추가 (공유 암호 1개, 별도 계정 불필요)
- 초/중/고/B2B/정확성 트랙 분리로 1인당 작업량 축소
- Perplexity·Gemini는 기본 비활성, 필요 시에만 토글로 추가 (기본 엔진은 ChatGPT+네이버 2개로 최소화)
- 정확성 검증(E) 트랙에 문항 2개 추가(E2, E3)
