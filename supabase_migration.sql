-- ============================================================
-- LeaseLens AI — Supabase SQL Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lvmlfngqunttxkgfbwbf/sql
-- ============================================================

-- 1. Enable the pgvector extension (if not already enabled)
create extension if not exists vector;

-- 2. Create index on legal_chunks.embedding for fast similarity search
--    (Uses HNSW index for best performance with cosine distance)
create index if not exists legal_chunks_embedding_idx
  on legal_chunks
  using hnsw (embedding vector_cosine_ops);

-- 3. Create the match_legal_chunks RPC function
--    This JOINs legal_chunks with legal_documents to return full context.
--    Called by: searchLegalEvidence() in src/lib/rag/legal-search.ts

create or replace function match_legal_chunks(
  query_embedding     vector(768),
  match_threshold     float    default 0.30,
  match_count         int      default 5,
  filter_jurisdiction text     default null
)
returns table (
  id               bigint,
  chunk_text       text,
  page_number      int,
  section_number   text,
  section_title    text,
  document_id      bigint,
  document_title   text,
  authority        text,
  jurisdiction     text,
  document_type    text,
  source_url       text,
  similarity       float
)
language plpgsql
as $$
begin
  return query
    select
      lc.id,
      lc.chunk_text,
      lc.page_number,
      lc.section_number,
      lc.section_title,
      lc.document_id,
      ld.title          as document_title,
      ld.authority,
      ld.jurisdiction,
      ld.document_type,
      ld.source_url,
      1 - (lc.embedding <=> query_embedding) as similarity
    from legal_chunks lc
    join legal_documents ld on ld.id = lc.document_id
    where
      1 - (lc.embedding <=> query_embedding) > match_threshold
      and (filter_jurisdiction is null or ld.jurisdiction ilike '%' || filter_jurisdiction || '%')
    order by lc.embedding <=> query_embedding
    limit match_count;
end;
$$;
