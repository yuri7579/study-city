#!/usr/bin/env node
// 모든 노트를 '빈 템플릿'으로 초기화(덮어쓰기).
// 지도용 구조(title/venue/tags/cluster/related/arxiv)는 남기고,
// summary와 본문은 비워서 사용자가 직접 채우게 함.
//   node scripts/reset-notes.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const notesDir = join(__dirname, '..', 'src', 'content', 'notes');
mkdirSync(notesDir, { recursive: true });

const papers = [
  { slug: 'attention-is-all-you-need', title: 'Attention Is All You Need', venue: 'NeurIPS 2017', arxiv: 'https://arxiv.org/abs/1706.03762', cluster: 'sequence-models', tags: ['transformer', 'attention', 'nlp', 'sequence'], related: ['mamba', 'tcn', 'vggt'] },
  { slug: 'mamba', title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces', cluster: 'sequence-models', tags: ['state-space', 'sequence', 'efficient', 'long-range'], related: ['attention-is-all-you-need', 'tcn'] },
  { slug: 'tcn', title: 'Temporal Convolutional Networks (TCN)', cluster: 'sequence-models', tags: ['temporal-convolution', 'sequence', 'time-series'], related: ['mamba'] },
  { slug: 'sam', title: 'Segment Anything (SAM)', cluster: 'vision', tags: ['segmentation', 'foundation-model', 'vision', 'prompt'], related: ['off-clip', 'vggt'] },
  { slug: 'off-clip', title: 'OFF-CLIP', venue: 'MICCAI 2025', cluster: 'vision', tags: ['clip', 'vision-language', 'medical-imaging', 'foundation-model'], related: ['sam', 'multires-3d-gan-medical'] },
  { slug: 'vggt', title: 'VGGT: Visual Geometry Grounded Transformer', venue: 'CVPR 2025', cluster: 'vision', tags: ['3d-vision', 'transformer', 'geometry', 'pose'], related: ['attention-is-all-you-need', 'diff-render-pose', 'sam'] },
  { slug: 'a3rl', title: 'A3RL', cluster: 'reinforcement-learning', tags: ['reinforcement-learning', 'exploration'], related: ['rlpd'] },
  { slug: 'rlpd', title: 'RLPD: Efficient Online RL with Offline Data', cluster: 'reinforcement-learning', tags: ['reinforcement-learning', 'offline-to-online', 'sample-efficient'], related: ['a3rl', 'rl-soft-robot-reaching'] },
  { slug: 'rl-soft-robot-reaching', title: 'RL-Based Adaptive Controller for High-Precision Reaching in a Soft Robot Arm', cluster: 'reinforcement-learning', tags: ['reinforcement-learning', 'soft-robot', 'control', 'continuum'], related: ['safe-continuum-marl', 'rlpd'] },
  { slug: 'safe-continuum-marl', title: 'Towards Safe Control of Continuum Manipulator Using Shielded Multi-agent RL', cluster: 'reinforcement-learning', tags: ['reinforcement-learning', 'continuum', 'safe-control', 'multi-agent', 'surgical-robot'], related: ['rl-soft-robot-reaching', 'two-segment-continuum'] },
  { slug: 'two-segment-continuum', title: 'Two-Segment Continuum Robot', cluster: 'continuum-robot', tags: ['continuum', 'modeling', 'kinematics'], related: ['hysteresis-continuum', 'safe-continuum-marl'] },
  { slug: 'hysteresis-continuum', title: 'Hysteresis Compensation of Flexible Continuum Manipulator', cluster: 'continuum-robot', tags: ['continuum', 'hysteresis', 'modeling', 'control'], related: ['two-segment-continuum', 'k-flex'] },
  { slug: 'k-flex', title: 'K-FLEX: Surgical Flexible Continuum Robot', cluster: 'continuum-robot', tags: ['surgical-robot', 'continuum', 'flexible'], related: ['hysteresis-continuum', 'diff-render-pose'] },
  { slug: 'diff-render-pose', title: 'Differentiable Rendering-based Pose Estimation for Surgical Robotic Instruments', cluster: 'pose-estimation', tags: ['pose-estimation', 'differentiable-rendering', 'surgical-robot', 'vision'], related: ['markerless-pose', 'vggt', 'k-flex'] },
  { slug: 'pose-estimation', title: 'Pose Estimation', cluster: 'pose-estimation', tags: ['pose-estimation', 'vision'], related: ['diff-render-pose', 'markerless-pose'] },
  { slug: 'markerless-pose', title: 'Markerless Pose Estimation', cluster: 'pose-estimation', tags: ['pose-estimation', 'surgical-robot', 'markerless', 'vision'], related: ['diff-render-pose'] },
  { slug: 'laplacian-translation', title: 'High-Resolution Photorealistic Image Translation in Real-Time: A Laplacian Pyramid Translation Network', cluster: 'image-translation', tags: ['image-translation', 'generative', 'real-time', 'vision'], related: ['multires-3d-gan-medical'] },
  { slug: 'multires-3d-gan-medical', title: 'Multi-Resolution Guided 3D GANs for Medical Image Translation', cluster: 'image-translation', tags: ['gan', 'medical-imaging', 'image-translation', '3d', 'generative'], related: ['off-clip', 'laplacian-translation'] },
];

const q = (s) => JSON.stringify(s);
const body = `
import Callout from '../../components/Callout.astro';

## 한 줄 요약

## 핵심 아이디어

## 방법

## 실험·결과

## 메모
`;

let n = 0;
for (const p of papers) {
  const fm = [
    '---',
    `title: ${q(p.title)}`,
    p.venue ? `venue: ${q(p.venue)}` : 'venue:',
    'tags: [' + p.tags.join(', ') + ']',
    'status: todo',
    `cluster: ${p.cluster}`,
    'related: [' + (p.related || []).join(', ') + ']',
    p.arxiv ? `arxiv: ${p.arxiv}` : 'arxiv:',
    'summary:',
    '---',
  ].join('\n');
  writeFileSync(join(notesDir, `${p.slug}.mdx`), fm + '\n' + body);
  n++;
}
console.log(`${n}개 노트를 빈 템플릿으로 초기화함 → ${notesDir}`);
