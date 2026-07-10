// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 로컬 개발/빌드는 base '/', GitHub Actions 빌드에서만 '/study-city'.
// (프로젝트 페이지 → https://yuri7579.github.io/study-city/)
const base = process.env.GITHUB_ACTIONS ? '/study-city/' : '/';

export default defineConfig({
  site: 'https://yuri7579.github.io',
  base,
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
