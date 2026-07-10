// 미리 정해진 분류 목록은 없음.
// 노트 frontmatter의 cluster 값에서 실제 존재하는 분류만 모아 색을 동적으로 부여한다.
// (분류는 사용자가 직접 적거나, 나중에 AI가 자동으로 채울 수 있음)

export const PALETTE = [
  '#22d3ee', '#00ffa3', '#ff9f1c', '#ff3df0', '#ffe14d', '#ff4d6d',
  '#7c5cff', '#33e0ff', '#9dff4d', '#ff7847', '#4dd4ff', '#c86bff',
];

export const DEFAULT_COLOR = '#8ab4ff';

// 분류 이름들 → {이름: 색} 매핑 (정렬 순서 기준으로 팔레트 배정)
export function buildClusterColors(names: (string | null | undefined)[]): Record<string, string> {
  const sorted = [...new Set(names.filter((n): n is string => !!n))].sort();
  const map: Record<string, string> = {};
  sorted.forEach((n, i) => { map[n] = PALETTE[i % PALETTE.length]; });
  return map;
}
