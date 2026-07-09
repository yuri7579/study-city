export interface Cluster {
  id: string;
  label: string;
  color: string; // 네온 팔레트 (사이버펑크 도시)
}

export const CLUSTERS: Cluster[] = [
  { id: 'sequence-models',        label: '시퀀스 모델',      color: '#22d3ee' }, // cyan
  { id: 'vision',                 label: '비전·파운데이션',   color: '#00ffa3' }, // neon green
  { id: 'reinforcement-learning', label: '강화학습',         color: '#ff9f1c' }, // amber
  { id: 'continuum-robot',        label: '연속체·수술로봇',   color: '#ff3df0' }, // magenta
  { id: 'pose-estimation',        label: '포즈 추정',        color: '#ffe14d' }, // yellow
  { id: 'image-translation',      label: '이미지 변환·생성',  color: '#ff4d6d' }, // red-pink
];

export const CLUSTER_COLOR: Record<string, string> = Object.fromEntries(
  CLUSTERS.map((c) => [c.id, c.color]),
);

export const DEFAULT_COLOR = '#8ab4ff';
