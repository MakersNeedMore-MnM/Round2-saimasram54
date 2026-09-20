'use client';

import React from 'react';
import { Clause } from '@/types/lease';
import { Search, FileText } from 'lucide-react';

interface NavPaneProps {
  clauses: Clause[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedClauseId: string | null;
  onSelectClause: (clause: Clause) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalPages: number;
  activePage: number;
  onSelectPage: (page: number) => void;
}

export const NavPane: React.FC<NavPaneProps> = ({
  clauses,
  selectedCategory,
  onSelectCategory,
  selectedClauseId,
  onSelectClause,
  searchQuery,
  onSearchChange,
  totalPages,
  activePage,
  onSelectPage,
}) => {
  const categories = ['All', 'High Risk', 'Financial', 'Termination', 'Property', 'Restrictions', 'Liability', 'Legal'];

  const filteredClauses = clauses.filter((c) => {
    // Category filter
    if (selectedCategory === 'High Risk') {
      if (c.riskLevel !== 'HIGH' && c.riskLevel !== 'CRITICAL') return false;
    } else if (selectedCategory !== 'All') {
      if (c.category !== selectedCategory) return false;
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.section.toLowerCase().includes(q) ||
        c.originalText.toLowerCase().includes(q) ||
        c.plainExplanation.toLowerCase().includes(q)
      );
    }

    return true;
  });

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
    <div className="flex h-full min-h-0 flex-col rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3.5 shadow-xl font-sans">
      {/* Page Navigator Header */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2.5 mb-3 shrink-0">
        <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-neutral-400">
          <FileText className="h-3.5 w-3.5 text-white" />
          <span>Clause Index</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onSelectPage(pageNum)}
              className={`h-5 min-w-[20px] rounded-[3px] font-mono text-[10px] font-medium transition cursor-pointer ${
                activePage === pageNum
                  ? 'bg-white text-black font-semibold'
                  : 'bg-black border border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              P{pageNum}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3 shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter clauses by text..."
          className="w-full rounded-[4px] border border-[#1f1f1f] bg-black pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1 border-b border-[#1f1f1f] pb-2.5 mb-3 shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`rounded-[3px] border px-2 py-0.5 font-mono text-[10px] font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-black border-white'
                : 'bg-black border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clauses Explorer List */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredClauses.length === 0 ? (
          <div className="p-6 text-center font-mono text-xs text-neutral-500">
            No clauses found matching current filter.
          </div>
        ) : (
          filteredClauses.map((clause) => {
            const isSelected = selectedClauseId === clause.id;

            return (
              <div
                key={clause.id}
                onClick={() => onSelectClause(clause)}
                className={`cursor-pointer rounded-[4px] border p-2.5 transition ${
                  isSelected
                    ? 'border-white bg-[#171717] ring-1 ring-white'
                    : 'border-[#1f1f1f] bg-black hover:border-neutral-700 hover:bg-[#0f0f0f]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                    {clause.section} • Page {clause.page}
                  </span>
                  <span className={`rounded-[3px] border px-1.5 py-0.2 font-mono text-[9px] uppercase font-medium ${getRiskBadgeStyle(clause.riskLevel)}`}>
                    {clause.riskLevel}
                  </span>
                </div>

                <h4 className="mt-1 text-xs font-semibold text-white line-clamp-1">{clause.title}</h4>
                <p className="mt-1 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{clause.plainExplanation}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
