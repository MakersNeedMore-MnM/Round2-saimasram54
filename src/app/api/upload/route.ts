import { NextRequest, NextResponse } from 'next/server';
import { extractPdfPageText, validatePdfSignature } from '@/lib/pdf/extractText';
import { parseDocumentBuffer } from '@/lib/document/parser';
import { getAIProvider } from '@/lib/ai';
import { Jurisdiction } from '@/types/lease';
import { SAMPLE_LEASE_ANALYSIS } from '@/lib/document/sample-lease';
import { saveTempFile, deleteTempFile } from '@/lib/storage/tempFiles';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  let tempFilePath = '';

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const country = (formData.get('country') as string) || 'United States';
    const state = (formData.get('state') as string) || 'California';
    const leaseType = (formData.get('leaseType') as any) || 'Residential';

    const jurisdiction: Jurisdiction = { country, state, leaseType };

    if (!file) {
      return NextResponse.json({
        ...SAMPLE_LEASE_ANALYSIS,
        jurisdiction,
      });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Please upload a PDF or document smaller than 25 MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    tempFilePath = await saveTempFile(buffer, file.name);

    let fullText = '';
    let pageCount = 1;
    let extractedPages: any[] = [];

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');

    if (isPdf) {
      // Validate PDF signature
      const isValidPdf = validatePdfSignature(buffer);
      if (!isValidPdf) {
        return NextResponse.json(
          { error: 'This file appears to be corrupted or is not a valid PDF document.' },
          { status: 400 }
        );
      }

      // Page-aware extraction + Gemini Vision OCR Fallback for scanned pages
      const extractionResult = await extractPdfPageText(buffer);

      if (!extractionResult.success || !extractionResult.fullText || extractionResult.fullText.trim().length === 0) {
        return NextResponse.json(
          { error: 'Could not extract readable text from this document even after Vision OCR fallback.' },
          { status: 422 }
        );
      }

      fullText = extractionResult.fullText;
      pageCount = extractionResult.pageCount;
      extractedPages = extractionResult.pages;
    } else {
      const parsedDoc = await parseDocumentBuffer(buffer, file.name);
      fullText = parsedDoc.text;
      pageCount = parsedDoc.totalPages;
      extractedPages = parsedDoc.pages;
    }

    // Call active AI Provider for structured analysis
    const aiProvider = getAIProvider();
    const leaseDocument = await aiProvider.analyzeDocument(
      fullText,
      jurisdiction,
      file.name,
      `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    );

    leaseDocument.pages = extractedPages.map((p) => ({
      pageNumber: p.pageNumber,
      text: p.text,
    }));
    leaseDocument.totalPages = pageCount;

    return NextResponse.json(leaseDocument);
  } catch (error: any) {
    console.error('API /api/upload error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during document processing.' },
      { status: 500 }
    );
  } finally {
    if (tempFilePath) {
      await deleteTempFile(tempFilePath);
    }
  }
}
