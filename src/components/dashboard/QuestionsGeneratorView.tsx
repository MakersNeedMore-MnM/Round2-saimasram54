'use client';

import React, { useState } from 'react';
import { LeaseDocument } from '@/types/lease';
import { HelpCircle, Copy, Check, MessageSquare, ArrowRight } from 'lucide-react';

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <span>Personalized Questions for Landlord / Legal Counsel</span>
          </h3>
          <p className="text-xs text-slate-400">Generated directly from your uploaded lease document clauses.</p>
        </div>

        <button
          onClick={handleCopyAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
        >
          {copiedIdx === -1 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copiedIdx === -1 ? 'Copied All!' : 'Copy All Questions'}</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs transition hover:border-slate-700"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600/20 text-[10px] font-bold text-indigo-400">
                {idx + 1}
              </span>
              <p className="text-slate-200 font-medium leading-relaxed">"{q}"</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button
                onClick={() => handleCopyOne(q, idx)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                title="Copy Question"
              >
                {copiedIdx === idx ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>

              <button
                onClick={() => onAskInChat(q)}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-500"
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
