import { GoogleGenAI } from '@google/genai';
import { AIProvider } from './provider';
import { LeaseDocument, Jurisdiction, ChatMessage } from '@/types/lease';
import { SYSTEM_DOCUMENT_ANALYSIS_PROMPT, buildDocumentAnalysisPrompt, SYSTEM_LEASE_CHAT_PROMPT, buildLeaseChatPrompt } from '../prompts';

export class GeminiProvider implements AIProvider {
  public name = 'Google Gemini 2.5/1.5 API';
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeDocument(
    documentText: string,
    jurisdiction: Jurisdiction,
    fileName: string = 'Uploaded_Lease.pdf',
    fileSize: string = '1.2 MB'
  ): Promise<LeaseDocument> {
    const prompt = buildDocumentAnalysisPrompt(
      documentText,
      jurisdiction.country,
      jurisdiction.state,
      jurisdiction.leaseType
    );

    const modelName = 'gemini-2.5-flash';

    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_DOCUMENT_ANALYSIS_PROMPT + '\n' + prompt }] }
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        }
      });

      const responseText = response.text || '';
      const cleanJsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedData = JSON.parse(cleanJsonStr);

      const clauses = parsedData.clauses || [];
      
      // Calculate risk findings from clauses
      const riskFindings = this.calculateRiskFindings(clauses);

      return {
        id: `doc-${Date.now()}`,
        fileName,
        fileSize,
        totalPages: parsedData.totalPages || Math.ceil(documentText.length / 1800) || 1,
        rawText: documentText,
        pages: [], // Populated by parser
        metadata: parsedData.metadata || {
          documentTitle: 'Uploaded Lease Agreement',
          landlord: 'Unknown',
          tenant: 'Unknown',
          propertyAddress: 'Unknown',
          leaseDuration: '12 Months',
          startDate: 'Unknown',
          endDate: 'Unknown',
          rentAmount: 'Unknown',
          securityDeposit: 'Unknown',
          renewalTerms: 'Unknown',
          terminationTerms: 'Unknown',
          noticePeriod: 'Unknown',
          maintenanceResponsibilities: 'Unknown',
          utilities: 'Unknown',
          restrictions: 'Unknown',
          governingLaw: `${jurisdiction.state}, ${jurisdiction.country}`,
        },
        clauses,
        overallRisk: parsedData.overallRisk || 'HIGH',
        overallRiskScore: parsedData.overallRiskScore || 75,
        riskFindings,
        missingItems: parsedData.missingItems || [],
        ambiguities: parsedData.ambiguities || [],
        suggestedQuestions: clauses.flatMap((c: any) => c.suggestedQuestions || []).slice(0, 6),
        analyzedAt: new Date().toISOString(),
        jurisdiction,
      };
    } catch (error) {
      console.error('Gemini API document analysis failed:', error);
      throw error;
    }
  }

  async answerLeaseQuestion(
    question: string,
    documentChunksText: string,
    legalSourcesText: string,
    jurisdictionStr: string
  ): Promise<ChatMessage> {
    const prompt = buildLeaseChatPrompt(question, documentChunksText, legalSourcesText, jurisdictionStr);

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_LEASE_CHAT_PROMPT + '\n' + prompt }] }
        ],
        config: {
          temperature: 0.1,
        }
      });

      const fullText = response.text || '';
      
      // Parse structured sections
      const shortAnswer = this.extractSection(fullText, 'Short Answer');
      const accordingToLease = this.extractSection(fullText, 'According to Your Lease');
      const relevantClauseRef = this.extractSection(fullText, 'Relevant Clause');
      const legalContext = this.extractSection(fullText, 'Legal Context');
      const source = this.extractSection(fullText, 'Source');
      const confidenceRaw = this.extractSection(fullText, 'Confidence');
      
      const confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 
        confidenceRaw.includes('HIGH') ? 'HIGH' : confidenceRaw.includes('LOW') ? 'LOW' : 'MEDIUM';

      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: fullText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        shortAnswer,
        accordingToLease,
        relevantClauseRef,
        legalContext,
        source,
        confidence,
      };
    } catch (error) {
      console.error('Gemini API lease chat error:', error);
      throw error;
    }
  }

  private extractSection(text: string, header: string): string {
    const regex = new RegExp(`##\\s+${header}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private calculateRiskFindings(clauses: any[]) {
    const categories = ['Financial', 'Termination', 'Property', 'Restrictions', 'Liability', 'Legal'] as const;
    
    return categories.map(cat => {
      const catClauses = clauses.filter((c: any) => c.category === cat);
      const highCount = catClauses.filter((c: any) => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL').length;
      
      let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      let score = 20;

      if (catClauses.some((c: any) => c.riskLevel === 'CRITICAL')) {
        level = 'CRITICAL';
        score = 90;
      } else if (highCount >= 2) {
        level = 'HIGH';
        score = 80;
      } else if (highCount === 1 || catClauses.some((c: any) => c.riskLevel === 'MEDIUM')) {
        level = 'MEDIUM';
        score = 55;
      }

      return {
        category: cat,
        level,
        score,
        summary: catClauses.length > 0 
          ? `${catClauses.length} clause(s) identified with ${highCount} elevated risk item(s).`
          : `No major concerns detected in ${cat.toLowerCase()} provisions.`,
        clauseIds: catClauses.map((c: any) => c.id),
      };
    });
  }
}
