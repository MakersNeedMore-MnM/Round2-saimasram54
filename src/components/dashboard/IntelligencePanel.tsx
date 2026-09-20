'use client';

import React from 'react';
import { Clause, Jurisdiction } from '@/types/lease';
import { BookOpen, Scale, HelpCircle, ExternalLink, Sparkles } from 'lucide-react';

interface IntelligencePanelProps {
  clause: Clause | null;
  jurisdiction: Jurisdiction;
  onAskQuestionInChat?: (q: string) => void;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  clause,
  jurisdiction,
  onAskQuestionInChat,
}) => {
  if (!clause) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-8 text-center shadow-xl font-sans">
        <Sparkles className="h-8 w-8 text-neutral-400 opacity-60 mb-3" />
        <h3 className="text-sm font-semibold text-white">AI Legal Intelligence Panel</h3>
        <p className="mt-2 text-xs text-neutral-400 max-w-xs">
          Select any clause from the navigator or document viewer to inspect transparent risk models, contract evidence, and statutory legal grounding.
        </p>
      </div>
    );
  }

  const getRiskBadgeStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return 'border-rose-900/50 bg-rose-950/40 text-rose-400';
      case 'MEDIUM':
        return 'border-amber-900/50 bg-amber-950/40 text-amber-300';
      default:
        return 'border-emerald-900/50 bg-emerald-950/40 text-emerald-300';
    }
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3.5 shadow-xl space-y-3 overflow-y-auto custom-scrollbar font-sans">
      {/* Clause Header & Category */}
      <div className="border-b border-[#1f1f1f] pb-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            {clause.category} • {clause.section}
          </span>
          <span className={`rounded-[3px] border px-2 py-0.2 font-mono text-[9px] uppercase font-medium ${getRiskBadgeStyle(clause.riskLevel)}`}>
            {clause.riskLevel} RISK
          </span>
        </div>
        <h2 className="text-sm font-semibold text-white tracking-tight">{clause.title}</h2>
      </div>

      {/* Transparent Risk Model (Likelihood x Impact) */}
      <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] font-medium text-neutral-300 uppercase">Transparent Risk Model</span>
          <span className="font-mono text-[11px] text-neutral-400">Likelihood ({clause.likelihood}/5) × Impact ({clause.impact}/5)</span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">{clause.riskReasoning}</p>
      </div>

      {/* SECTION 1: CONTRACT EVIDENCE */}
      <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300 uppercase">
            <BookOpen className="h-3.5 w-3.5 text-white" />
            <span>CONTRACT EVIDENCE</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500">Page {clause.page}, {clause.section}</span>
        </div>
        <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2.5 font-mono text-[11px] text-neutral-300 leading-relaxed italic">
          "{clause.originalText}"
        </div>
      </div>

      {/* SECTION 2: AI INTERPRETATION */}
      <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span>AI INTERPRETATION</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-400 uppercase">Affected: <strong className="text-white">{clause.affectedParty}</strong></span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">{clause.plainExplanation}</p>

        <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2 space-y-1 text-xs">
          <p className="font-mono text-[9px] text-neutral-500 uppercase">Obligation</p>
          <p className="text-neutral-300">{clause.obligation}</p>
        </div>

        <div className="rounded-[4px] border border-amber-900/40 bg-amber-950/20 p-2 space-y-1 text-xs">
          <p className="font-mono text-[9px] text-amber-400 uppercase">Potential Concern</p>
          <p className="text-amber-200">{clause.potentialConcern}</p>
        </div>
      </div>

      {/* SECTION 3: LEGAL EVIDENCE (RAG GROUNDED) */}
      <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300 uppercase">
            <Scale className="h-3.5 w-3.5 text-white" />
            <span>LEGAL EVIDENCE</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-400">{jurisdiction.state}, {jurisdiction.country}</span>
        </div>

        {clause.legalEvidence ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">{clause.legalEvidence.sourceName}</span>
              <span className="font-mono text-[10px] text-neutral-400">{clause.legalEvidence.statuteCitation}</span>
            </div>

            <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2.5 font-mono text-[11px] text-neutral-300 leading-relaxed italic">
              "{clause.legalEvidence.excerpt}"
            </div>

            {clause.legalEvidence.sourceUrl && (
              <a
                href={clause.legalEvidence.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white hover:underline"
              >
                <span>View Official Source</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 leading-relaxed">
            {clause.legalContext || 'Unable to verify applicable legal information.'}
          </p>
        )}
      </div>

      {/* SECTION 4: SUGGESTED QUESTIONS */}
      {clause.suggestedQuestions && clause.suggestedQuestions.length > 0 && (
        <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-3 space-y-2">
          <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300 uppercase">
            <HelpCircle className="h-3.5 w-3.5 text-white" />
            <span>Suggested Questions for Landlord</span>
          </div>
          <div className="space-y-1.5">
            {clause.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onAskQuestionInChat && onAskQuestionInChat(q)}
                className="w-full text-left rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2 text-xs text-neutral-300 hover:border-neutral-700 hover:bg-[#171717] transition"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
