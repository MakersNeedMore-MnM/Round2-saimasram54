import { ExtractedPage, QualityReport, QualityConfidence } from '@/types/document';

export function evaluateExtractionQuality(pages: ExtractedPage[]): QualityReport {
  if (!pages || pages.length === 0) {
    return {
      totalCharacters: 0,
      charactersPerPage: 0,
      meaningfulPagesCount: 0,
      textCoverageRatio: 0,
      confidence: 'low',
      isScannedOrLowText: true,
      pagesNeedingFallback: [],
    };
  }

  const totalCharacters = pages.reduce((acc, p) => acc + (p.characterCount || 0), 0);
  const charactersPerPage = Math.round(totalCharacters / pages.length);

  // A page is considered meaningful if it contains at least 30 characters of readable text
  const meaningfulPages = pages.filter((page) => page.text && page.text.trim().length >= 30);
  const textCoverageRatio = meaningfulPages.length / pages.length;

  const pagesNeedingFallback = pages
    .filter((page) => !page.text || page.text.trim().length < 30)
    .map((page) => page.pageNumber);

  let confidence: QualityConfidence = 'low';
  if (textCoverageRatio >= 0.75 && charactersPerPage >= 200) {
    confidence = 'high';
  } else if (textCoverageRatio >= 0.35 || charactersPerPage >= 80) {
    confidence = 'medium';
  }

  const isScannedOrLowText = confidence === 'low' || pagesNeedingFallback.length > 0;

  return {
    totalCharacters,
    charactersPerPage,
    meaningfulPagesCount: meaningfulPages.length,
    textCoverageRatio,
    confidence,
    isScannedOrLowText,
    pagesNeedingFallback,
  };
}
