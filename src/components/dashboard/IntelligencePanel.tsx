'use client';

import React from 'react';
import { Clause, Jurisdiction } from '@/types/lease';
import { ShieldAlert, BookOpen, Scale, HelpCircle, ExternalLink, User, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

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
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-xl backdrop-blur-lg">
        <Sparkles className="h-10 w-10 text-indigo-400 opacity-60 mb-3" />
        <h3 className="text-base font-bold text-white">AI Legal Intelligence Panel</h3>
        <p className="mt-2 text-xs text-slate-400 max-w-xs">
          Select any clause from the navigator or document viewer to inspect transparent risk models, contract evidence, and statutory legal grounding.
        </p>
      </div>
    );
  }

  const getRiskBadgeStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-lg space-y-4 overflow-y-auto custom-scrollbar">
      {/* Clause Header & Category */}
      <div className="border-b border-slate-800 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            {clause.category} • {clause.section}
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${getRiskBadgeStyle(clause.riskLevel)}`}>
            {clause.riskLevel} RISK
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">{clause.title}</h2>
      </div>

      {/* Transparent Risk Model (Likelihood x Impact) */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">Transparent Risk Model</span>
          <span className="font-mono font-bold text-indigo-400">Likelihood ({clause.likelihood}/5) × Impact ({clause.impact}/5)</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{clause.riskReasoning}</p>
      </div>

      {/* SECTION 1: CONTRACT EVIDENCE */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-indigo-300">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>CONTRACT EVIDENCE</span>
          </div>
          <span className="text-[10px] font-mono text-indigo-400">Page {clause.page}, {clause.section}</span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/90 p-3 font-mono text-[11px] text-slate-300 leading-relaxed italic">
          "{clause.originalText}"
        </div>
      </div>

      {/* SECTION 2: AI INTERPRETATION */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>AI INTERPRETATION</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">Affected: <strong className="text-white">{clause.affectedParty}</strong></span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{clause.plainExplanation}</p>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 space-y-1 text-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Obligation</p>
          <p className="text-slate-300">{clause.obligation}</p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 space-y-1 text-xs">
          <p className="text-[10px] font-bold text-amber-400 uppercase">Potential Concern</p>
          <p className="text-amber-200">{clause.potentialConcern}</p>
        </div>
      </div>

      {/* SECTION 3: LEGAL EVIDENCE (RAG GROUNDED) */}
      <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-violet-300">
            <Scale className="h-4 w-4 text-violet-400" />
            <span>LEGAL EVIDENCE</span>
          </div>
          <span className="text-[10px] font-semibold text-violet-300">{jurisdiction.state}, {jurisdiction.country}</span>
        </div>

        {clause.legalEvidence ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{clause.legalEvidence.sourceName}</span>
              <span className="font-mono text-[10px] text-violet-400">{clause.legalEvidence.statuteCitation}</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/90 p-3 text-[11px] text-slate-300 leading-relaxed italic">
              "{clause.legalEvidence.excerpt}"
            </div>

            {clause.legalEvidence.sourceUrl && (
              <a
                href={clause.legalEvidence.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>View Official Source</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed">
            {clause.legalContext || 'Unable to verify applicable legal information.'}
          </p>
        )}
      </div>

      {/* SECTION 4: SUGGESTED QUESTIONS */}
      {clause.suggestedQuestions && clause.suggestedQuestions.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <span>Suggested Questions for Landlord</span>
          </div>
          <div className="space-y-1.5">
            {clause.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onAskQuestionInChat && onAskQuestionInChat(q)}
                className="w-full text-left rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-xs text-slate-300 hover:border-indigo-500/40 hover:bg-slate-800 transition"
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
