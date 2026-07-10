#!/usr/bin/env node
// 무료 자동 분류: GitHub Models(GitHub Actions 내장 토큰)로 빈 분류 노트를 분류한다.
// - cluster(분류) + tags(지도 연결) + summary(요약)를 채움 (비어있는 필드만).
// - GITHUB_TOKEN 이 없으면 조용히 스킵(배포는 계속). (로컬 실행 시 스킵)
//   env: GITHUB_TOKEN  (워크플로에서 ${{ github.token }} + permissions: models: read)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const notesDir = join(__dirname, '..', 'src', 'content', 'notes');

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_MODELS_TOKEN;
const MODEL = 'openai/gpt-4o-mini';       // GitHub Models 무료 모델
const ENDPOINT = 'https://models.github.ai/inference/chat/completions';

if (!TOKEN) {
  console.log('GITHUB_TOKEN 없음 → 자동 분류 스킵 (배포는 계속)');
  process.exit(0);
}

const getField = (fm, key) => {
  const m = fm.match(new RegExp('^' + key + ':\\s*(.*)$', 'm'));
  return m ? m[1].trim() : '';
};
const setField = (fm, key, value) => {
  const re = new RegExp('^' + key + ':.*$', 'm');
  return re.test(fm) ? fm.replace(re, `${key}: ${value}`) : `${fm}\n${key}: ${value}`;
};
const unquote = (v) => v.replace(/^["']|["']$/g, '');
const isEmptyList = (v) => v.replace(/^\[|\]$/g, '').trim() === '';

const files = readdirSync(notesDir).filter((f) => f.endsWith('.md'));

// 일관성을 위해 이미 존재하는 분류 수집
const existing = new Set();
for (const f of files) {
  const fm = (readFileSync(join(notesDir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/) || [])[1] || '';
  const c = unquote(getField(fm, 'cluster'));
  if (c) existing.add(c);
}
const errors = [];

async function classify(title, body) {
  const system = '너는 논문 스터디 노트를 분류하는 도우미다. 반드시 JSON 객체 하나만 출력한다.';
  const user = `아래 노트를 분류해서 JSON으로만 답해.

제목: ${title}
본문:
${(body || '').slice(0, 5000) || '(본문 없음 — 제목만 보고 판단)'}

기존 분류 목록(가능하면 이 중 하나를 그대로 재사용, 의미가 다르면 새로 만들기): ${[...existing].join(', ') || '(아직 없음)'}

출력 형식(키 이름 그대로, 값만 채우기):
{"cluster": "짧은 한국어 분류명", "tags": ["소문자영문태그", "3~6개"], "summary": "한 줄 한국어 요약"}`;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 400,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 600)}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('빈 응답');
  return JSON.parse(content);
}

let changed = 0;
for (const f of files) {
  const path = join(notesDir, f);
  const text = readFileSync(path, 'utf8');
  const m = text.match(/^(---\n)([\s\S]*?)(\n---\n?)([\s\S]*)$/);
  if (!m) continue;
  let fm = m[2];
  const body = m[4];
  if (unquote(getField(fm, 'cluster'))) continue; // 이미 분류됨

  const title = unquote(getField(fm, 'title'));
  try {
    const out = await classify(title, body);
    if (!out || !out.cluster) continue;
    existing.add(out.cluster);
    fm = setField(fm, 'cluster', JSON.stringify(String(out.cluster)));
    if (isEmptyList(getField(fm, 'tags')) && Array.isArray(out.tags) && out.tags.length) {
      fm = setField(fm, 'tags', '[' + out.tags.map((t) => JSON.stringify(String(t))).join(', ') + ']');
    }
    if (!unquote(getField(fm, 'summary')) && out.summary) {
      fm = setField(fm, 'summary', JSON.stringify(String(out.summary)));
    }
    writeFileSync(path, m[1] + fm + m[3] + body);
    changed++;
    console.log(`분류: ${f} → ${out.cluster}  [${(out.tags || []).join(', ')}]`);
  } catch (e) {
    console.warn(`실패 ${f}: ${e.message}`);
    errors.push(`${f}: ${e.message}`);
  }
}

if (errors.length) {
  try {
    writeFileSync(
      join(__dirname, '..', 'categorize-debug.txt'),
      `MODEL=${MODEL}\nENDPOINT=${ENDPOINT}\n\n` + errors.join('\n\n') + '\n',
    );
  } catch {}
}
console.log(`완료: ${changed}개 분류됨, 에러 ${errors.length}건`);
