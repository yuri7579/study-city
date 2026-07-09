// 저장소 정보 — 사이트 내 에디터가 GitHub API로 저장할 때 사용
export const REPO = 'yuri7579/study-city';
export const BRANCH = 'main';
export const NOTES_DIR = 'src/content/notes';

// 사이트 내부 에디터 링크 (GitHub로 안 튕김)
export function writeNewUrl(): string {
  return `${import.meta.env.BASE_URL}write/`;
}
export function writeEditUrl(slug: string): string {
  return `${import.meta.env.BASE_URL}write/?slug=${encodeURIComponent(slug)}`;
}
