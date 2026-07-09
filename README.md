# Paper Study

논문 읽고 정리하는 개인 사이트. Astro + Markdown(MDX) + KaTeX.

## 실행

```bash
cd site
npm install        # 최초 1회
npm run dev        # http://localhost:4321
```

빌드 / 미리보기:

```bash
npm run build      # dist/ 에 정적 사이트 생성
npm run preview    # 빌드 결과 로컬 확인
```

## 새 노트 추가

방법 1 — 스크립트:

```bash
npm run new sam "Segment Anything"
# src/content/notes/<오늘날짜>-sam.mdx 생성됨
```

방법 2 — 직접: `src/content/notes/` 에 `.md` 또는 `.mdx` 파일을 만들고 아래 frontmatter를 채운다.

```yaml
---
title: 노트 제목
paper: 원 논문 제목
authors: 저자
venue: NeurIPS 2017
date: 2026-07-09
tags: [transformer, rl]
status: reading      # todo | reading | done
arxiv: https://arxiv.org/abs/xxxx
pdf: 링크_또는_경로
summary: 카드에 보일 한 줄 요약
---
```

## 노트 문법

- 수식: 인라인 `$...$`, 블록 `$$...$$`  (KaTeX)
- 콜아웃(.mdx 에서): `<Callout type="insight" title="제목">...</Callout>`
  - type: `note` · `insight` · `question` · `warning`
- 코드블록, 표, 이미지 등 일반 Markdown 전부 사용 가능

## 구조

```
src/
  content/notes/     노트 (.md / .mdx)
  content.config.ts  노트 메타데이터 스키마
  components/        Callout, NoteCard
  layouts/           BaseLayout, NoteLayout
  pages/             index(목록), notes/[...slug](상세)
  styles/global.css  디자인
```

## 배포 (GitHub Pages) — 나중에

`astro.config.mjs` 의 `site` / `base` 를 채우고 GitHub Actions 로 배포.
