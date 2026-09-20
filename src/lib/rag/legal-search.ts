import { supabaseAdmin } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/ai/embedding";

/**
 * Result shape returned by the match_legal_chunks RPC,
 * joining legal_chunks with legal_documents.
 */
export interface LegalSearchResult {
  id: number;
  chunk_text: string;
  page_number: number | null;
  section_number: string | null;
  section_title: string | null;
  document_id: number;
  document_title: string;
  authority: string;
  jurisdiction: string;
  document_type: string;
  source_url: string | null;
  similarity: number;
}

/**
 * Search for relevant legal evidence chunks using semantic vector similarity.
 *
 * Converts the query into an embedding via Gemini, then calls the
 * `match_legal_chunks` Supabase RPC (pgvector cosine similarity)
 * to find the most relevant legal document chunks.
 *
 * @param query - Natural language legal question
 * @param jurisdiction - Optional jurisdiction filter (e.g. "California, US")
 * @param limit - Max number of results to return (default: 5)
 * @returns Array of matching chunks with text, metadata, and similarity score
 */
export interface SearchLegalEvidenceOptions {
  jurisdiction?: string;
  limit?: number;
  threshold?: number;
}

/**
 * Search for relevant legal evidence chunks using semantic vector similarity.
 *
 * Converts the query into an embedding via Gemini, then calls the
 * `match_legal_chunks` Supabase RPC (pgvector cosine similarity)
 * to find the most relevant legal document chunks.
 *
 * @param query - Natural language legal question
 * @param options - Search options (jurisdiction filter, limit, match threshold)
 * @returns Array of matching chunks with text, metadata, and similarity score
 */
export async function searchLegalEvidence(
  query: string,
  options: SearchLegalEvidenceOptions = {}
): Promise<LegalSearchResult[]> {
  const { jurisdiction, limit = 5, threshold = 0.30 } = options;
  const embedding = await generateEmbedding(query);

  const { data, error } = await supabaseAdmin.rpc(
    "match_legal_chunks",
    {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      filter_jurisdiction: jurisdiction ?? null,
    }
  );

  if (error) {
    throw new Error(`Legal search failed: ${error.message}`);
  }

  return (data as LegalSearchResult[]) ?? [];
}

/**
 * Format search results into a text block suitable for LLM context injection.
 */
export function formatLegalEvidence(results: LegalSearchResult[]): string {
  if (results.length === 0) {
    return 'No matching legal sources found.';
  }

  return results.map((r, idx) => `
[LEGAL SOURCE ${idx + 1}] (similarity: ${(r.similarity * 100).toFixed(1)}%)
Authority: ${r.authority}
Title: ${r.document_title}
Jurisdiction: ${r.jurisdiction}
Type: ${r.document_type}
Section: ${r.section_title || r.section_number || 'N/A'}
Source: ${r.source_url || 'N/A'}
Statutory Excerpt: "${r.chunk_text}"
`).join('\n');
}
