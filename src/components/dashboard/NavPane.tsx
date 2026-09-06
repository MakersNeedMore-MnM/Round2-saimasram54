'use client';

import React from 'react';
import { Clause, ClauseCategory } from '@/types/lease';
import { Search, Filter, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

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
      {/* Page Navigator Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">Document Navigation</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onSelectPage(pageNum)}
              className={`h-6 w-6 rounded text-[11px] font-semibold transition ${
                activePage === pageNum
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              P{pageNum}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter clauses by text..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clauses Explorer List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        {filteredClauses.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No clauses found matching current filter.
          </div>
        ) : (
          filteredClauses.map((clause) => {
            const isSelected = selectedClauseId === clause.id;

            return (
              <div
                key={clause.id}
                onClick={() => onSelectClause(clause)}
                className={`cursor-pointer rounded-xl border p-3 transition duration-150 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-md ring-1 ring-indigo-500'
                    : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {clause.section} • Page {clause.page}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getRiskBadgeStyle(clause.riskLevel)}`}>
                    {clause.riskLevel}
                  </span>
                </div>

                <h4 className="mt-1 text-xs font-bold text-white line-clamp-1">{clause.title}</h4>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{clause.plainExplanation}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
