export interface StatutorySource {
  id: string;
  country: string;
  state: string;
  topic: string;
  title: string;
  citation: string;
  authority: string;
  excerpt: string;
  url: string;
  keyKeywords: string[];
}

export const STATUTORY_LEGAL_DATABASE: StatutorySource[] = [
  // CALIFORNIA, US
  {
    id: 'ca-civ-1950.5',
    country: 'United States',
    state: 'California',
    topic: 'Security Deposit & Refund',
    title: 'California Civil Code § 1950.5 - Security Deposits & Refund Timelines',
    citation: 'Cal. Civ. Code § 1950.5(g)(1)',
    authority: 'California State Legislature (Government Legislation)',
    excerpt: 'No later than 21 calendar days after the tenant has vacated the premises, the landlord shall furnish the tenant with a copy of an itemized statement indicating the basis for, and the amount of, any security received and the disposition of the security and shall return any remaining portion of the security to the tenant.',
    url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5',
    keyKeywords: ['security deposit', 'deposit refund', '21 days', 'deductions', 'itemized statement', 'forfeiture'],
  },
  {
    id: 'ca-ab12',
    country: 'United States',
    state: 'California',
    topic: 'Security Deposit Limits',
    title: 'California Assembly Bill 12 (AB 12) - Security Deposit Cap',
    citation: 'Cal. Civ. Code § 1950.5(c)(1)',
    authority: 'California State Legislature (Government Legislation)',
    excerpt: 'Effective July 1, 2024, a landlord shall not demand or receive security, however denominated, in an amount or value in excess of an amount equal to one month’s rent for residential property.',
    url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB12',
    keyKeywords: ['deposit limit', 'one month rent', 'ab 12', 'maximum deposit', '3 months deposit'],
  },
  {
    id: 'ca-civ-1947.12',
    country: 'United States',
    state: 'California',
    topic: 'Rent Escalation Cap',
    title: 'California Tenant Protection Act (AB 1482) - Annual Rent Increase Limits',
    citation: 'Cal. Civ. Code § 1947.12(a)',
    authority: 'California Department of Real Estate (Government Regulatory)',
    excerpt: 'An owner of residential real property shall not, over the course of any 12-month period, increase the gross rental rate for a dwelling or unit more than 5% plus the percentage change in the cost of living, or 10%, whichever is lower.',
    url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1947.12',
    keyKeywords: ['rent increase', 'rent escalation', 'rent cap', '15% rent', 'ab 1482', 'annual increase'],
  },
  {
    id: 'ca-civ-1671',
    country: 'United States',
    state: 'California',
    topic: 'Early Termination & Penalty Clauses',
    title: 'California Civil Code § 1671 - Liquidated Damages Enforceability',
    citation: 'Cal. Civ. Code § 1671(b)',
    authority: 'California State Legislature (Government Legislation)',
    excerpt: 'A provision in a contract liquidating the damages for breach of contract is void if the party seeking to invalidate the provision establishes that the provision was unreasonable under the circumstances existing at the time the contract was made.',
    url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1671',
    keyKeywords: ['early termination', 'liquidated damages', 'penalty fee', 'break lease', '120 days notice'],
  },
  {
    id: 'ca-civ-1941.1',
    country: 'United States',
    state: 'California',
    topic: 'Maintenance & Habitability',
    title: 'California Civil Code § 1941.1 - Implied Warranty of Habitability',
    citation: 'Cal. Civ. Code § 1941.1',
    authority: 'California State Legislature (Government Legislation)',
    excerpt: 'A dwelling shall be deemed untenantable if it lacks effective waterproofing, plumbing or gas facilities, hot and cold running water, heating facilities, or electrical lighting in good working order.',
    url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1941.1',
    keyKeywords: ['maintenance', 'repairs', 'hvac', 'plumbing', 'habitability', '$500 repair'],
  },

  // MAHARASHTRA, INDIA
  {
    id: 'mh-rent-act-1999',
    country: 'India',
    state: 'Maharashtra',
    topic: 'Security Deposit & Leave License',
    title: 'Maharashtra Rent Control Act, 1999',
    citation: 'Maharashtra Act No. 18 of 2000, Section 24',
    authority: 'Government of Maharashtra (Legislation)',
    excerpt: 'Notwithstanding anything contained in this Act, a licensee in possession of premises on leave and license basis shall deliver possession to the licensor on expiry of the period specified in the agreement.',
    url: 'https://www.maharashtra.gov.in/',
    keyKeywords: ['leave and license', 'maharashtra rent control', 'deposit', 'possession', 'lock in period'],
  },
  {
    id: 'in-mta-2021',
    country: 'India',
    state: 'Maharashtra',
    topic: 'Model Tenancy Act Provisions',
    title: 'Model Tenancy Act, 2021 (Ministry of Housing and Urban Affairs)',
    citation: 'Model Tenancy Act 2021, Section 11',
    authority: 'Ministry of Housing and Urban Affairs (Govt of India)',
    excerpt: 'Security deposit for residential premises shall not exceed two months rent. The security deposit shall be refunded to the tenant on the date of taking over vacant possession after deducting legitimate dues.',
    url: 'https://mohua.gov.in/',
    keyKeywords: ['model tenancy act', 'two months deposit', 'notice period', 'rent agreement', 'dispute resolution'],
  },

  // NEW YORK, US
  {
    id: 'ny-rpl-238a',
    country: 'United States',
    state: 'New York',
    topic: 'Late Fee & Application Fee Limits',
    title: 'New York Real Property Law § 238-a - Limitation on Fees',
    citation: 'N.Y. Real Prop. Law § 238-a(2)',
    authority: 'New York State Assembly (Government Legislation)',
    excerpt: 'No landlord, lessor, sublessor or grantor may demand any payment, fee, or charge for the late payment of rent unless the payment of rent has not been made within five days of the date specified. Any late fee shall not exceed fifty dollars or five percent of the monthly rent, whichever is less.',
    url: 'https://www.nysenate.gov/legislation/laws/RPP/238-A',
    keyKeywords: ['late fee', 'new york', '50 dollars', '5 percent', 'grace period'],
  },

  // UNITED KINGDOM
  {
    id: 'uk-tenant-fees-act-2019',
    country: 'United Kingdom',
    state: 'England',
    topic: 'Tenant Fees & Deposit Caps',
    title: 'UK Tenant Fees Act 2019',
    citation: 'Tenant Fees Act 2019, Schedule 1',
    authority: 'UK Parliament (Government Legislation)',
    excerpt: 'Tenancy deposits are capped at 5 weeks rent where the total annual rent is less than £50,000. Landlords and letting agents cannot charge prohibited fees including administration fees or excessive late payment charges.',
    url: 'https://www.legislation.gov.uk/ukpga/2019/4/contents',
    keyKeywords: ['tenant fees act', 'uk lease', '5 weeks deposit', 'prohibited fees'],
  },
];
