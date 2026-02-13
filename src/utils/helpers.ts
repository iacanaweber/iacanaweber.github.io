/**
 * Format a date for display (e.g., "15 Mar 2025").
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Build a URL path respecting the site base.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Get the material type label for display.
 */
export function materialTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    notes: 'Notes',
    exercises: 'Exercises',
    homework: 'Homework',
    tests: 'Tests & Exams',
    resources: 'Resources',
  };
  return labels[type] ?? type;
}

/**
 * Collect all unique tags from a list of items.
 */
export function collectTags(items: { data: { tags?: string[] } }[]): string[] {
  const tagSet = new Set<string>();
  for (const item of items) {
    for (const tag of item.data.tags ?? []) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}
