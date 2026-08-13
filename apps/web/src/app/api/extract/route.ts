import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // Dynamic import for pdf-parse in Node runtime
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse');
      const parsed = await pdfParse(buffer);
      return NextResponse.json({
        text: parsed.text || '',
        info: parsed.info,
        numpages: parsed.numpages,
      });
    } else {
      // Plain text / markdown / code file
      const text = buffer.toString('utf-8');
      return NextResponse.json({ text });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error extracting document';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
