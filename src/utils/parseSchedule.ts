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

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractDefaultRoom(html: string): string {
  const titleCandidates: string[] = [];

  const spanTitleRegex = /id="[^"]*lblTitulo"[^>]*>([\s\S]*?)<\/span>/gi;
  let spanMatch: RegExpExecArray | null;
  while ((spanMatch = spanTitleRegex.exec(html)) !== null) {
    titleCandidates.push(spanMatch[1]);
  }

  const h1TitleRegex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let h1Match: RegExpExecArray | null;
  while ((h1Match = h1TitleRegex.exec(html)) !== null) {
    titleCandidates.push(h1Match[1]);
  }

  for (const rawTitle of titleCandidates) {
    const title = decodeHtml(rawTitle)
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Supports rooms like "11/704", "32/410", and "30/D/303".
    const roomMatch = title.match(/-\s*([A-Za-z0-9]+(?:\/[A-Za-z0-9]+)+)\s*$/);
    if (roomMatch) return roomMatch[1];
  }

  return '';
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
  const defaultRoom = extractDefaultRoom(html);

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

export async function fetchSchedule(urlOrPath: string): Promise<ScheduleInfo> {
  try {
    let html: string;
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      const response = await fetch(urlOrPath, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IacanaWeberSite/1.0)' },
      });
      if (!response.ok) {
        console.warn(`[parseSchedule] fetch failed: ${response.status} ${response.statusText}`);
        return { defaultRoom: '', entries: [] };
      }
      html = await response.text();
    } else {
      const { readFileSync } = await import('fs');
      const { resolve } = await import('path');
      html = readFileSync(resolve(process.cwd(), urlOrPath), 'utf-8');
    }
    return parseScheduleHtml(html);
  } catch (error) {
    console.error('[parseSchedule] error:', error);
    return { defaultRoom: '', entries: [] };
  }
}
