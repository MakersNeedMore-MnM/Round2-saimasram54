import { NextRequest, NextResponse } from 'next/server';
import { extractPdfPageText, validatePdfSignature } from '@/lib/pdf/extractText';
import { saveTempFile, deleteTempFile } from '@/lib/storage/tempFiles';
import { parseDocumentBuffer } from '@/lib/document/parser';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  let tempFilePath = '';

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No document file uploaded.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Please upload a document smaller than 25 MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save temporary file safely
    tempFilePath = await saveTempFile(buffer, file.name);

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');

    if (isPdf) {
      // Step 1: Validate PDF magic bytes
      const isValidSig = validatePdfSignature(buffer);
      if (!isValidSig) {
        return NextResponse.json(
          { error: 'This file appears to be corrupted or is not a valid PDF document.' },
          { status: 400 }
        );
      }

      // Step 2 & 3: Run page-aware text extraction & Vision OCR fallback if needed
      const extractionResult = await extractPdfPageText(buffer);

      if (!extractionResult.success || !extractionResult.fullText || extractionResult.fullText.trim().length === 0) {
        return NextResponse.json(
          { error: 'Unable to extract readable text from this PDF document even after Vision OCR extraction.' },
          { status: 422 }
        );
      }

      return NextResponse.json(extractionResult);
    } else {
      // Non-PDF fallback (DOCX or TXT)
      const parsedDoc = await parseDocumentBuffer(buffer, file.name);
      return NextResponse.json({
        success: true,
        pageCount: parsedDoc.totalPages,
        pages: parsedDoc.pages.map((p) => ({
          pageNumber: p.pageNumber,
          text: p.text,
          characterCount: p.text.length,
          extractionMethod: 'pdf_text',
        })),
        fullText: parsedDoc.text,
        extractionMethod: 'pdf_text',
        confidence: 'high',
      });
    }
  } catch (error: any) {
    console.error('API /api/documents/upload error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during document upload & extraction.' },
      { status: 500 }
    );
  } finally {
    if (tempFilePath) {
      await deleteTempFile(tempFilePath);
    }
  }
}
