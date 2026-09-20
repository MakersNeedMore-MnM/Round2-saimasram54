import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';
import { retrieveLegalSourcesAsync, retrieveRelevantDocumentChunks } from '@/lib/legal-rag/retriever';
import { chunkDocument } from '@/lib/document/parser';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { question, rawText, jurisdiction } = await req.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const country = jurisdiction?.country || 'United States';
    const state = jurisdiction?.state || 'California';
    const jurisdictionStr = `${state}, ${country}`;

    const legalRAG = await retrieveLegalSourcesAsync(question, country, state, 3);

    let chunksText = rawText || '';
    if (rawText && rawText.length > 500) {
      const parsedDummy = {
        text: rawText,
        pages: [{ pageNumber: 1, text: rawText }],
        totalPages: 1,
      };
      const chunks = chunkDocument(parsedDummy);
      const topChunks = retrieveRelevantDocumentChunks(question, chunks, 4);
      chunksText = topChunks.map((c) => `[${c.section} - Page ${c.pageNumber}]: "${c.text}"`).join('\n\n');
    }

    const aiProvider = getAIProvider();
    const chatResponse = await aiProvider.answerLeaseQuestion(
      question,
      chunksText,
      legalRAG.formattedContextText,
      jurisdictionStr
    );

    return NextResponse.json(chatResponse);
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred processing your lease chat question.' },
      { status: 500 }
    );
  }
}
