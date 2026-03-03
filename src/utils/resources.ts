import type { CollectionEntry } from 'astro:content';

export type FlatResource = {
  id: string;
  data: {
    title: string;
    course: string;
    type: 'book' | 'tool' | 'link' | 'video' | 'slides' | 'pdf' | 'other';
    url?: string;
    pdfPath?: string;
    class?: number | string;
    column?: 'materiais' | 'exercicios' | 'extra';
    description?: string;
    tags: string[];
    order: number;
  };
};

export function flattenResources(entries: CollectionEntry<'resources'>[]): FlatResource[] {
  const flattened: FlatResource[] = [];

  for (const entry of entries) {
    if ('items' in entry.data && Array.isArray(entry.data.items)) {
      entry.data.items.forEach((item, index) => {
        flattened.push({
          id: `${entry.id}--${index}`,
          data: {
            title: item.title,
            course: entry.data.course,
            type: item.type,
            url: item.url,
            pdfPath: item.pdfPath,
            class: item.class,
            column: item.column ?? entry.data.column,
            description: item.description,
            tags: item.tags ?? [],
            order: item.order ?? 0,
          },
        });
      });
      continue;
    }

    flattened.push({
      id: entry.id,
      data: {
        title: entry.data.title,
        course: entry.data.course,
        type: entry.data.type,
        url: entry.data.url,
        pdfPath: entry.data.pdfPath,
        class: entry.data.class,
        column: entry.data.column,
        description: entry.data.description,
        tags: entry.data.tags ?? [],
        order: entry.data.order ?? 0,
      },
    });
  }

  return flattened;
}
