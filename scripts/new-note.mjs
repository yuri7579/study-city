#!/usr/bin/env node
// 새 노트 파일을 만든다.
//   node scripts/new-note.mjs <slug> [제목...]
// 예: node scripts/new-note.mjs sam "Segment Anything"
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const notesDir = join(__dirname, '..', 'src', 'content', 'notes');

const [slug, ...titleParts] = process.argv.slice(2);
if (!slug) {
  console.error('사용법: node scripts/new-note.mjs <slug> [제목...]');
  process.exit(1);
}
const title = titleParts.join(' ') || slug;
const today = new Date().toISOString().slice(0, 10);
const file = join(notesDir, `${today}-${slug}.mdx`);

if (existsSync(file)) {
  console.error(`이미 있음: ${file}`);
  process.exit(2);
}

const template = `---
title: ${title}
paper: ${title}
authors:
venue:
date: ${today}
tags: []
status: reading
arxiv:
pdf:
summary:
---

import Callout from '../../components/Callout.astro';

## 한 줄 요약

## 핵심 아이디어

<Callout type="insight" title="핵심">
</Callout>

## 방법

## 메모

- [ ]
`;

mkdirSync(notesDir, { recursive: true });
writeFileSync(file, template);
console.log(`생성됨: ${file}`);
