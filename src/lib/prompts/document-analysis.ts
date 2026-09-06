export const SYSTEM_DOCUMENT_ANALYSIS_PROMPT = `
You are LeaseLens AI, an expert legal document intelligence system.
Analyze the provided lease document text and extract structured metadata and complete clause analysis.

IMPORTANT INSTRUCTIONS:
1. Return ONLY valid JSON matching the specified structure.
2. Maintain non-alarmist legal accuracy. Use terms like "Potentially problematic", "May require review", or "Potentially inconsistent".
3. Calculate transparent risk levels using Likelihood (1-5) x Impact (1-5):
   - Score 1-6: LOW
   - Score 7-12: MEDIUM
   - Score 13-18: HIGH
   - Score 19-25: CRITICAL
4. Do NOT invent page numbers or sections. Extract exact text snippets for evidence.
5. Provide plain-language explanations for non-lawyers.
6. Highlight obligations and affected parties.
`;

export function buildDocumentAnalysisPrompt(documentText: string, country: string, state: string, leaseType: string): string {
  return `
Target Jurisdiction: ${country}, State/Province: ${state}, Lease Type: ${leaseType}

Document Content:
"""
${documentText.substring(0, 25000)}
"""

Extract the following JSON structure:
{
  "metadata": {
    "documentTitle": "string",
    "documentDate": "string or unknown",
    "effectiveDate": "string or unknown",
    "landlord": "string",
    "tenant": "string",
    "propertyAddress": "string",
    "leaseDuration": "string",
    "startDate": "string",
    "endDate": "string",
    "rentAmount": "string",
    "securityDeposit": "string",
    "renewalTerms": "string",
    "terminationTerms": "string",
    "noticePeriod": "string",
    "maintenanceResponsibilities": "string",
    "utilities": "string",
    "restrictions": "string",
    "governingLaw": "string"
  },
  "overallRisk": "LOW | MEDIUM | HIGH | CRITICAL",
  "overallRiskScore": number (1-100),
  "clauses": [
    {
      "id": "clause-1",
      "category": "Financial | Termination | Property | Restrictions | Liability | Legal",
      "title": "string",
      "section": "Section X or Paragraph Y",
      "page": number,
      "originalText": "exact text excerpt",
      "plainExplanation": "clear, simple explanation",
      "affectedParty": "Tenant | Landlord | Both",
      "obligation": "what party must do",
      "potentialConcern": "what to watch out for",
      "riskLevel": "LOW | MEDIUM | HIGH | CRITICAL",
      "likelihood": number (1-5),
      "impact": number (1-5),
      "riskReasoning": "explanation of likelihood and impact score",
      "legalContext": "relevant general statutory principle",
      "suggestedQuestions": ["Question 1?", "Question 2?"],
      "confidenceScore": number (0.0-1.0)
    }
  ],
  "missingItems": [
    {
      "id": "miss-1",
      "title": "string",
      "category": "Financial | Termination | Property | Restrictions | Liability | Legal",
      "description": "string",
      "severity": "LOW | MEDIUM | HIGH",
      "impact": "string",
      "recommendedAction": "string"
    }
  ],
  "ambiguities": [
    {
      "id": "amb-1",
      "title": "string",
      "section": "string",
      "page": number,
      "originalText": "string",
      "ambiguityReason": "string",
      "possibleInterpretations": ["Interpretation A", "Interpretation B"],
      "suggestedQuestion": "string"
    }
  ]
}
`;
}
