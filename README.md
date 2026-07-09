# study-city — 논문 스터디

논문을 읽고 정리하는 개인 사이트. 홈은 3D 사이버펑크 "나이트시티" 지도로, 논문이 네온 타워가 되고 연관도로 이어져요. 타워를 클릭하면 그 논문 노트로 들어가고, 노트는 사이트 안 에디터에서 바로 작성합니다.

라이브: https://yuri7579.github.io/study-city/

## 노트 쓰기 (사이트 안에서, 중간에 GitHub로 안 튕김)

1. 사이트에서 "+ 새 노트 쓰기" 또는 `/write` 로 이동
2. 처음 한 번만 토큰 설정 — 상단 🔑 버튼 → fine-grained PAT 붙여넣기
   - https://github.com/settings/personal-access-tokens/new
   - Repository access: `study-city` 저장소만
   - Permissions → Contents: Read and write
   - 토큰은 이 브라우저(localStorage)에만 저장되고, 오직 GitHub API로만 전송됩니다
3. 왼쪽에 자유롭게 작성 — 마크다운 + 수식(`$...$`, `$$...$$`) + 이미지(붙여넣기/드래그)
4. 오른쪽 실시간 미리보기 확인 → [저장] → GitHub에 커밋 → 1~2분 뒤 라이브 반영

기존 노트 수정은 노트 페이지의 "✎ 편집" 버튼 (같은 에디터로 열림).

## 지도

- 노드 = 논문, 색 = 클러스터(시퀀스 / 비전 / 강화학습 / 연속체·수술로봇 / 포즈 / 이미지변환)
- 선 = 연관도 (태그 공유 + frontmatter의 `related`)
- 좌우 드래그 회전 · 두 손가락(우클릭) 드래그 이동 · 스크롤 확대 · 타워 클릭 → 노트

## 로컬 개발

```bash
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 정적 빌드
npm run preview  # 빌드 결과 미리보기
```

## 배포

`main` 에 push하면 GitHub Actions(`withastro/action` + `actions/deploy-pages`)가 자동으로 빌드·배포합니다.
설정: Pages Source = "GitHub Actions", `base` = `/study-city` (Actions 빌드에서만, 로컬은 `/`).

## 노트 형식 (`.md`)

```yaml
---
title: 제목
venue: NeurIPS 2017            # 선택
date: 2026-07-09
tags: [transformer, attention] # 지도 연결(엣지)에 사용
status: reading                # todo | reading | done
cluster: sequence-models       # 지도 색 그룹
related: [mamba, tcn]          # 명시적 연관 노트 slug
arxiv: https://...             # 선택
summary:                       # 선택
---

본문은 완전 자유 (마크다운 + 수식 + 이미지). 강요된 목차 없음.
```

클러스터 id: `sequence-models`, `vision`, `reinforcement-learning`, `continuum-robot`, `pose-estimation`, `image-translation` (`src/data/clusters.ts`에서 색 정의)

## 구조

```
src/
  pages/index.astro      3D 나이트시티 지도 (홈)
  pages/list.astro       논문 목록
  pages/write.astro      사이트 내 노트 에디터 (미리보기 + GitHub 저장)
  pages/notes/[...slug]  노트 상세
  content/notes/*.md     노트 파일
  content.config.ts      노트 frontmatter 스키마
  data/clusters.ts       클러스터(주제 그룹) 색
  data/site.ts           저장소 정보 (에디터가 저장할 때 사용)
  layouts/ components/ styles/
scripts/reset-notes.mjs  노트 일괄 초기화 (일회성 유틸)
.github/workflows/deploy.yml
```

## 스택

Astro · three.js + 3d-force-graph(지도) · KaTeX(수식) · marked(에디터 미리보기) · GitHub Pages
