import { LeaseDocument, Jurisdiction, ChatMessage } from '@/types/lease';

export interface AIProvider {
  name: string;
  analyzeDocument(
    documentText: string,
    jurisdiction: Jurisdiction,
    fileName?: string,
    fileSize?: string,
    legalEvidence?: string
  ): Promise<LeaseDocument>;

  answerLeaseQuestion(
    question: string,
    documentChunksText: string,
    legalSourcesText: string,
    jurisdictionStr: string
  ): Promise<ChatMessage>;
}
