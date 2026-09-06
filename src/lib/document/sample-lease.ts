import { LeaseDocument } from '@/types/lease';

export const SAMPLE_LEASE_TEXT = `STANDARD RESIDENTIAL & LEASE AGREEMENT
JURISDICTION: STATE OF CALIFORNIA / MAHARASHTRA

This Lease Agreement ("Lease") is entered into on January 15, 2026, by and between APEX REALTY HOLDINGS LLC ("Landlord"), and ALEXANDER V. MERCER ("Tenant").

--- PAGE 1 ---
RECITALS & PROPERTY DESCRIPTION:
1. PROPERTY LOCATION: Landlord hereby leases to Tenant the residential property located at 450 Grand Avenue, Apt 8B, San Francisco, CA 94107 ("Premises").
2. LEASE TERM: The initial term of this Lease shall be for 12 months, beginning February 1, 2026, and ending January 31, 2027.

SECTION 3: RENT & ANNUAL ESCALATION
Tenant agrees to pay Landlord monthly base rent of $3,800.00, payable in advance on the 1st calendar day of each month. 
Tenant explicitly agrees that upon any lease renewal or extension into a second consecutive year, monthly base rent shall automatically escalate by a mandatory fifteen percent (15%) per annum without further notice or right of negotiation.

SECTION 4: LATE FEES & PENALTIES
Rent paid after 11:59 PM on the 3rd calendar day of any month shall incur an immediate fixed administrative late fee of $500.00, plus an accumulating daily penalty fee of $50.00 for every day rent remains unpaid thereafter until fully settled.

--- PAGE 2 ---
SECTION 5: SECURITY DEPOSIT & FORFEITURE
Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $11,400.00 (equivalent to three (3) months' base rent) as a Security Deposit.
The Security Deposit will be held in a non-interest-bearing account. Landlord retains sole discretion to inspect the Premises and determine deductions. Return of any remaining deposit balance shall occur within ninety (90) business days following full move-out and key surrender.

SECTION 6: MAINTENANCE & REPAIR RESPONSIBILITIES
Tenant shall maintain the Premises in clean condition. Tenant agrees to pay for all routine, minor, and major repairs including plumbing, electrical fixtures, heating, ventilation, and air conditioning (HVAC) systems up to $500.00 per maintenance event. Landlord shall only contribute to costs exceeding $500.00 if Landlord deems such repair structurally essential.

--- PAGE 3 ---
SECTION 7: EARLY TERMINATION & LIQUIDATED DAMAGES
Tenant has no automatic right to terminate this Lease prior to the expiration date. In the event Tenant vacates early or seeks early termination, Tenant must provide one hundred twenty (120) days prior written notice, forfeit the entire $11,400 Security Deposit, and pay an early termination penalty fee equal to three (3) additional months' current base rent ($11,400.00) as liquidated damages.

SECTION 8: RESTRICTIONS ON OCCUPANCY, SUBLETTING & GUESTS
Subletting, assignment, or short-term vacation rental (including Airbnb or VRBO) of any portion of the Premises is strictly prohibited under penalty of immediate eviction and forfeiture of deposit. Any guest residing on the Premises for more than three (3) consecutive days shall incur a mandatory charge of $100.00 per night per guest.

--- PAGE 4 ---
SECTION 9: PROPERTY ACCESS & INSPECTIONS
Landlord or Landlord's designated agents reserve the unrestricted right to enter the Premises at any reasonable time during daylight hours without prior advance notice for inspection, repairs, or showing the property to prospective buyers or tenants.

SECTION 10: INDEMNIFICATION & LIABILITY WAIVER
Tenant shall defend, indemnify, hold harmless, and release Landlord, its agents, and employees from any loss, injury, damage, or legal claim arising from or related to Tenant's use or occupancy of the Premises, regardless of whether caused in part by Landlord's negligence or property defects.

--- PAGE 5 ---
SECTION 11: DISPUTE RESOLUTION & GOVERNING LAW
This Lease shall be governed by and construed in accordance with the laws of the state specified by Landlord. Any dispute, claim, or controversy arising out of this Lease shall be resolved exclusively through mandatory, binding individual arbitration administered by an arbitrator chosen solely by Landlord. Tenant expressly waives all rights to a trial by jury or participation in class action litigation.

SECTION 12: GOVERNING LAW & JURISDICTION
This agreement is governed by the laws of the State of California (or state of landlord selection).
`;

