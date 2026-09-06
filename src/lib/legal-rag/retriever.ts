import { STATUTORY_LEGAL_DATABASE, StatutorySource } from './database';
import { Chunk } from '../document/parser';

export interface RetrievedLegalContext {
  sources: StatutorySource[];
  formattedContextText: string;
}

export function retrieveLegalSources(
  queryOrClauseText: string,
  country: string = 'United States',
  state: string = 'California',
  limit: number = 3
): RetrievedLegalContext {
  const queryLower = queryOrClauseText.toLowerCase();
  
  // Filter by country/state first if matching entries exist
  let pool = STATUTORY_LEGAL_DATABASE.filter(s => 
    s.country.toLowerCase() === country.toLowerCase() ||
    s.state.toLowerCase() === state.toLowerCase()
  );

  if (pool.length === 0) {
    pool = STATUTORY_LEGAL_DATABASE;
  }

  // Score each statutory source based on keyword overlap and semantic relevance
  const scored = pool.map(source => {
    let score = 0;
    
    source.keyKeywords.forEach(kw => {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 3;
      }
    });

    if (queryLower.includes(source.topic.toLowerCase())) {
      score += 5;
    }

    if (queryLower.includes(source.citation.toLowerCase())) {
      score += 10;
    }

    return { source, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const topSources = scored
    .filter(item => item.score > 0)
    .slice(0, limit)
    .map(item => item.source);

  // Fallback if no specific match
  const finalSources = topSources.length > 0 ? topSources : pool.slice(0, 1);

  const formattedContextText = finalSources.map((s, idx) => `
[LEGAL SOURCE ${idx + 1}]
Authority: ${s.authority}
Title: ${s.title}
Citation: ${s.citation}
Source Link: ${s.url}
Statutory Excerpt: "${s.excerpt}"
`).join('\n');

  return {
    sources: finalSources,
    formattedContextText,
  };
}

export function retrieveRelevantDocumentChunks(
  query: string,
  chunks: Chunk[],
  topK: number = 4
): Chunk[] {
  const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);

  const scoredChunks = chunks.map(chunk => {
    const chunkTextLower = chunk.text.toLowerCase();
    let score = 0;

    queryWords.forEach(word => {
      const occurrences = (chunkTextLower.match(new RegExp(word, 'g')) || []).length;
      score += occurrences;
    });

    return { chunk, score };
  });

  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks.slice(0, topK).map(sc => sc.chunk);
}
