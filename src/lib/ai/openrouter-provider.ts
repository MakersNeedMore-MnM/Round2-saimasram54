import { AIProvider } from './provider';
import { LeaseDocument, Jurisdiction, ChatMessage } from '@/types/lease';
import { SYSTEM_DOCUMENT_ANALYSIS_PROMPT, buildDocumentAnalysisPrompt, SYSTEM_LEASE_CHAT_PROMPT, buildLeaseChatPrompt } from '../prompts';

export class OpenRouterProvider implements AIProvider {
  public name = 'OpenRouter AI Engine (Open-Weight Models)';
  private apiKey: string;
  private primaryModel: string;

  constructor(apiKey: string, model: string = 'meta-llama/llama-3.3-70b-instruct') {
    this.apiKey = apiKey;
    this.primaryModel = model;
  }

  async analyzeDocument(
    documentText: string,
    jurisdiction: Jurisdiction,
    fileName: string = 'Uploaded_Lease.pdf',
    fileSize: string = '1.5 MB'
  ): Promise<LeaseDocument> {
    const prompt = buildDocumentAnalysisPrompt(
      documentText,
      jurisdiction.country,
      jurisdiction.state,
      jurisdiction.leaseType
    );

    // List of high-performing open-weight models supported on OpenRouter
    const openWeightModelsToTry = [
      this.primaryModel,
      'meta-llama/llama-3.3-70b-instruct',
      'deepseek/deepseek-r1',
      'qwen/qwen-2.5-72b-instruct',
      'mistralai/mistral-large-2411',
      'meta-llama/llama-3.1-8b-instruct',
    ];

    let lastError: any = null;

    for (const model of openWeightModelsToTry) {
      try {
        console.log(`Attempting document analysis with open-weight model: ${model}`);
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'LeaseLens AI',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: SYSTEM_DOCUMENT_ANALYSIS_PROMPT },
              { role: 'user', content: prompt },
            ],
            temperature: 0.1,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`OpenRouter model ${model} failed (${response.status}):`, errText);
          lastError = new Error(`OpenRouter API error ${response.status}: ${errText}`);
          continue;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        const cleanJsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedData = JSON.parse(cleanJsonStr);

        const clauses = parsedData.clauses || [];
        const riskFindings = this.calculateRiskFindings(clauses);

        return {
          id: `doc-${Date.now()}`,
          fileName,
          fileSize,
          totalPages: parsedData.totalPages || Math.ceil(documentText.length / 1800) || 1,
          rawText: documentText,
          pages: [],
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
      } catch (err) {
        console.warn(`OpenRouter error with model ${model}:`, err);
        lastError = err;
      }
    }

    throw lastError || new Error('Failed to analyze document with OpenRouter open-weight models.');
  }

  async answerLeaseQuestion(
    question: string,
    documentChunksText: string,
    legalSourcesText: string,
    jurisdictionStr: string
  ): Promise<ChatMessage> {
    const prompt = buildLeaseChatPrompt(question, documentChunksText, legalSourcesText, jurisdictionStr);

    const openWeightModelsToTry = [
      this.primaryModel,
      'meta-llama/llama-3.3-70b-instruct',
      'qwen/qwen-2.5-72b-instruct',
      'meta-llama/llama-3.1-8b-instruct',
    ];

    let lastError: any = null;

    for (const model of openWeightModelsToTry) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'LeaseLens AI',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: SYSTEM_LEASE_CHAT_PROMPT },
              { role: 'user', content: prompt },
            ],
            temperature: 0.1,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`OpenRouter lease chat model ${model} failed:`, errText);
          lastError = new Error(`OpenRouter API error: ${errText}`);
          continue;
        }

        const data = await response.json();
        const fullText = data.choices?.[0]?.message?.content || '';

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
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('Failed to generate lease chat answer with OpenRouter open-weight models.');
  }

  private extractSection(text: string, header: string): string {
    const regex = new RegExp(`##\\s+${header}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private calculateRiskFindings(clauses: any[]) {
    const categories = ['Financial', 'Termination', 'Property', 'Restrictions', 'Liability', 'Legal'] as const;

    return categories.map((cat) => {
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
