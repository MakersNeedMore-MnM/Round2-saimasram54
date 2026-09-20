import { GoogleGenAI } from '@google/genai';

/**
 * Gemini embedding models to try, in order of preference.
 * Falls through to the next if the current one is unavailable.
 */
const EMBEDDING_MODEL_CASCADE = [
  'gemini-embedding-001',
  'gemini-embedding-2',
] as const;

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (ai) return ai;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_api_key') || apiKey.startsWith('sk-or-v1-')) {
    throw new Error('GEMINI_API_KEY is required for embedding generation.');
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
}

/**
 * Generate a vector embedding for the given text using Gemini's embedding API.
 * Cascades through multiple embedding models as a failsafe.
 *
 * @param text - The text to embed
 * @returns A number[] vector suitable for pgvector / Supabase similarity search
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getAI();
  let lastError: any = null;

  for (const modelName of EMBEDDING_MODEL_CASCADE) {
    try {
      console.log(`[Embedding] Attempting embedding with model: ${modelName}`);

      const response = await client.models.embedContent({
        model: modelName,
        contents: text,
        config: {
          outputDimensionality: 768,
        },
      });

      const embedding = response.embeddings?.[0]?.values || (response as any).embedding?.values;

      if (!embedding || embedding.length === 0) {
        throw new Error(`Empty embedding returned from model ${modelName}`);
      }

      console.log(`[Embedding] ✓ Generated ${embedding.length}-dim vector with model: ${modelName}`);
      return embedding;

      if (!embedding || embedding.length === 0) {
        throw new Error(`Empty embedding returned from model ${modelName}`);
      }

      console.log(`[Embedding] ✓ Generated ${embedding.length}-dim vector with model: ${modelName}`);
      return embedding;
    } catch (error: any) {
      console.warn(`[Embedding] ✗ Model ${modelName} failed:`, error?.message || error);
      lastError = error;
    }
  }

  console.error('[Embedding] All embedding models exhausted.');
  throw lastError || new Error('All Gemini embedding models failed.');
}
