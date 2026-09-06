import { AIProvider } from './provider';
import { OpenRouterProvider } from './openrouter-provider';
import { GeminiProvider } from './gemini-provider';
import { FallbackProvider } from './fallback-provider';

export * from './provider';

export function getAIProvider(): AIProvider {
  const openRouterKey = process.env.OPENROUTER_API_KEY || (process.env.GEMINI_API_KEY?.startsWith('sk-or-v1-') ? process.env.GEMINI_API_KEY : undefined);
  const geminiKey = process.env.GEMINI_API_KEY;

  if (openRouterKey && openRouterKey.trim() !== '' && !openRouterKey.includes('your_api_key')) {
    try {
      // Default to Meta's top open-weight model: meta-llama/llama-3.3-70b-instruct
      return new OpenRouterProvider(openRouterKey.trim(), 'meta-llama/llama-3.3-70b-instruct');
    } catch (e) {
      console.warn('Failed to initialize OpenRouterProvider:', e);
    }
  }

  if (geminiKey && geminiKey.trim() !== '' && !geminiKey.includes('your_api_key') && !geminiKey.startsWith('sk-or-v1-')) {
    try {
      return new GeminiProvider(geminiKey.trim());
    } catch (e) {
      console.warn('Failed to initialize GeminiProvider:', e);
    }
  }

  return new FallbackProvider();
}
