'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Clause, LeaseDocument } from '@/types/lease';
import { BookOpen, ChevronUp } from 'lucide-react';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (selectedClause && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedClause]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowScrollTop(el.scrollTop > 150);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="relative flex h-full min-h-0 flex-col rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3.5 shadow-xl font-sans">
      {/* Fixed Header */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2.5 mb-3 shrink-0">
        <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-neutral-400">
          <BookOpen className="h-3.5 w-3.5 text-white" />
          <span>Document Viewer</span>
        </div>
        <span className="font-mono text-[11px] text-neutral-400">
          PAGE <strong className="text-white font-mono">{activePage}</strong> OF {document.totalPages}
        </span>
      </div>

      {/* Fluid Scrollable Document Text Body */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 custom-scrollbar text-xs leading-relaxed text-neutral-300">
        {document.clauses.map((clause) => {
          const isSelected = selectedClause?.id === clause.id;

          return (
            <div
              key={clause.id}
              ref={isSelected ? activeRef : null}
              onClick={() => onSelectClause(clause)}
              className={`group cursor-pointer rounded-[4px] border p-3.5 transition ${
                isSelected
                  ? 'border-white bg-[#171717] ring-1 ring-white'
                  : 'border-[#1f1f1f] bg-black hover:border-neutral-700 hover:bg-[#0f0f0f]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2 mb-2.5">
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-neutral-400 uppercase tracking-wider">
                    PAGE {clause.page} • {clause.section}
                  </span>
                  <span className="text-neutral-500">({clause.category})</span>
                </div>

                <span className={`rounded-[3px] border px-1.5 py-0.2 font-mono text-[9px] uppercase font-medium ${getRiskBadgeStyle(clause.riskLevel)}`}>
                  {clause.riskLevel} RISK
                </span>
              </div>

              <h3 className="text-xs font-semibold text-white mb-2">{clause.title}</h3>

              <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-3 font-mono text-[11px] text-neutral-300 leading-relaxed italic border-l-2 border-l-white">
                "{clause.originalText}"
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Scroll to top"
          className="absolute bottom-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/90 text-white shadow-lg backdrop-blur hover:bg-neutral-800 transition cursor-pointer"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
