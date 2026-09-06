import { ExtractionResult, ExtractedPage, ExtractionMethod } from '@/types/document';
import { evaluateExtractionQuality } from './detectQuality';
import { processPagesWithVisionFallback } from './ocrFallback';

export function validatePdfSignature(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  // Magic bytes for %PDF- are 0x25, 0x50, 0x44, 0x46, 0x2D
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  );
}

export async function extractPdfPageText(buffer: Buffer): Promise<ExtractionResult> {
  // Step 1: Magic bytes signature check
  const isValidPdf = validatePdfSignature(buffer);
  if (!isValidPdf) {
    return {
      success: false,
      pageCount: 0,
      pages: [],
      fullText: '',
      extractionMethod: 'pdf_text',
      confidence: 'low',
      warning: 'Invalid PDF signature or corrupted file header.',
    };
  }

  let rawText = '';
  let pageCount = 1;
  let rawPages: ExtractedPage[] = [];

  try {
    // Lazy require pdf-parse
    const pdfParse = require('pdf-parse');
    
    // Pass custom pager callback if supported to extract per-page text cleanly
    const options = {
      pagerender: function (pageData: any) {
        return pageData.getTextContent().then(function (textContent: any) {
          let lastY, text = '';
          for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY) {
              text += item.str;
            } else {
              text += '\n' + item.str;
            }
            lastY = item.transform[5];
          }
          return `--- PAGE ${pageData.pageIndex + 1} ---\n` + text;
        });
      },
    };

    const data = await pdfParse(buffer, options);
    rawText = data.text || '';
    pageCount = data.numpages || 1;

    // Split text by page markers
    const pageSplits = rawText.split(/--- PAGE \d+ ---/);
    const matches = Array.from(rawText.matchAll(/--- PAGE (\d+) ---/g));

    if (matches.length > 0) {
      matches.forEach((m, idx) => {
        const pNum = parseInt(m[1], 10);
        const pText = pageSplits[idx + 1] ? pageSplits[idx + 1].trim() : '';
        rawPages.push({
          pageNumber: pNum,
          text: pText,
          characterCount: pText.length,
          extractionMethod: 'pdf_text',
        });
      });
    } else {
      // Fallback page splitting
      const chunkSize = Math.max(800, Math.ceil(rawText.length / pageCount));
      for (let i = 1; i <= pageCount; i++) {
        const start = (i - 1) * chunkSize;
        const pText = rawText.substring(start, start + chunkSize).trim();
        rawPages.push({
          pageNumber: i,
          text: pText,
          characterCount: pText.length,
          extractionMethod: 'pdf_text',
        });
      }
    }
  } catch (error) {
    console.warn('pdf-parse text extraction warning, proceeding to fallback engine:', error);
    // Initialize dummy pages so fallback engine can process scanned PDF
    pageCount = 1;
    rawPages = [
      {
        pageNumber: 1,
        text: '',
        characterCount: 0,
        extractionMethod: 'ocr',
        isScanned: true,
      },
    ];
  }

  // Step 2: Quality Detection
  const qualityReport = evaluateExtractionQuality(rawPages);

  // Step 3: Trigger Vision/OCR Fallback for low-coverage or scanned pages
  let finalPages = rawPages;
  let primaryMethod: ExtractionMethod = 'pdf_text';

  if (qualityReport.isScannedOrLowText && qualityReport.pagesNeedingFallback.length > 0) {
    console.log(`Activating Gemini Vision OCR fallback for pages: ${qualityReport.pagesNeedingFallback.join(', ')}`);
    finalPages = await processPagesWithVisionFallback(buffer, qualityReport.pagesNeedingFallback, rawPages);
    primaryMethod = finalPages.some((p) => p.extractionMethod === 'vision') ? 'vision' : 'ocr';
  }

  // Re-assemble full text
  const fullTextCombined = finalPages.map((p) => `--- PAGE ${p.pageNumber} ---\n${p.text}`).join('\n\n');

  return {
    success: true,
    pageCount: finalPages.length || pageCount,
    pages: finalPages,
    fullText: fullTextCombined,
    extractionMethod: primaryMethod,
    confidence: qualityReport.confidence === 'low' && primaryMethod === 'vision' ? 'medium' : qualityReport.confidence,
  };
}