export const SAMPLE_LEASE_ANALYSIS: LeaseDocument = {
  id: 'demo-lease-001',
  fileName: 'Standard_Residential_Lease_2026.pdf',
  fileSize: '2.4 MB',
  totalPages: 5,
  rawText: SAMPLE_LEASE_TEXT,
  pages: [],
  analyzedAt: new Date().toISOString(),
  jurisdiction: {
    country: 'United States',
    state: 'California',
    leaseType: 'Residential',
  },
  metadata: {
    documentTitle: 'Standard Residential & Lease Agreement 2026',
    documentDate: 'January 15, 2026',
    effectiveDate: 'February 1, 2026',
    landlord: 'Apex Realty Holdings LLC',
    tenant: 'Alexander V. Mercer',
    propertyAddress: '450 Grand Avenue, Apt 8B, San Francisco, CA 94107',
    leaseDuration: '12 Months',
    startDate: 'February 1, 2026',
    endDate: 'January 31, 2027',
    rentAmount: '$3,800.00 / month',
    securityDeposit: '$11,400.00 (3 months rent)',
    renewalTerms: 'Automatic mandatory 15% annual rent escalation upon renewal',
    terminationTerms: '120 days prior notice + deposit forfeiture + 3 months rent penalty',
    noticePeriod: '120 Days',
    maintenanceResponsibilities: 'Tenant pays all maintenance/HVAC up to $500 per event',
    utilities: 'Tenant responsible for all utilities',
    restrictions: 'No subletting/Airbnb; $100/night fee for guests after 3 days',
    governingLaw: 'State of California / Mandatory Unilateral Arbitration',
  },
  overallRisk: 'CRITICAL',
  overallRiskScore: 88,
  riskFindings: [
    {
      category: 'Termination',
      level: 'CRITICAL',
      score: 95,
      summary: 'Severe early termination penalties requiring 120-day notice, total security deposit forfeiture, and an additional 3 months rent penalty ($22,800 total loss).',
      clauseIds: ['clause-early-term'],
    },
    {
      category: 'Financial',
      level: 'HIGH',
      score: 85,
      summary: 'High mandatory 15% annual rent increase, excessive $500 late fee after 3 days, and 3-month security deposit held without interest.',
      clauseIds: ['clause-rent-escalation', 'clause-late-fees', 'clause-deposit'],
    },
    {
      category: 'Liability',
      level: 'HIGH',
      score: 82,
      summary: 'Broad tenant indemnity releasing landlord from liability even for landlord negligence, plus mandatory landlord-chosen unilateral arbitration.',
      clauseIds: ['clause-indemnity', 'clause-arbitration'],
    },
    {
      category: 'Restrictions',
      level: 'MEDIUM',
      score: 65,
      summary: 'Strict subletting ban, $100/night fee for guests exceeding 3 days, and unannounced daylight access without 24-hr notice.',
      clauseIds: ['clause-subletting', 'clause-access'],
    },
    {
      category: 'Property',
      level: 'MEDIUM',
      score: 60,
      summary: 'Shifts routine and structural maintenance up to $500 per event (including HVAC) onto tenant.',
      clauseIds: ['clause-maintenance'],
    },
  ],
  clauses: [
    {
      id: 'clause-early-term',
      category: 'Termination',
      title: 'Early Termination & Liquidated Damages',
      section: 'Section 7',
      page: 3,
      originalText: 'Tenant has no automatic right to terminate this Lease prior to the expiration date. In the event Tenant vacates early or seeks early termination, Tenant must provide one hundred twenty (120) days prior written notice, forfeit the entire $11,400 Security Deposit, and pay an early termination penalty fee equal to three (3) additional months current base rent ($11,400.00) as liquidated damages.',
      plainExplanation: 'If you need to move out early, you must give 4 months advance notice, give up your entire $11,400 security deposit, AND pay another $11,400 cash penalty.',
      affectedParty: 'Tenant',
      obligation: 'Give 120 days notice and pay $22,800 in financial penalties if terminating before Jan 31, 2027.',
      potentialConcern: 'Extremely harsh financial penalty for breaking lease due to job transfer, medical emergency, or personal circumstances.',
      riskLevel: 'CRITICAL',
      likelihood: 4,
      impact: 5,
      riskReasoning: 'Likelihood is moderate-high (life changes occur) and financial impact is catastrophic ($22,800 loss). Courts in California often declare double-dipping liquidated damages unconscionable.',
      legalContext: 'California Civil Code § 1671 invalidates liquidated damages provisions that do not represent a reasonable estimate of actual damages suffered by landlord.',
      legalEvidence: {
        sourceName: 'California Civil Code - Liquidated Damages',
        statuteCitation: 'Cal. Civ. Code § 1671(b)',
        excerpt: 'A provision in a contract liquidating the damages for breach of contract is void if the party seeking to invalidate the provision establishes that the provision was unreasonable under the circumstances existing at the time the contract was made.',
        sourceUrl: 'https://leginfo.legislature.ca.gov/',
        relevanceScore: 0.95,
      },
      suggestedQuestions: [
        'Can we reduce the notice period from 120 days to a standard 30 or 60 days?',
        'Can the early termination fee be capped at 1 or 2 months rent, with deposit returned subject to damage inspection?',
      ],
      confidenceScore: 0.95,
    },
    {
      id: 'clause-rent-escalation',
      category: 'Financial',
      title: 'Automatic Rent Escalation',
      section: 'Section 3',
      page: 1,
      originalText: 'Tenant explicitly agrees that upon any lease renewal or extension into a second consecutive year, monthly base rent shall automatically escalate by a mandatory fifteen percent (15%) per annum without further notice or right of negotiation.',
      plainExplanation: 'Your rent will automatically jump by 15% (from $3,800 to $4,370/month) if you stay past your first year.',
      affectedParty: 'Tenant',
      obligation: 'Pay $4,370/month starting February 2027 if renewing.',
      potentialConcern: '15% annual rent increases significantly exceed standard inflation and municipal rent stabilization caps in major California cities.',
      riskLevel: 'HIGH',
      likelihood: 5,
      impact: 4,
      riskReasoning: 'Guaranteed 100% likelihood of triggering if renewing, resulting in an extra $6,840/year rent burden.',
      legalContext: 'California Tenant Protection Act of 2019 (AB 1482 / Civil Code § 1947.12) caps annual rent increases at 5% plus local CPI (max 10%) for covered multi-family residential properties.',
      legalEvidence: {
        sourceName: 'California Civil Code - Rent Cap (AB 1482)',
        statuteCitation: 'Cal. Civ. Code § 1947.12(a)',
        excerpt: 'An owner of residential real property shall not, over the course of any 12-month period, increase the gross rental rate for a dwelling or unit more than 5% plus the percentage change in the cost of living, or 10%, whichever is lower.',
        sourceUrl: 'https://leginfo.legislature.ca.gov/',
        relevanceScore: 0.92,
      },
      suggestedQuestions: [
        'Is this property subject to California AB 1482 rent caps?',
        'Can we cap the annual renewal increase at 3% - 5% or tie it to Bay Area CPI?',
      ],
      confidenceScore: 0.92,
    },
    {
      id: 'clause-late-fees',
      category: 'Financial',
      title: 'Late Fees & Daily Penalties',
      section: 'Section 4',
      page: 1,
      originalText: 'Rent paid after 11:59 PM on the 3rd calendar day of any month shall incur an immediate fixed administrative late fee of $500.00, plus an accumulating daily penalty fee of $50.00 for every day rent remains unpaid thereafter.',
      plainExplanation: 'If your rent payment is 3 days late, you immediately owe $500 plus $50 for every additional late day.',
      affectedParty: 'Tenant',
      obligation: 'Pay high penalty fees for payments delayed even by bank processing hold.',
      potentialConcern: 'A $500 fee on $3,800 rent equals 13.1% penalty on day 4, exceeding customary legal norms (usually 3-5%).',
      riskLevel: 'HIGH',
      likelihood: 3,
      impact: 4,
      riskReasoning: 'High financial penalty for minor payment delays or bank clearing holidays.',
      legalContext: 'California courts hold late fees unenforceable penalties unless they reflect actual administrative costs incurred by landlord (Orizoya v. Tate; Garrett v. Coast & Southern Fed. Sav. & Loan).',
      legalEvidence: {
        sourceName: 'California Case Law on Unreasonable Late Charges',
        statuteCitation: 'Garrett v. Coast & Southern Fed. Sav. & Loan Assn. (9 Cal. 3d 731)',
        excerpt: 'A charge for late payment of rent is void as a penalty unless it represents a reasonable endeavor to estimate fair average compensation for a loss sustained.',
        sourceUrl: 'https://scholar.google.com/',
        relevanceScore: 0.88,
      },
      suggestedQuestions: [
        'Can we extend the grace period to 5 or 7 days to account for banking holidays?',
        'Can the late fee be reduced to 3% or 5% of monthly rent ($114 - $190)?',
      ],
      confidenceScore: 0.90,
    },
    {
      id: 'clause-deposit',
      category: 'Financial',
      title: 'Security Deposit Amount & Refund Timeline',
      section: 'Section 5',
      page: 2,
      originalText: 'Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $11,400.00 (equivalent to 3 months base rent)... Return of any remaining deposit balance shall occur within ninety (90) business days following full move-out.',
      plainExplanation: 'Landlord requires a massive 3-month deposit ($11,400) and takes up to 90 business days (nearly 4.5 calendar months) after you move out to return your funds.',
      affectedParty: 'Tenant',
      obligation: 'Tie up $11,400 upfront and wait 90+ business days post move-out.',
      potentialConcern: 'Under AB 12 (effective July 1, 2024), California residential landlords cannot collect more than 1 month rent as deposit. Furthermore, state law mandates return within 21 calendar days.',
      riskLevel: 'HIGH',
      likelihood: 4,
      impact: 4,
      riskReasoning: 'Direct conflict with California statutory limits (AB 12 caps deposits at 1 month, Civil Code § 1950.5 mandates 21-day refund).',
      legalContext: 'California Civil Code § 1950.5(g)(1) mandates itemized deposit statement and refund within 21 calendar days. AB 12 caps deposits at 1 month rent.',
      legalEvidence: {
        sourceName: 'California Civil Code - Security Deposits',
        statuteCitation: 'Cal. Civ. Code § 1950.5(g)(1)',
        excerpt: 'No later than 21 calendar days after the tenant has vacated the premises, the landlord shall furnish the tenant with a copy of an itemized statement... and refund any remaining portion.',
        sourceUrl: 'https://leginfo.legislature.ca.gov/',
        relevanceScore: 0.96,
      },
      suggestedQuestions: [
        'Under California AB 12, security deposits are capped at 1 month rent ($3,800). Can we amend the deposit amount accordingly?',
        'Can we change the deposit refund timeframe to the statutory 21 calendar days?',
      ],
      confidenceScore: 0.96,
    },
    {
      id: 'clause-maintenance',
      category: 'Property',
      title: 'Maintenance & Repair Cost Split',
      section: 'Section 6',
      page: 2,
      originalText: 'Tenant agrees to pay for all routine, minor, and major repairs including plumbing, electrical fixtures, heating, ventilation, and air conditioning (HVAC) systems up to $500.00 per maintenance event.',
      plainExplanation: 'You must pay the first $500 for every repair event in the property, including HVAC breakdowns or plumbing leaks.',
      affectedParty: 'Tenant',
      obligation: 'Pay up to $500 for every appliance or system failure.',
      potentialConcern: 'Landlords have a non-waivable duty of habitability under California law to maintain plumbing, heating, and structural systems.',
      riskLevel: 'MEDIUM',
      likelihood: 4,
      impact: 3,
      riskReasoning: 'Frequent minor repair bills can quickly accumulate thousands of dollars in unexpected tenant expenses.',
      legalContext: 'California Civil Code § 1941.1 establishes non-waivable implied warranty of habitability requiring landlord to maintain plumbing, heating, electrical, and structural systems.',
      legalEvidence: {
        sourceName: 'California Civil Code - Implied Warranty of Habitability',
        statuteCitation: 'Cal. Civ. Code § 1941.1',
        excerpt: 'A dwelling shall be deemed untenantable if it lacks effective waterproofing, plumbing, gas facilities, or heating facilities in good working order.',
        sourceUrl: 'https://leginfo.legislature.ca.gov/',
        relevanceScore: 0.91,
      },
      suggestedQuestions: [
        'Will Landlord remain fully responsible for major building systems (HVAC, plumbing mains, roof) regardless of cost?',
        'Can we limit tenant maintenance responsibility strictly to damage caused by tenant fault or misuse?',
      ],
      confidenceScore: 0.89,
    },
    {
      id: 'clause-indemnity',
      category: 'Liability',
      title: 'Landlord Indemnification & Liability Waiver',
      section: 'Section 10',
      page: 4,
      originalText: 'Tenant shall defend, indemnify, hold harmless, and release Landlord, its agents, and employees from any loss, injury, damage, or legal claim... regardless of whether caused in part by Landlord negligence or property defects.',
      plainExplanation: 'You agree not to sue the landlord and to cover their legal bills even if someone is injured because of the landlord’s own negligence or faulty building conditions.',
      affectedParty: 'Tenant',
      obligation: 'Assume all legal liability and defend landlord against third-party lawsuits.',
      potentialConcern: 'Unfair liability transfer; clauses waiving landlord liability for active negligence are void under public policy in California.',
      riskLevel: 'HIGH',
      likelihood: 2,
      impact: 5,
      riskReasoning: 'Catastrophic liability exposure if a visitor is injured on property due to landlord structural negligence.',
      legalContext: 'California Civil Code § 1668 invalidates contracts that exempt anyone from responsibility for their own fraud, willful injury, or violation of law.',
      legalEvidence: {
        sourceName: 'California Civil Code - Unlawful Contracts Exemption',
        statuteCitation: 'Cal. Civ. Code § 1668',
        excerpt: 'All contracts which have for their object, directly or indirectly, to exempt anyone from responsibility for his own fraud, or willful injury to the person or property of another, or violation of law, whether willful or negligent, are against the policy of the law.',
        sourceUrl: 'https://leginfo.legislature.ca.gov/',
        relevanceScore: 0.94,
      },
      suggestedQuestions: [
        'Can we modify Section 10 to exclude claims resulting from Landlord’s gross negligence, willful misconduct, or failure to maintain premises?',
      ],
      confidenceScore: 0.93,
    },
    {
      id: 'clause-subletting',
      category: 'Restrictions',
      title: 'Subletting Ban & Guest Penalties',
      section: 'Section 8',
      page: 3,
      originalText: 'Subletting, assignment, or short-term vacation rental... is strictly prohibited. Any guest residing on the Premises for more than three (3) consecutive days shall incur a mandatory charge of $100.00 per night per guest.',
      plainExplanation: 'No subletting allowed under any circumstance, and having a family member or friend stay over 3 nights costs $100/night.',
      affectedParty: 'Tenant',
      obligation: 'Pay $100/night fee for visitors staying past 3 days.',
      potentialConcern: 'Extremely restrictive guest policy that interferes with normal quiet enjoyment of residential tenancy.',
      riskLevel: 'MEDIUM',
      likelihood: 4,
      impact: 3,
      riskReasoning: 'Restricts personal lifestyle and family visits with heavy daily penalties.',
      legalContext: 'Local housing codes in San Francisco and California case law protect tenant rights to reasonable residential quiet enjoyment.',
      legalEvidence: {
        sourceName: 'California Civil Code - Quiet Enjoyment',
        statuteCitation: 'Cal. Civ. Code § 1927',
        excerpt: 'An agreement to let upon hire binds the letter to secure to the hirer the quiet possession of the thing hired during the term of the lease.',
        sourceUrl: 'https://leginfo.legislature.ca.gov/',
        relevanceScore: 0.85,
      },
      suggestedQuestions: [
        'Can the guest restriction threshold be extended from 3 days to 14 days per calendar year before incurring extra guest fees?',
        'Can subletting be permitted upon Landlord’s prior written consent, not to be unreasonably withheld?',
      ],
      confidenceScore: 0.88,
    },
    {
      id: 'clause-arbitration',
      category: 'Legal',
      title: 'Mandatory Binding Unilateral Arbitration',
      section: 'Section 11',
      page: 5,
      originalText: 'Any dispute, claim, or controversy... shall be resolved exclusively through mandatory, binding individual arbitration administered by an arbitrator chosen solely by Landlord. Tenant expressly waives all rights to trial by jury or class action.',
      plainExplanation: 'You waive your right to court or jury trial in any lease dispute, and the landlord single-handedly picks the arbitrator.',
      affectedParty: 'Tenant',
      obligation: 'Surrender court rights and accept an arbitrator selected exclusively by landlord.',
      potentialConcern: 'Unilateral selection of arbitrator by landlord creates severe inherent bias and unconscionability risks under arbitration law.',
      riskLevel: 'HIGH',
      likelihood: 2,
      impact: 5,
      riskReasoning: 'Denies tenant access to impartial judicial dispute resolution or neutral arbitration panel.',
      legalContext: 'California Code of Civil Procedure § 1281.9 mandates neutral arbitrator disclosures and prohibits unilateral selection bias in consumer/tenant contracts.',
      legalEvidence: {
        sourceName: 'California Code of Civil Procedure - Arbitrator Disclosures',
        statuteCitation: 'Cal. Code Civ. Proc. § 1281.9',
        excerpt: 'In any arbitration conducted pursuant to an arbitration agreement, the proposed neutral arbitrator shall disclose all matters that could cause a person aware of the facts to reasonably entertain a doubt that the proposed neutral arbitrator would be able to be impartial.',
        sourceUrl: 'https://leginfo.legislature.ca.gov/',
        relevanceScore: 0.91,
      },
      suggestedQuestions: [
        'Can dispute resolution specify a neutral arbitration service (like AAA or JAMS) where both parties mutually agree on the arbitrator?',
      ],
      confidenceScore: 0.92,
    },
  ],
  missingItems: [
    {
      id: 'miss-01',
      title: 'Missing Interest Payment Terms on Security Deposit',
      category: 'Financial',
      description: 'The lease states the $11,400 deposit is held in a non-interest account. San Francisco Administrative Code (Chapter 49) mandates landlords pay annual interest on security deposits held over 1 year.',
      severity: 'HIGH',
      impact: 'Tenant loses out on statutory accrued interest on an $11,400 deposit over 12 months.',
      recommendedAction: 'Ask landlord to include statutory annual interest payment compliance per San Francisco Rent Board guidelines.',
    },
    {
      id: 'miss-02',
      title: 'Missing Move-in Inspection & Pre-Existing Damage Protocol',
      category: 'Financial',
      description: 'The agreement contains no provision for a formal joint move-in walkthrough inspection report or written checklist.',
      severity: 'MEDIUM',
      impact: 'Risk of landlord unfairly deducting pre-existing carpet, paint, or fixture defects from tenant security deposit upon move-out.',
      recommendedAction: 'Request a signed Statement of Property Condition checklist completed prior to occupancy.',
    },
    {
      id: 'miss-03',
      title: 'Missing Utility Cost Allocation Breakdown',
      category: 'Financial',
      description: 'The lease mentions tenant is responsible for utilities but does not define sub-metering split for shared water, trash, or common gas.',
      severity: 'MEDIUM',
      impact: 'Tenant may receive unpredictable shared building utility bills without defined formulas.',
      recommendedAction: 'Clarify exact utility billing formula (e.g. individually sub-metered vs RUBS ratio billing).',
    },
  ],
  ambiguities: [
    {
      id: 'amb-01',
      title: 'Vague Repair Cost Contribution Standard',
      section: 'Section 6',
      page: 2,
      originalText: 'Landlord shall only contribute to costs exceeding $500.00 if Landlord deems such repair structurally essential.',
      ambiguityReason: 'The phrase "if Landlord deems such repair structurally essential" gives total subjective discretion to Landlord to refuse paying for major non-structural repairs (e.g., broken water heater or oven).',
      possibleInterpretations: [
        'Interpretation A: Landlord pays for repairs over $500 only if building foundation/walls are at risk.',
        'Interpretation B: Landlord must repair all major appliances rendering unit habitable under state law.',
      ],
      suggestedQuestion: 'Does Landlord cover full repair costs over $500 for essential appliances (refrigerator, stove, hot water heater) regardless of structural impact?',
    },
    {
      id: 'amb-02',
      title: 'Unclear Notice Period Calculation for Renewal',
      section: 'Section 3 & 7',
      page: 1,
      originalText: 'Lease term ends January 31, 2027... Tenant must provide 120 days prior written notice for early termination.',
      ambiguityReason: 'It is ambiguous whether non-renewal at the end of the 12-month term requires 120 days notice or standard 30 days notice.',
      possibleInterpretations: [
        'Interpretation A: Non-renewing at term end requires 120 days notice (by Oct 3, 2026), or else lease auto-renews at 15% higher rent.',
        'Interpretation B: 120 days notice applies strictly to breaking the lease early during the 12-month term.',
      ],
      suggestedQuestion: 'How many days written notice is required to simply vacate at the end of the 12-month lease term on January 31, 2027 without renewing?',
    },
  ],
  suggestedQuestions: [
    'Can we cap the annual rent increase upon renewal to 3% - 5% instead of 15%?',
    'Under California law, security deposits are capped at 1 month rent ($3,800). Can we adjust the deposit from $11,400 to $3,800?',
    'Can the deposit refund period be updated from 90 business days to the 21 calendar days required by California Civil Code § 1950.5?',
    'Can early termination liquidated damages be capped at 60 days notice plus 1 month rent penalty instead of 120 days + $11,400 penalty?',
    'Will the landlord pay for major appliance and HVAC breakdowns that are not caused by tenant misuse?',
    'Can we specify a neutral arbitration service (JAMS or AAA) where both parties mutually approve the arbitrator?',
  ],
};
