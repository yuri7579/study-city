#!/usr/bin/env node
// 분류(cluster)가 비어있는 노트를 Claude Haiku가 자동으로 분류한다.
// - cluster(분류) + tags(지도 연결) + summary(요약)를 채움 (비어있는 필드만).
// - ANTHROPIC_API_KEY 가 없으면 조용히 스킵(배포는 그대로 진행).
//   env: ANTHROPIC_API_KEY
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const notesDir = join(__dirname, '..', 'src', 'content', 'notes');
const MODEL = 'claude-haiku-4-5'; // 제일 가벼운 모델

if (!process.env.ANTHROPIC_API_KEY) {
  console.log('ANTHROPIC_API_KEY 없음 → 자동 분류 스킵 (배포는 계속)');
  process.exit(0);
}

const { default: Anthropic } = await import('@anthropic-ai/sdk');
const client = new Anthropic();

const files = readdirSync(notesDir).filter((f) => f.endsWith('.md'));

const getField = (fm, key) => {
  const m = fm.match(new RegExp('^' + key + ':\\s*(.*)$', 'm'));
  return m ? m[1].trim() : '';
};
const setField = (fm, key, value) => {
  const re = new RegExp('^' + key + ':.*$', 'm');
  return re.test(fm) ? fm.replace(re, `${key}: ${value}`) : `${fm}\n${key}: ${value}`;
};
const isEmptyList = (v) => v.replace(/^\[|\]$/g, '').trim() === '';

// 일관성을 위해 이미 존재하는 분류 목록 수집
const existing = new Set();
for (const f of files) {
  const fm = (readFileSync(join(notesDir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/) || [])[1] || '';
  const c = getField(fm, 'cluster').replace(/^["']|["']$/g, '');
  if (c) existing.add(c);
}

const schema = {
  type: 'object',
  properties: {
    cluster: { type: 'string', description: '2~5글자의 짧은 주제 분류명(한국어). 기존 목록과 의미가 같으면 반드시 같은 이름을 재사용.' },
    tags: { type: 'array', items: { type: 'string' }, description: '소문자 영문 태그 3~6개 (지도에서 논문 연결에 사용)' },
    summary: { type: 'string', description: '한 줄 한국어 요약' },
  },
  required: ['cluster', 'tags', 'summary'],
  additionalProperties: false,
};

let changed = 0;
for (const f of files) {
  const path = join(notesDir, f);
  const text = readFileSync(path, 'utf8');
  const m = text.match(/^(---\n)([\s\S]*?)(\n---\n?)([\s\S]*)$/);
  if (!m) continue;
  let fm = m[2];
  const body = m[4];
  if (getField(fm, 'cluster').replace(/^["']|["']$/g, '')) continue; // 이미 분류됨

  const title = getField(fm, 'title').replace(/^["']|["']$/g, '');
  const prompt = `다음 논문 스터디 노트를 분류해줘.

제목: ${title}
본문:
${(body || '').slice(0, 5000) || '(본문 없음 — 제목만 보고 판단)'}

기존 분류 목록(가능하면 이 중에서 골라 일관성 유지, 의미가 다르면 새로 만들기): ${[...existing].join(', ') || '(아직 없음)'}

규칙:
- cluster: 짧은 한국어 분류명. 위 기존 목록과 주제가 같으면 반드시 같은 이름을 그대로 사용.
- tags: 소문자 영문 태그 3~6개.
- summary: 한 줄 한국어 요약.`;

  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      output_config: { format: { type: 'json_schema', schema } },
      messages: [{ role: 'user', content: prompt }],
    });
    const block = resp.content.find((b) => b.type === 'text');
    if (!block) { console.warn(`no text for ${f}`); continue; }
    const out = JSON.parse(block.text);
    if (!out.cluster) continue;

    existing.add(out.cluster);
    fm = setField(fm, 'cluster', JSON.stringify(out.cluster));
    if (isEmptyList(getField(fm, 'tags')) && Array.isArray(out.tags) && out.tags.length) {
      fm = setField(fm, 'tags', '[' + out.tags.map((t) => JSON.stringify(String(t))).join(', ') + ']');
    }
    if (!getField(fm, 'summary').replace(/^["']|["']$/g, '') && out.summary) {
      fm = setField(fm, 'summary', JSON.stringify(out.summary));
    }
    writeFileSync(path, m[1] + fm + m[3] + body);
    changed++;
    console.log(`분류: ${f} → ${out.cluster}  [${(out.tags || []).join(', ')}]`);
  } catch (e) {
    console.warn(`실패 ${f}: ${e.message}`);
  }
}

console.log(`완료: ${changed}개 분류됨`);
