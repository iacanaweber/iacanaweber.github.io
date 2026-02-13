import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  const exercises = await getCollection('exercises', ({ data }) => !data.draft);
  const homework = await getCollection('homework', ({ data }) => !data.draft);
  const tests = await getCollection('tests', ({ data }) => !data.draft);

  const allItems = [
    ...notes.map(n => ({ ...n, type: 'notes' })),
    ...exercises.map(e => ({ ...e, type: 'exercises' })),
    ...homework.map(h => ({ ...h, type: 'homework' })),
    ...tests.map(t => ({ ...t, type: 'tests' })),
  ].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Teaching Hub',
    description: 'Latest course materials, notes, exercises, and exams.',
    site: context.site!.toString(),
    items: allItems.map(item => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.description ?? `New ${item.type.slice(0, -1)} for ${item.data.course}.`,
      link: `/courses/${item.data.course}/${item.type}/${item.slug}/`,
      categories: item.data.tags,
    })),
  });
};
