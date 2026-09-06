import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';
import { Jurisdiction } from '@/types/lease';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { fullText, pages, jurisdiction, fileName, fileSize } = await req.json();

    if (!fullText || !fullText.trim()) {
      return NextResponse.json({ error: 'Extracted document text is required for analysis.' }, { status: 400 });
    }

    const targetJurisdiction: Jurisdiction = jurisdiction || {
      country: 'United States',
      state: 'California',
      leaseType: 'Residential',
    };

    const aiProvider = getAIProvider();
    const leaseDocument = await aiProvider.analyzeDocument(
      fullText,
      targetJurisdiction,
      fileName || 'Uploaded_Lease.pdf',
      fileSize || '2.0 MB'
    );

    if (pages && Array.isArray(pages)) {
      leaseDocument.pages = pages.map((p: any) => ({
        pageNumber: p.pageNumber,
        text: p.text,
      }));
      leaseDocument.totalPages = pages.length;
    }

    return NextResponse.json(leaseDocument);
  } catch (error: any) {
    console.error('API /api/documents/analyze error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during Gemini document analysis.' },
      { status: 500 }
    );
  }
}
