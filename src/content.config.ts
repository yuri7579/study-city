import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    paper: z.string().nullish(),      // 원 논문 제목
    authors: z.string().nullish(),    // 저자
    venue: z.string().nullish(),      // 학회/저널 (예: NeurIPS 2017)
    date: z.coerce.date().nullish(),  // 정리한 날짜
    tags: z.array(z.string()).default([]),
    status: z.enum(['todo', 'reading', 'done']).default('reading'),
    cluster: z.string().nullish(),           // 지도 클러스터(주제 그룹 id)
    related: z.array(z.string()).default([]),  // 명시적 연관 노트 slug
    arxiv: z.string().url().nullish(),
    pdf: z.string().nullish(),        // PDF 링크 또는 경로
    summary: z.string().nullish(),    // 카드에 보일 한 줄 요약
  }),
});

export const collections = { notes };
