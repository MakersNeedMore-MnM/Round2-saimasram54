'use client';

import React, { useState } from 'react';
import { LeaseDocument } from '@/types/lease';
import { AlertTriangle, FileQuestion, ArrowRight } from 'lucide-react';

interface MissingAndAmbiguityViewProps {
  document: LeaseDocument;
  onAskInChat: (question: string) => void;
}

export const MissingAndAmbiguityView: React.FC<MissingAndAmbiguityViewProps> = ({
  document,
  onAskInChat,
}) => {
  const [activeTab, setActiveTab] = useState<'missing' | 'ambiguity'>('missing');

  return (
    <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-4 shadow-xl space-y-4 font-sans">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => setActiveTab('missing')}
            className={`flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'missing'
                ? 'bg-white text-black border-white'
                : 'bg-black border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Missing Terms ({document.missingItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ambiguity')}
            className={`flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'ambiguity'
                ? 'bg-white text-black border-white'
                : 'bg-black border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <FileQuestion className="h-3.5 w-3.5" />
            <span>Ambiguous Clauses ({document.ambiguities.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'missing' ? (
        <div className="space-y-3">
          {document.missingItems.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-neutral-500">
              No essential missing terms detected in this lease agreement.
            </div>
          ) : (
            document.missingItems.map((item) => (
              <div key={item.id} className="rounded-[4px] border border-amber-900/40 bg-amber-950/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">⚠️ {item.title}</span>
                  <span className="rounded-[3px] border border-amber-900/50 bg-amber-950/40 px-2 py-0.5 font-mono text-[9px] text-amber-400 uppercase">
                    SEVERITY: {item.severity}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">{item.description}</p>

                <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-2.5 space-y-1 text-xs">
                  <p className="font-mono text-[9px] text-neutral-500 uppercase">Impact on Tenant</p>
                  <p className="text-neutral-300">{item.impact}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[11px] text-neutral-400">Action: {item.recommendedAction}</span>
                  <button
                    onClick={() => onAskInChat(`Why is "${item.title}" missing from my lease and how do I fix it?`)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-amber-300 hover:underline"
                  >
                    <span>Ask AI Assistant</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {document.ambiguities.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-neutral-500">
              No ambiguous or vague clauses detected.
            </div>
          ) : (
            document.ambiguities.map((item) => (
              <div key={item.id} className="rounded-[4px] border border-[#1f1f1f] bg-black p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">❓ {item.title}</span>
                  <span className="font-mono text-[10px] text-neutral-500">Page {item.page}, {item.section}</span>
                </div>

                <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2.5 font-mono text-[11px] text-neutral-300 italic">
                  "{item.originalText}"
                </div>

                <p className="text-xs text-neutral-300"><strong>Why it is ambiguous:</strong> {item.ambiguityReason}</p>

                <div className="space-y-1 text-xs">
                  <p className="font-mono text-[9px] text-neutral-500 uppercase">Possible Interpretations</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px]">
                    {item.possibleInterpretations.map((interp, idx) => (
                      <li key={idx}>{interp}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2.5 flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Question to ask: <em>"{item.suggestedQuestion}"</em></span>
                  <button
                    onClick={() => onAskInChat(item.suggestedQuestion)}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-mono text-[10px] font-medium text-black hover:bg-neutral-200"
                  >
                    Ask Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
