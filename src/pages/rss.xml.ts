import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  return rss({
    title: 'Iaçanã Ianiski Weber',
    description: 'Personal academic site — courses, publications, and research.',
    site: context.site!.toString(),
    items: [],
  });
};
