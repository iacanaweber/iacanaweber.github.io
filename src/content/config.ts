import { defineCollection, z } from 'astro:content';

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortName: z.string(),
    description: z.string(),
    semester: z.string(),
    schedule: z.string().optional(),
    objectives: z.array(z.string()).optional(),
    bibliography: z.array(z.string()).optional(),
    color: z.string().default('#2563eb'),
    order: z.number().default(0),
  }),
});

const materialSchema = z.object({
  title: z.string(),
  course: z.string(),
  date: z.date(),
  tags: z.array(z.string()).default([]),
  description: z.string().optional(),
  pdfLink: z.string().optional(),
  sourceLink: z.string().optional(),
  solutionsAvailable: z.boolean().default(false),
  solutionsPublic: z.boolean().default(false),
  lastUpdated: z.date().optional(),
  math: z.boolean().default(false),
  draft: z.boolean().default(false),
});

const notes = defineCollection({ type: 'content', schema: materialSchema });
const exercises = defineCollection({ type: 'content', schema: materialSchema });
const homework = defineCollection({ type: 'content', schema: materialSchema });
const tests = defineCollection({ type: 'content', schema: materialSchema });

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    course: z.string(),
    type: z.enum(['book', 'tool', 'link', 'video', 'other']),
    url: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['journal', 'conference', 'tcc', 'masters', 'phd']),
    authors: z.string(),
    year: z.number(),
    venue: z.string(),
    url: z.string().optional(),
    doi: z.string().optional(),
    abstract: z.string().optional(),
    defensePhoto: z.string().optional(),
    defenseDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

export const collections = { courses, notes, exercises, homework, tests, resources, publications };
