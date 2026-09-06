'use client';

import React, { useState } from 'react';
import { LeaseDocument } from '@/types/lease';
import { AlertTriangle, HelpCircle, FileQuestion, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-lg space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('missing')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'missing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Missing Information ({document.missingItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ambiguity')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'ambiguity'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <FileQuestion className="h-4 w-4" />
            <span>Ambiguous Clauses ({document.ambiguities.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'missing' ? (
        <div className="space-y-3">
          {document.missingItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No essential missing terms detected in this lease agreement.
            </div>
          ) : (
            document.missingItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">⚠️ {item.title}</span>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    SEVERITY: {item.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{item.description}</p>

                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5 space-y-1 text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Impact on Tenant</p>
                  <p className="text-slate-300">{item.impact}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-indigo-400">Action: {item.recommendedAction}</span>
                  <button
                    onClick={() => onAskInChat(`Why is "${item.title}" missing from my lease and how do I fix it?`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:underline"
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
            <div className="p-8 text-center text-xs text-slate-500">
              No ambiguous or vague clauses detected.
            </div>
          ) : (
            document.ambiguities.map((item) => (
              <div key={item.id} className="rounded-xl border border-indigo-500/30 bg-indigo-950/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">❓ {item.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">Page {item.page}, {item.section}</span>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-2.5 font-mono text-[11px] text-slate-300 italic">
                  "{item.originalText}"
                </div>

                <p className="text-xs text-slate-300"><strong>Why it is ambiguous:</strong> {item.ambiguityReason}</p>

                <div className="space-y-1 text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Possible Interpretations</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                    {item.possibleInterpretations.map((interp, idx) => (
                      <li key={idx}>{interp}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/40 p-2.5 flex items-center justify-between text-xs">
                  <span className="text-indigo-200">Question to ask: <em>"{item.suggestedQuestion}"</em></span>
                  <button
                    onClick={() => onAskInChat(item.suggestedQuestion)}
                    className="inline-flex items-center gap-1 rounded bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-indigo-500"
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
