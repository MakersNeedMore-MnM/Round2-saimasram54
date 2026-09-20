'use client';

import React, { useState } from 'react';
import { LeaseDocument } from '@/types/lease';
import { HelpCircle, Copy, Check, ArrowRight } from 'lucide-react';

interface QuestionsGeneratorViewProps {
  document: LeaseDocument;
  onAskInChat: (question: string) => void;
}

export const QuestionsGeneratorView: React.FC<QuestionsGeneratorViewProps> = ({
  document,
  onAskInChat,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const questions = document.suggestedQuestions.length > 0
    ? document.suggestedQuestions
    : [
        'Can the rent be increased during the current lease period?',
        'What conditions allow early termination without financial penalty?',
        'Who is responsible for major appliance and structural repairs?',
        'How is the security deposit returned and in what timeframe?',
        'Can the agreement be renewed automatically at the end of 12 months?',
      ];

  const handleCopyAll = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyOne = (q: string, idx: number) => {
    navigator.clipboard.writeText(q);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-4 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-white" />
            <span>Personalized Questions for Landlord / Legal Counsel</span>
          </h3>
          <p className="font-mono text-[11px] text-neutral-400">Generated directly from your uploaded lease document clauses.</p>
        </div>

        <button
          onClick={handleCopyAll}
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#1f1f1f] bg-black px-3 py-1.5 font-mono text-xs text-neutral-300 hover:bg-[#171717] hover:border-neutral-700 transition"
        >
          {copiedIdx === -1 ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copiedIdx === -1 ? 'Copied All!' : 'Copy All Questions'}</span>
        </button>
      </div>

      <div className="space-y-2">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-[4px] border border-[#1f1f1f] bg-black p-3 text-xs transition hover:border-neutral-700"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border border-[#1f1f1f] bg-[#0a0a0a] font-mono text-[10px] font-medium text-neutral-300">
                {idx + 1}
              </span>
              <p className="text-neutral-200 font-medium leading-relaxed">"{q}"</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button
                onClick={() => handleCopyOne(q, idx)}
                className="rounded-[4px] p-1.5 text-neutral-400 hover:bg-[#171717] hover:text-white transition"
                title="Copy Question"
              >
                {copiedIdx === idx ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4" />}
              </button>

              <button
                onClick={() => onAskInChat(q)}
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-mono text-[10px] font-medium text-black hover:bg-neutral-200"
              >
                <span>Ask AI</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
