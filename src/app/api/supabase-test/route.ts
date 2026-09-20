import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { searchLegalEvidence } from "@/lib/rag/legal-search";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check legal_documents table count
    const { data: docs, error: docsError } = await supabaseAdmin
      .from("legal_documents")
      .select("id, document_key, title, jurisdiction, document_type")
      .limit(5);

    // 2. Check legal_chunks table count
    const { count: chunksCount, error: chunksError } = await supabaseAdmin
      .from("legal_chunks")
      .select("*", { count: "exact", head: true });

    // 3. Test vector similarity search RPC (RAG)
    const vectorSearchHits = await searchLegalEvidence(
      "What is the maximum security deposit allowed in California?",
      { limit: 3, threshold: 0.30 }
    );

    return NextResponse.json({
      success: true,
      legal_documents: {
        count: docs?.length ?? 0,
        sample: docs ?? [],
        error: docsError?.message || null,
      },
      legal_chunks: {
        total_count: chunksCount ?? 0,
        error: chunksError?.message || null,
      },
      rag_vector_search_test: {
        query: "What is the maximum security deposit allowed in California?",
        matched_results_count: vectorSearchHits.length,
        top_matches: vectorSearchHits,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
