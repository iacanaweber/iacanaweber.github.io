import { defineCollection, z } from 'astro:content';

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortName: z.string(),
    description: z.string(),
    semester: z.string(),
    schedule: z.string().optional(),
    scheduleUrl: z.string().optional(),
    objectives: z.array(z.string()).optional(),
    bibliography: z.array(z.string()).optional(),
    color: z.string().default('#2563eb'),
    order: z.number().default(0),
  }),
});

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    course: z.string(),
    type: z.enum(['book', 'tool', 'link', 'video', 'slides', 'pdf', 'other']),
    /** External URL (e.g. Google Drive, website). */
    url: z.string().optional(),
    /** Path to a local file in public/ (e.g. "/courses/css/slides-01.pdf"). */
    pdfPath: z.string().optional(),
    /**
     * Class number this resource belongs to. If set, appears in the schedule table.
     * Use a number for a single class (e.g. 5) or a string range (e.g. "5-6") to span rows.
     */
    class: z.union([z.number(), z.string()]).optional(),
    /**
     * Which column of the schedule table this resource appears in.
     * Defaults: slides/pdf/link → "materiais", everything else → "extra".
     */
    column: z.enum(['materiais', 'exercicios', 'extra']).optional(),
    description: z.string().optional(),
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

export const collections = { courses, resources, publications };
