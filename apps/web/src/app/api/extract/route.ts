import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // PDF binary parsing is not available in Edge Runtime.
      // Read raw bytes and attempt to extract visible text fragments.
      const raw = await file.text();
      // Grab parenthesized strings from PDF stream (very basic heuristic)
      const fragments = raw.match(/\(([^)]{1,500})\)/g);
      const text = fragments
        ? fragments.map((m) => m.slice(1, -1)).join(' ')
        : '';
      return NextResponse.json({ text, info: {}, numpages: 0 });
    } else {
      // Plain text / markdown / code file
      const text = await file.text();
      return NextResponse.json({ text });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error extracting document';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
