// 저장소 정보 — "사이트에서 바로 편집" 링크 생성에 사용
export const REPO = 'yuri7579/study-city';
export const BRANCH = 'main';
export const NOTES_DIR = 'src/content/notes';

// 특정 노트를 GitHub 웹 편집기로 여는 URL
export function editUrl(slug: string): string {
  return `https://github.com/${REPO}/edit/${BRANCH}/${NOTES_DIR}/${slug}.mdx`;
}

// 새 노트 파일을 (템플릿이 채워진 채로) GitHub에서 만드는 URL
export function newNoteUrl(): string {
  const today = new Date().toISOString().slice(0, 10);
  const template = `---
title: 새 논문 제목
venue:
date: ${today}
tags: []
status: reading
cluster: sequence-models
related: []
arxiv:
summary:
---

import Callout from '../../components/Callout.astro';

## 한 줄 요약

## 핵심 아이디어

## 방법

## 메모
`;
  const params = new URLSearchParams({
    filename: `${NOTES_DIR}/new-note.mdx`,
    value: template,
  });
  return `https://github.com/${REPO}/new/${BRANCH}?${params.toString()}`;
}
