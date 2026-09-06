export type ExtractionMethod = 'pdf_text' | 'ocr' | 'vision';

export type QualityConfidence = 'high' | 'medium' | 'low';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
  characterCount: number;
  extractionMethod: ExtractionMethod;
  isScanned?: boolean;
}

export interface ExtractionResult {
  success: boolean;
  pageCount: number;
  pages: ExtractedPage[];
  fullText: string;
  extractionMethod: ExtractionMethod;
  confidence: QualityConfidence;
  warning?: string;
}

export interface QualityReport {
  totalCharacters: number;
  charactersPerPage: number;
  meaningfulPagesCount: number;
  textCoverageRatio: number; // 0.0 - 1.0
  confidence: QualityConfidence;
  isScannedOrLowText: boolean;
  pagesNeedingFallback: number[];
}
