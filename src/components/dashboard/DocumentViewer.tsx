'use client';

import React, { useEffect, useRef } from 'react';
import { Clause, LeaseDocument } from '@/types/lease';
import { FileText, Search, Highlighter, BookOpen } from 'lucide-react';

interface DocumentViewerProps {
  document: LeaseDocument;
  selectedClause: Clause | null;
  onSelectClause: (clause: Clause) => void;
  activePage: number;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  selectedClause,
  onSelectClause,
  activePage,
}) => {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedClause && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedClause]);

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
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-lg space-y-4">
      {/* Center Pane Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Lease Document Viewer</span>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Viewing Page <strong className="text-white">{activePage}</strong> of {document.totalPages}
        </span>
      </div>

      {/* Document Text Body Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar text-xs leading-relaxed text-slate-300">
        {document.clauses.map((clause) => {
          const isSelected = selectedClause?.id === clause.id;

          return (
            <div
              key={clause.id}
              ref={isSelected ? activeRef : null}
              onClick={() => onSelectClause(clause)}
              className={`group cursor-pointer rounded-2xl border p-4 transition duration-200 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-lg ring-1 ring-indigo-500'
                  : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/80'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-indigo-400">
                    PAGE {clause.page} • {clause.section}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">({clause.category})</span>
                </div>

                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getRiskBadgeStyle(clause.riskLevel)}`}>
                  {clause.riskLevel} RISK
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2">{clause.title}</h3>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 font-mono text-[11px] text-slate-300 leading-relaxed italic border-l-4 border-l-indigo-500">
                "{clause.originalText}"
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
