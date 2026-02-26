export interface ClassEntry {
  /** Class number. null for special entries without a number (e.g. Prova de G2). */
  number: number | null;
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

    // Match both hex (#FFA500) and named (LightGrey, AliceBlue) colors
    const colorMatch = rowAttrs.match(/background-color:(#[0-9A-Fa-f]+|[A-Za-z]+)/i);
    const bgColor = colorMatch ? colorMatch[1] : '#FFFFFF';

    const numberStr = extractField(rowContent, 'Aula');
    const activity   = extractField(rowContent, 'Atividade');
    const description = extractField(rowContent, 'Descricao');

    // Skip rows with no useful data (e.g. the header row)
    if (!numberStr && !activity && !description) continue;

    entries.push({
      number: numberStr ? parseInt(numberStr, 10) : null,
      day: extractField(rowContent, 'Dia'),
      date: extractField(rowContent, 'Data'),
      description,
      activity,
      resources: extractField(rowContent, 'Recursos'),
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
