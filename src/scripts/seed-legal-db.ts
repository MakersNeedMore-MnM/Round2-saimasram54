/**
 * LeaseLens AI — Supabase Legal Knowledge Base Seed Script
 *
 * Seeds the legal_documents and legal_chunks tables with statutory
 * legal knowledge, then generates Gemini embeddings for vector search.
 *
 * Usage:
 *   npx tsx src/scripts/seed-legal-db.ts
 *
 * Prerequisites:
 *   - Supabase tables created (legal_documents, legal_chunks)
 *   - match_legal_chunks RPC function created (supabase_migration.sql)
 *   - .env.local configured with SUPABASE and GEMINI keys
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY!;
const GEMINI_KEY = process.env.GEMINI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SECRET || !GEMINI_KEY) {
  console.error('❌ Missing env vars. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, GEMINI_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

// ────────────────────────────────────────────
// Embedding models cascade (same as app)
// ────────────────────────────────────────────
const EMBEDDING_MODELS = ['gemini-embedding-001', 'gemini-embedding-2'];

async function generateEmbedding(text: string): Promise<number[]> {
  for (const model of EMBEDDING_MODELS) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: text,
        config: {
          outputDimensionality: 768,
        },
      });
      const values = response.embeddings?.[0]?.values || (response as any).embedding?.values;
      if (values && values.length > 0) return values;
    } catch (err: any) {
      console.warn(`  ⚠ Embedding model ${model} failed: ${err.message}`);
    }
  }
  throw new Error('All embedding models failed');
}

// ────────────────────────────────────────────
// Legal Documents + Chunks to seed
// ────────────────────────────────────────────

interface SeedDocument {
  document_key: string;
  title: string;
  authority: string;
  jurisdiction: string;
  document_type: string;
  version_date: string;
  source_url: string;
  chunks: {
    chunk_text: string;
    page_number: number | null;
    section_number: string;
    section_title: string;
  }[];
}

const SEED_DATA: SeedDocument[] = [
  // ═══════════════════════════════════════
  // CALIFORNIA, UNITED STATES
  // ═══════════════════════════════════════
  {
    document_key: 'ca-civ-1950.5',
    title: 'California Civil Code § 1950.5 — Security Deposits & Refund Timelines',
    authority: 'California State Legislature',
    jurisdiction: 'California, United States',
    document_type: 'Statute',
    version_date: '2024-07-01',
    source_url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5',
    chunks: [
      {
        chunk_text: 'No later than 21 calendar days after the tenant has vacated the premises, the landlord shall furnish the tenant with a copy of an itemized statement indicating the basis for, and the amount of, any security received and the disposition of the security and shall return any remaining portion of the security to the tenant.',
        page_number: null,
        section_number: '§ 1950.5(g)(1)',
        section_title: 'Security Deposit Refund Timeline',
      },
      {
        chunk_text: 'The landlord may claim from the security deposit only those amounts as are reasonably necessary for: the repair of damages to the premises caused by the tenant, exclusive of ordinary wear and tear; the cleaning of the premises upon termination of the tenancy; to remedy future defaults by the tenant in any obligation under the rental agreement to restore, replace, or return personal property.',
        page_number: null,
        section_number: '§ 1950.5(b)',
        section_title: 'Permissible Security Deposit Deductions',
      },
    ],
  },
  {
    document_key: 'ca-ab12',
    title: 'California Assembly Bill 12 (AB 12) — Security Deposit Cap',
    authority: 'California State Legislature',
    jurisdiction: 'California, United States',
    document_type: 'Statute',
    version_date: '2024-07-01',
    source_url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB12',
    chunks: [
      {
        chunk_text: 'Effective July 1, 2024, a landlord shall not demand or receive security, however denominated, in an amount or value in excess of an amount equal to one month\'s rent for residential property. Any lease clause requiring more than one month\'s rent as security deposit is void and unenforceable under California law.',
        page_number: null,
        section_number: '§ 1950.5(c)(1)',
        section_title: 'Maximum Security Deposit Amount',
      },
    ],
  },
  {
    document_key: 'ca-ab1482',
    title: 'California Tenant Protection Act (AB 1482) — Rent Increase Limits',
    authority: 'California Department of Real Estate',
    jurisdiction: 'California, United States',
    document_type: 'Statute',
    version_date: '2024-01-01',
    source_url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1947.12',
    chunks: [
      {
        chunk_text: 'An owner of residential real property shall not, over the course of any 12-month period, increase the gross rental rate for a dwelling or unit more than 5% plus the percentage change in the cost of living (CPI), or 10%, whichever is lower. Any rent increase exceeding this cap is void and the tenant is not obligated to pay the excess amount.',
        page_number: null,
        section_number: '§ 1947.12(a)',
        section_title: 'Annual Rent Increase Cap',
      },
      {
        chunk_text: 'Just cause is required for termination of a tenancy after the tenant has occupied the unit for 12 months. At-fault just cause includes failure to pay rent, breach of material lease terms, criminal activity on the premises. No-fault just cause includes owner move-in, substantial renovation, or withdrawal from rental market under the Ellis Act.',
        page_number: null,
        section_number: '§ 1946.2(b)',
        section_title: 'Just Cause Eviction Requirements',
      },
    ],
  },
  {
    document_key: 'ca-civ-1671',
    title: 'California Civil Code § 1671 — Liquidated Damages Enforceability',
    authority: 'California State Legislature',
    jurisdiction: 'California, United States',
    document_type: 'Statute',
    version_date: '2024-01-01',
    source_url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1671',
    chunks: [
      {
        chunk_text: 'A provision in a contract liquidating the damages for breach of contract is void if the party seeking to invalidate the provision establishes that the provision was unreasonable under the circumstances existing at the time the contract was made. Early termination penalties that combine deposit forfeiture with additional multi-month rent penalties are generally considered unreasonable and unenforceable.',
        page_number: null,
        section_number: '§ 1671(b)',
        section_title: 'Liquidated Damages Validity Test',
      },
    ],
  },
  {
    document_key: 'ca-civ-1941.1',
    title: 'California Civil Code § 1941.1 — Implied Warranty of Habitability',
    authority: 'California State Legislature',
    jurisdiction: 'California, United States',
    document_type: 'Statute',
    version_date: '2024-01-01',
    source_url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1941.1',
    chunks: [
      {
        chunk_text: 'A dwelling shall be deemed untenantable if it substantially lacks effective waterproofing and weather protection, plumbing or gas facilities maintained in good working order, hot and cold running water, heating facilities in good working order, or electrical lighting with wiring maintained in good working order. The landlord\'s obligation to maintain habitability cannot be waived by contract.',
        page_number: null,
        section_number: '§ 1941.1(a)',
        section_title: 'Habitability Standards',
      },
      {
        chunk_text: 'A lease provision that purports to make the tenant responsible for repairs necessary to maintain the premises in a habitable condition, including HVAC, plumbing, electrical, and structural integrity, is unenforceable. The landlord has a non-waivable duty to maintain the premises in a condition fit for human occupancy.',
        page_number: null,
        section_number: '§ 1942.5',
        section_title: 'Tenant Repair Responsibility Limits',
      },
    ],
  },
  {
    document_key: 'ca-civ-1927',
    title: 'California Civil Code § 1927 — Quiet Enjoyment & Guest Rights',
    authority: 'California State Legislature',
    jurisdiction: 'California, United States',
    document_type: 'Statute',
    version_date: '2024-01-01',
    source_url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1927',
    chunks: [
      {
        chunk_text: 'The lessor of a building intended for the occupation of human beings must ensure that the tenant has the right to quiet enjoyment and possession of the premises. Guest fee provisions charging per-night fees for overnight guests may violate the tenant\'s right to quiet enjoyment and reasonable residential use. Blanket subletting bans may be enforceable but cannot restrict normal guest visits.',
        page_number: null,
        section_number: '§ 1927',
        section_title: 'Right to Quiet Enjoyment',
      },
    ],
  },

  // ═══════════════════════════════════════
  // NEW YORK, UNITED STATES
  // ═══════════════════════════════════════
  {
    document_key: 'ny-rpl-238a',
    title: 'New York Real Property Law § 238-a — Late Fee Limitations',
    authority: 'New York State Assembly',
    jurisdiction: 'New York, United States',
    document_type: 'Statute',
    version_date: '2024-01-01',
    source_url: 'https://www.nysenate.gov/legislation/laws/RPP/238-A',
    chunks: [
      {
        chunk_text: 'No landlord, lessor, sublessor or grantor may demand any payment, fee, or charge for the late payment of rent unless the payment of rent has not been made within five days of the date specified. Any late fee shall not exceed fifty dollars or five percent of the monthly rent, whichever is less.',
        page_number: null,
        section_number: '§ 238-a(2)',
        section_title: 'Maximum Late Fees',
      },
    ],
  },
  {
    document_key: 'ny-hstpa-2019',
    title: 'New York Housing Stability and Tenant Protection Act of 2019',
    authority: 'New York State Legislature',
    jurisdiction: 'New York, United States',
    document_type: 'Statute',
    version_date: '2019-06-14',
    source_url: 'https://www.nysenate.gov/legislation/laws/RPP/7-108',
    chunks: [
      {
        chunk_text: 'Security deposits for residential tenancies are limited to one month\'s rent. Landlords must return the deposit within 14 days of the tenant vacating the premises, accompanied by an itemized statement of any deductions. Non-refundable deposits and last-month-rent deposits are prohibited.',
        page_number: null,
        section_number: '§ 7-108',
        section_title: 'Security Deposit Limits & Return',
      },
      {
        chunk_text: 'Lease renewal offers must be provided between 90 and 150 days prior to the end of the tenancy for leases of two years or more, between 60 and 90 days for leases of one year or more, and between 30 and 60 days for all other tenancies. Failure to provide timely renewal notice results in a month-to-month tenancy.',
        page_number: null,
        section_number: '§ 226-c',
        section_title: 'Lease Renewal Notice Requirements',
      },
    ],
  },

  // ═══════════════════════════════════════
  // TEXAS, UNITED STATES
  // ═══════════════════════════════════════
  {
    document_key: 'tx-prop-92',
    title: 'Texas Property Code Chapter 92 — Residential Tenancies',
    authority: 'Texas State Legislature',
    jurisdiction: 'Texas, United States',
    document_type: 'Statute',
    version_date: '2024-01-01',
    source_url: 'https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm',
    chunks: [
      {
        chunk_text: 'A landlord shall refund a security deposit to the tenant on or before the 30th day after the date the tenant surrenders the premises. The landlord may deduct from the deposit damages and charges for which the tenant is legally liable under the lease or resulting from a breach of the lease.',
        page_number: null,
        section_number: '§ 92.103',
        section_title: 'Security Deposit Return (30 Days)',
      },
      {
        chunk_text: 'A landlord shall make a diligent effort to repair or remedy a condition materially affecting the physical health or safety of an ordinary tenant if the tenant gives the landlord notice and the tenant is not delinquent in rent. The landlord\'s duty to repair includes maintaining the premises in a condition that is fit, habitable, and compliant with building and housing codes.',
        page_number: null,
        section_number: '§ 92.052',
        section_title: 'Landlord Duty to Repair',
      },
      {
        chunk_text: 'A provision of a lease that purports to waive a right or exempt a landlord from liability under this subchapter is void. A tenant who prevails in a suit against a landlord for breach of duty to repair may recover actual damages, one month\'s rent plus $500, court costs, and reasonable attorney\'s fees.',
        page_number: null,
        section_number: '§ 92.006',
        section_title: 'Non-Waivable Tenant Rights',
      },
    ],
  },

  // ═══════════════════════════════════════
  // INDIA (Maharashtra)
  // ═══════════════════════════════════════
  {
    document_key: 'in-mta-2021',
    title: 'Model Tenancy Act, 2021 — Ministry of Housing and Urban Affairs',
    authority: 'Ministry of Housing and Urban Affairs, Government of India',
    jurisdiction: 'Maharashtra, India',
    document_type: 'Model Act',
    version_date: '2021-06-02',
    source_url: 'https://mohua.gov.in/',
    chunks: [
      {
        chunk_text: 'Security deposit for residential premises shall not exceed two months\' rent. The security deposit shall be refunded to the tenant on the date of taking over vacant possession after deducting any dues or damage charges. Any agreement demanding security deposit exceeding two months\' rent for residential property is deemed unreasonable.',
        page_number: null,
        section_number: 'Section 11',
        section_title: 'Security Deposit Cap (2 Months)',
      },
      {
        chunk_text: 'The rent authority shall fix the period for tenancy at the time of registration. No landlord or tenant shall terminate the tenancy without giving written notice of at least the period specified in the agreement, or one month in the absence of such specification. Every tenancy agreement must be registered with the Rent Authority within two months of execution.',
        page_number: null,
        section_number: 'Section 4-5',
        section_title: 'Tenancy Registration & Termination Notice',
      },
      {
        chunk_text: 'The tenant shall not sublet the whole or part of the premises without the prior written consent of the landlord. Any subletting done without permission shall be deemed a ground for eviction. The tenant is responsible for maintaining sanitary conditions and is prohibited from making structural alterations without written consent.',
        page_number: null,
        section_number: 'Section 7-8',
        section_title: 'Subletting & Tenant Obligations',
      },
    ],
  },
  {
    document_key: 'mh-rent-act-1999',
    title: 'Maharashtra Rent Control Act, 1999',
    authority: 'Government of Maharashtra',
    jurisdiction: 'Maharashtra, India',
    document_type: 'Statute',
    version_date: '2000-03-31',
    source_url: 'https://www.maharashtra.gov.in/',
    chunks: [
      {
        chunk_text: 'Notwithstanding anything contained in this Act, a licensee in possession of premises on leave and license basis shall deliver possession to the licensor on expiry of the period specified in the agreement. Lock-in period clauses in leave and license agreements are generally enforceable. The licensee does not acquire tenancy rights under a leave and license agreement.',
        page_number: null,
        section_number: 'Section 24',
        section_title: 'Leave and License — Possession & Lock-in',
      },
    ],
  },

  // ═══════════════════════════════════════
  // UNITED KINGDOM
  // ═══════════════════════════════════════
  {
    document_key: 'uk-tenant-fees-2019',
    title: 'UK Tenant Fees Act 2019',
    authority: 'UK Parliament',
    jurisdiction: 'England, United Kingdom',
    document_type: 'Statute',
    version_date: '2019-06-01',
    source_url: 'https://www.legislation.gov.uk/ukpga/2019/4/contents',
    chunks: [
      {
        chunk_text: 'Tenancy deposits are capped at 5 weeks\' rent where the total annual rent is less than £50,000, or 6 weeks\' rent where the total annual rent is £50,000 or above. Landlords and letting agents cannot charge prohibited fees including administration fees, inventory check fees, or excessive late payment charges.',
        page_number: null,
        section_number: 'Schedule 1',
        section_title: 'Deposit Cap & Prohibited Fees',
      },
      {
        chunk_text: 'A late payment fee may only be imposed if the rent is more than 14 days overdue and must not exceed 3% above the Bank of England base rate on the outstanding rent amount. Any contractual clause imposing higher late fees is unenforceable. Landlords must protect the deposit in an approved tenancy deposit scheme within 30 days.',
        page_number: null,
        section_number: 'Schedule 1, Para 5',
        section_title: 'Late Payment Fee Restrictions',
      },
    ],
  },
  {
    document_key: 'uk-housing-act-1988',
    title: 'UK Housing Act 1988 — Assured Shorthold Tenancies',
    authority: 'UK Parliament',
    jurisdiction: 'England, United Kingdom',
    document_type: 'Statute',
    version_date: '2023-10-01',
    source_url: 'https://www.legislation.gov.uk/ukpga/1988/50/contents',
    chunks: [
      {
        chunk_text: 'A landlord seeking to recover possession of a dwelling-house let under an assured shorthold tenancy must give the tenant not less than two months\' notice in writing (Section 21 notice) stating that possession is required. The notice cannot be served within the first four months of the tenancy. The tenant has the right to remain until a court order for possession is obtained.',
        page_number: null,
        section_number: 'Section 21',
        section_title: 'No-Fault Eviction Notice (Section 21)',
      },
    ],
  },

  // ═══════════════════════════════════════
  // CANADA (Ontario)
  // ═══════════════════════════════════════
  {
    document_key: 'on-rta-2006',
    title: 'Ontario Residential Tenancies Act, 2006',
    authority: 'Ontario Legislature',
    jurisdiction: 'Ontario, Canada',
    document_type: 'Statute',
    version_date: '2024-01-01',
    source_url: 'https://www.ontario.ca/laws/statute/06r17',
    chunks: [
      {
        chunk_text: 'A landlord shall not require a tenant to pay a security deposit other than a rent deposit in the amount of the last month\'s rent. The rent deposit must be applied to the last month of the tenancy and may not be used for repairs or damages. Interest must accrue on the deposit at a rate equal to the guideline rent increase percentage.',
        page_number: null,
        section_number: 'Section 105-107',
        section_title: 'Rent Deposit (Last Month Only)',
      },
      {
        chunk_text: 'The annual rent increase for most residential rental units is limited to the guideline amount published by the government, which is typically tied to the Ontario Consumer Price Index. Increases above the guideline require Landlord and Tenant Board approval. A landlord must give at least 90 days\' written notice before a rent increase takes effect.',
        page_number: null,
        section_number: 'Section 116-120',
        section_title: 'Annual Rent Increase Cap',
      },
      {
        chunk_text: 'A tenant may assign or sublet the rental unit with the consent of the landlord, which shall not be unreasonably withheld. A landlord who unreasonably withholds consent may be subject to penalties. The tenant remains liable under the tenancy agreement if the subtenant defaults, unless the landlord has consented to an assignment.',
        page_number: null,
        section_number: 'Section 95-98',
        section_title: 'Subletting & Assignment Rights',
      },
    ],
  },
];

// ────────────────────────────────────────────
// Seed Runner
// ────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function seed() {
  console.log('🌱 LeaseLens AI — Legal Knowledge Base Seeder');
  console.log('══════════════════════════════════════════════\n');

  let totalDocs = 0;
  let totalChunks = 0;

  for (const doc of SEED_DATA) {
    console.log(`📄 ${doc.title}`);

    // 1. Upsert the parent document
    const { data: inserted, error: docError } = await supabase
      .from('legal_documents')
      .upsert(
        {
          document_key: doc.document_key,
          title: doc.title,
          authority: doc.authority,
          jurisdiction: doc.jurisdiction,
          document_type: doc.document_type,
          version_date: doc.version_date,
          source_url: doc.source_url,
        },
        { onConflict: 'document_key' }
      )
      .select('id')
      .single();

    if (docError) {
      console.error(`   ❌ Failed to insert document: ${docError.message}`);
      continue;
    }

    const documentId = inserted.id;
    totalDocs++;

    // 2. Insert chunks with embeddings
    for (const chunk of doc.chunks) {
      try {
        console.log(`   📎 Embedding: "${chunk.section_title}"...`);

        const embedding = await generateEmbedding(chunk.chunk_text);

        const { error: chunkError } = await supabase
          .from('legal_chunks')
          .insert({
            document_id: documentId,
            chunk_text: chunk.chunk_text,
            page_number: chunk.page_number,
            section_number: chunk.section_number,
            section_title: chunk.section_title,
            embedding: embedding,
          });

        if (chunkError) {
          console.error(`   ❌ Chunk insert failed: ${chunkError.message}`);
        } else {
          console.log(`   ✅ Inserted (${embedding.length}-dim vector)`);
          totalChunks++;
        }

        // Rate limiting: small pause between embedding calls
        await sleep(300);
      } catch (err: any) {
        console.error(`   ❌ Embedding/insert failed: ${err.message}`);
      }
    }

    console.log('');
  }

  console.log('══════════════════════════════════════════════');
  console.log(`✅ Seeding complete: ${totalDocs} documents, ${totalChunks} chunks with embeddings`);
  console.log('');
  console.log('Next: Test vector search at http://localhost:3000/api/supabase-test');
}

seed().catch(err => {
  console.error('❌ Seed script failed:', err);
  process.exit(1);
});
