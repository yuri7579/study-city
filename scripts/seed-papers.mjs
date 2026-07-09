#!/usr/bin/env node
// 논문 노드(스텁 노트)를 한 번에 생성. 이미 있으면 건너뜀.
//   node scripts/seed-papers.mjs
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const notesDir = join(__dirname, '..', 'src', 'content', 'notes');
mkdirSync(notesDir, { recursive: true });

/** @type {Array<{slug:string,title:string,venue?:string,cluster:string,tags:string[],related:string[],summary:string}>} */
const papers = [
  { slug: 'mamba', title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    cluster: 'sequence-models', tags: ['state-space', 'sequence', 'efficient', 'long-range'],
    related: ['attention-is-all-you-need', 'tcn'],
    summary: '선택적 상태공간(SSM)으로 시퀀스를 선형 시간에 처리하는 구조.' },
  { slug: 'tcn', title: 'Temporal Convolutional Networks (TCN)',
    cluster: 'sequence-models', tags: ['temporal-convolution', 'sequence', 'time-series'],
    related: ['mamba'],
    summary: '인과적 팽창 합성곱으로 시계열을 다루는 Temporal Convolutional Network.' },
  { slug: 'sam', title: 'Segment Anything (SAM)',
    cluster: 'vision', tags: ['segmentation', 'foundation-model', 'vision', 'prompt'],
    related: ['off-clip', 'vggt'],
    summary: '프롬프트로 무엇이든 분할하는 비전 파운데이션 모델.' },
  { slug: 'off-clip', title: 'OFF-CLIP', venue: 'MICCAI 2025',
    cluster: 'vision', tags: ['clip', 'vision-language', 'medical-imaging', 'foundation-model'],
    related: ['sam', 'multires-3d-gan-medical'],
    summary: 'CLIP 기반의 의료영상 정렬/이상 탐지 (MICCAI 2025).' },
  { slug: 'vggt', title: 'VGGT: Visual Geometry Grounded Transformer', venue: 'CVPR 2025',
    cluster: 'vision', tags: ['3d-vision', 'transformer', 'geometry', 'pose'],
    related: ['attention-is-all-you-need', 'diff-render-pose', 'sam'],
    summary: '여러 뷰의 기하를 한 번에 추론하는 트랜스포머 (CVPR 2025).' },
  { slug: 'a3rl', title: 'A3RL',
    cluster: 'reinforcement-learning', tags: ['reinforcement-learning', 'exploration'],
    related: ['rlpd'],
    summary: '적응적 탐색을 적용한 강화학습.' },
  { slug: 'rlpd', title: 'RLPD: Efficient Online RL with Offline Data',
    cluster: 'reinforcement-learning', tags: ['reinforcement-learning', 'offline-to-online', 'sample-efficient'],
    related: ['a3rl', 'rl-soft-robot-reaching'],
    summary: '오프라인 데이터로 온라인 RL을 가속하는 방법.' },
  { slug: 'rl-soft-robot-reaching', title: 'RL-Based Adaptive Controller for High-Precision Reaching in a Soft Robot Arm',
    cluster: 'reinforcement-learning', tags: ['reinforcement-learning', 'soft-robot', 'control', 'continuum'],
    related: ['safe-continuum-marl', 'rlpd'],
    summary: '소프트 로봇 팔의 고정밀 도달을 위한 RL 적응 제어.' },
  { slug: 'safe-continuum-marl', title: 'Towards Safe Control of Continuum Manipulator Using Shielded Multi-agent RL',
    cluster: 'reinforcement-learning', tags: ['reinforcement-learning', 'continuum', 'safe-control', 'multi-agent', 'surgical-robot'],
    related: ['rl-soft-robot-reaching', 'two-segment-continuum'],
    summary: '쉴드 다중에이전트 RL로 연속체 매니퓰레이터를 안전하게 제어.' },
  { slug: 'two-segment-continuum', title: 'Two-Segment Continuum Robot',
    cluster: 'continuum-robot', tags: ['continuum', 'modeling', 'kinematics'],
    related: ['hysteresis-continuum', 'safe-continuum-marl'],
    summary: '2세그먼트 연속체 로봇의 모델링/기구학.' },
  { slug: 'hysteresis-continuum', title: 'Hysteresis Compensation of Flexible Continuum Manipulator',
    cluster: 'continuum-robot', tags: ['continuum', 'hysteresis', 'modeling', 'control'],
    related: ['two-segment-continuum', 'k-flex'],
    summary: '유연 연속체 로봇의 히스테리시스 보상.' },
  { slug: 'k-flex', title: 'K-FLEX: Surgical Flexible Continuum Robot',
    cluster: 'continuum-robot', tags: ['surgical-robot', 'continuum', 'flexible'],
    related: ['hysteresis-continuum', 'diff-render-pose'],
    summary: '수술용 유연 연속체 로봇 플랫폼.' },
  { slug: 'diff-render-pose', title: 'Differentiable Rendering-based Pose Estimation for Surgical Robotic Instruments',
    cluster: 'pose-estimation', tags: ['pose-estimation', 'differentiable-rendering', 'surgical-robot', 'vision'],
    related: ['markerless-pose', 'vggt', 'k-flex'],
    summary: '미분가능 렌더링 기반 수술 기구 포즈 추정.' },
  { slug: 'pose-estimation', title: 'Pose Estimation',
    cluster: 'pose-estimation', tags: ['pose-estimation', 'vision'],
    related: ['diff-render-pose', 'markerless-pose'],
    summary: '물체/기구의 포즈(자세) 추정.' },
  { slug: 'markerless-pose', title: 'Markerless Pose Estimation',
    cluster: 'pose-estimation', tags: ['pose-estimation', 'surgical-robot', 'markerless', 'vision'],
    related: ['diff-render-pose'],
    summary: '마커 없는 수술 기구 포즈 추정.' },
  { slug: 'laplacian-translation', title: 'High-Resolution Photorealistic Image Translation in Real-Time: A Laplacian Pyramid Translation Network',
    cluster: 'image-translation', tags: ['image-translation', 'generative', 'real-time', 'vision'],
    related: ['multires-3d-gan-medical'],
    summary: '라플라시안 피라미드로 실시간 고해상 이미지 변환.' },
  { slug: 'multires-3d-gan-medical', title: 'Multi-Resolution Guided 3D GANs for Medical Image Translation',
    cluster: 'image-translation', tags: ['gan', 'medical-imaging', 'image-translation', '3d', 'generative'],
    related: ['off-clip', 'laplacian-translation'],
    summary: '다중해상 3D GAN 기반 의료영상 변환.' },
];

const q = (s) => JSON.stringify(s); // YAML에서 유효한 이중따옴표 스칼라
let created = 0, skipped = 0;
for (const p of papers) {
  const file = join(notesDir, `${p.slug}.mdx`);
  if (existsSync(file)) { skipped++; continue; }
  const fm = [
    '---',
    `title: ${q(p.title)}`,
    `paper: ${q(p.title)}`,
    p.venue ? `venue: ${q(p.venue)}` : 'venue:',
    `tags: [${p.tags.join(', ')}]`,
    'status: todo',
    `cluster: ${p.cluster}`,
    `related: [${p.related.join(', ')}]`,
    `summary: ${q(p.summary)}`,
    '---',
    '',
    'import Callout from \'../../components/Callout.astro\';',
    '',
    '아직 정리 전이에요. 이 논문을 읽으면서 여기에 채울 예정.',
    '',
    '## 한 줄 요약',
    '',
    '## 핵심 아이디어',
    '',
    '## 방법',
    '',
    '## 메모',
    '',
  ].join('\n');
  writeFileSync(file, fm);
  created++;
}
console.log(`생성 ${created}개, 건너뜀 ${skipped}개 → ${notesDir}`);
