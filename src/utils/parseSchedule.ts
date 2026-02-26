export interface ClassEntry {
  number: number;
  day: string;
  date: string;
  description: string;
  activity: string;
  /** Room/lab override from lblRecursos (e.g. "Laboratório - 412"). Empty when class is in the default room. */
  resources: string;
  bgColor: string;
}

export interface ScheduleInfo {
  /** Default room for the course: "32/314" format (building/room). */
  defaultRoom: string;
  entries: ClassEntry[];
}

function extractField(rowHtml: string, field: string): string {
  const regex = new RegExp(`_lbl${field}"[^>]*>([\\s\\S]*?)<\\/span>`, 'i');
  const match = rowHtml.match(regex);
  if (!match) return '';
  return match[1]
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export function parseScheduleHtml(html: string): ScheduleInfo {
  // Extract default room from title: "98G08-4 Disciplina (30) - 32/314"
  const titleMatch = html.match(/id="lblTitulo">([^<]+)<\/span>/i);
  let defaultRoom = '';
  if (titleMatch) {
    const roomMatch = titleMatch[1].match(/- (\d+\/\d+)$/);
    defaultRoom = roomMatch ? roomMatch[1] : '';
  }

  const entries: ClassEntry[] = [];
  const rowRegex = /<tr([^>]*)>([\s\S]*?)<\/tr>/gi;

  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowAttrs = rowMatch[1];
    const rowContent = rowMatch[2];

    if (!rowContent.includes('_lblAula')) continue;

    const colorMatch = rowAttrs.match(/background-color:(#[0-9A-Fa-f]+)/i);
    const bgColor = colorMatch ? colorMatch[1].toUpperCase() : '#FFFFFF';

    const numberStr = extractField(rowContent, 'Aula');
    if (!numberStr) continue;

    entries.push({
      number: parseInt(numberStr, 10),
      day: extractField(rowContent, 'Dia'),
      date: extractField(rowContent, 'Data'),
      description: extractField(rowContent, 'Descricao'),
      activity: extractField(rowContent, 'Atividade'),
      resources: extractField(rowContent, 'Recursos'), // non-empty → overrides default room
      bgColor,
    });
  }

  return { defaultRoom, entries };
}

export async function fetchSchedule(url: string): Promise<ScheduleInfo> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TeachingHub/1.0)' },
    });
    if (!response.ok) {
      console.warn(`[parseSchedule] fetch failed: ${response.status} ${response.statusText}`);
      return { defaultRoom: '', entries: [] };
    }
    const html = await response.text();
    return parseScheduleHtml(html);
  } catch (error) {
    console.error('[parseSchedule] network error:', error);
    return { defaultRoom: '', entries: [] };
  }
}
