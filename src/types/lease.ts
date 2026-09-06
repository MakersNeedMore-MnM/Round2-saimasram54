export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ClauseCategory = 
  | 'Financial'
  | 'Termination'
  | 'Property'
  | 'Restrictions'
  | 'Liability'
  | 'Legal';

export type LeaseType = 'Residential' | 'Commercial' | 'Retail' | 'Industrial';

export interface Jurisdiction {
  country: string;
  state: string;
  leaseType: LeaseType;
}

export interface ContractEvidence {
  page: number;
  section: string;
  text: string;
}

export interface LegalEvidence {
  sourceName: string;
  statuteCitation: string;
  excerpt: string;
  sourceUrl?: string;
  relevanceScore: number; // 0.0 - 1.0
}

export interface Clause {
  id: string;
  category: ClauseCategory;
  title: string;
  section: string;
  page: number;
  originalText: string;
  plainExplanation: string;
  affectedParty: 'Tenant' | 'Landlord' | 'Both';
  obligation: string;
  potentialConcern: string;
  riskLevel: RiskLevel;
  likelihood: number; // 1 to 5
  impact: number; // 1 to 5
  riskReasoning: string;
  legalContext?: string;
  legalEvidence?: LegalEvidence;
  suggestedQuestions: string[];
  confidenceScore: number; // 0.0 - 1.0
}

export interface RiskFinding {
  category: ClauseCategory;
  level: RiskLevel;
  score: number; // 1-100
  summary: string;
  clauseIds: string[];
}

export interface MissingItem {
  id: string;
  title: string;
  category: ClauseCategory;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: string;
  recommendedAction: string;
}

export interface AmbiguityItem {
  id: string;
  title: string;
  section: string;
  page: number;
  originalText: string;
  ambiguityReason: string;
  possibleInterpretations: string[];
  suggestedQuestion: string;
}

export interface LeaseMetadata {
  documentTitle: string;
  documentDate?: string;
  effectiveDate?: string;
  landlord: string;
  tenant: string;
  propertyAddress: string;
  leaseDuration: string;
  startDate: string;
  endDate: string;
  rentAmount: string;
  securityDeposit: string;
  renewalTerms: string;
  terminationTerms: string;
  noticePeriod: string;
  maintenanceResponsibilities: string;
  utilities: string;
  restrictions: string;
  governingLaw: string;
}

export interface LeaseDocument {
  id: string;
  fileName: string;
  fileSize: string;
  totalPages: number;
  rawText: string;
  pages: { pageNumber: number; text: string }[];
  metadata: LeaseMetadata;
  clauses: Clause[];
  overallRisk: RiskLevel;
  overallRiskScore: number; // 1-100
  riskFindings: RiskFinding[];
  missingItems: MissingItem[];
  ambiguities: AmbiguityItem[];
  suggestedQuestions: string[];
  analyzedAt: string;
  jurisdiction: Jurisdiction;
}

export interface Citation {
  type: 'document' | 'legal';
  title: string;
  page?: number;
  section?: string;
  excerpt: string;
  sourceUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  shortAnswer?: string;
  accordingToLease?: string;
  relevantClauseRef?: string;
  legalContext?: string;
  source?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  citations?: Citation[];
}
