'use client';

import React, { useState } from 'react';
import { LeaseDocument } from '@/types/lease';
import { Info, DollarSign, CalendarX, Shield, Wrench, Ban, FileQuestion, ChevronDown, ChevronUp } from 'lucide-react';

interface ExecutiveSummaryBarProps {
  document: LeaseDocument;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const ExecutiveSummaryBar: React.FC<ExecutiveSummaryBarProps> = ({
  document,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getOverallRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return 'border-rose-900/50 bg-rose-950/40 text-rose-400';
      case 'MEDIUM':
      case 'MODERATE':
        return 'border-amber-900/50 bg-amber-950/40 text-amber-300';
      default:
        return 'border-emerald-900/50 bg-emerald-950/40 text-emerald-300';
    }
  };

  const domainIcons: Record<string, any> = {
    Financial: DollarSign,
    Termination: CalendarX,
    Liability: Shield,
    Property: Wrench,
    Restrictions: Ban,
    Legal: FileQuestion,
  };

  return (
    <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-3.5 shadow-xl space-y-3 font-sans transition-all duration-200">
      {/* Top Overview Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">{document.metadata.documentTitle || document.fileName}</h1>
            <span className={`rounded-[4px] border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${getOverallRiskBadge(document.overallRisk)}`}>
              OVERALL RISK: {document.overallRisk}
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="inline-flex items-center gap-1 rounded-[4px] border border-[#1f1f1f] bg-black px-2 py-0.5 font-mono text-[10px] text-neutral-400 hover:text-white hover:border-neutral-700 transition cursor-pointer ml-2"
              title={isCollapsed ? 'Expand Executive Summary' : 'Collapse Executive Summary'}
            >
              <span>{isCollapsed ? 'Expand Summary' : 'Collapse'}</span>
              {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>
          </div>
          <p className="text-xs text-neutral-400">
            Landlord: <strong className="text-neutral-200">{document.metadata.landlord}</strong> • Tenant: <strong className="text-neutral-200">{document.metadata.tenant}</strong> • Rent: <strong className="text-white font-mono">{document.metadata.rentAmount}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <div className="rounded-[4px] border border-[#1f1f1f] bg-black px-2.5 py-1 text-center min-w-[80px]">
            <span className="block text-neutral-500 text-[9px] uppercase tracking-wider">Total Clauses</span>
            <span className="text-xs font-semibold text-white">{document.clauses.length}</span>
          </div>
          <div className="rounded-[4px] border border-rose-900/40 bg-rose-950/20 px-2.5 py-1 text-center min-w-[80px]">
            <span className="block text-rose-400 text-[9px] uppercase tracking-wider">Elevated Risks</span>
            <span className="text-xs font-semibold text-rose-300">
              {document.clauses.filter(c => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL').length}
            </span>
          </div>
          <div className="rounded-[4px] border border-amber-900/40 bg-amber-950/20 px-2.5 py-1 text-center min-w-[80px]">
            <span className="block text-amber-400 text-[9px] uppercase tracking-wider">Missing Items</span>
            <span className="text-xs font-semibold text-amber-300">{document.missingItems.length}</span>
          </div>
          <div className="rounded-[4px] border border-[#1f1f1f] bg-black px-2.5 py-1 text-center min-w-[80px]">
            <span className="block text-neutral-400 text-[9px] uppercase tracking-wider">Ambiguities</span>
            <span className="text-xs font-semibold text-white">{document.ambiguities.length}</span>
          </div>
        </div>
      </div>

      {/* Visual Risk Domain Cards (Collapsible) */}
      {!isCollapsed && (
        <div className="pt-2 border-t border-[#1f1f1f]">
          <h4 className="font-mono text-[10px] font-medium text-neutral-500 mb-2 uppercase tracking-widest">Risk Domains Matrix</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {document.riskFindings.map((finding) => {
              const Icon = domainIcons[finding.category] || Info;
              const isSelected = selectedCategory === finding.category;

              const getCardStyle = (level: string) => {
                switch (level) {
                  case 'CRITICAL':
                  case 'HIGH':
                    return 'border-rose-900/40 bg-rose-950/20 text-rose-300 hover:border-rose-700';
                  case 'MEDIUM':
                    return 'border-amber-900/40 bg-amber-950/20 text-amber-300 hover:border-amber-700';
                  default:
                    return 'border-[#1f1f1f] bg-black text-neutral-300 hover:border-neutral-700';
                }
              };

              return (
                <button
                  key={finding.category}
                  onClick={() => onSelectCategory(isSelected ? 'All' : finding.category)}
                  className={`flex flex-col justify-between rounded-[4px] border p-2 text-left transition cursor-pointer ${getCardStyle(finding.level)} ${
                    isSelected ? 'ring-1 ring-white border-white bg-[#171717]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-semibold">{finding.category}</span>
                    <Icon className="h-3.5 w-3.5 opacity-70" />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider">{finding.level}</span>
                    <span className="font-mono text-[9px] opacity-75">{finding.score}/100</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
