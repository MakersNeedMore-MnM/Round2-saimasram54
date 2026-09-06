'use client';

import React from 'react';
import { LeaseDocument, ClauseCategory } from '@/types/lease';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, DollarSign, CalendarX, Shield, Wrench, Ban, FileQuestion } from 'lucide-react';

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
  const getOverallRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-lg space-y-4">
      {/* Top Overview Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">{document.metadata.documentTitle || document.fileName}</h1>
            <span className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${getOverallRiskBadge(document.overallRisk)}`}>
              Overall Risk: {document.overallRisk}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Landlord: <strong className="text-slate-200">{document.metadata.landlord}</strong> • Tenant: <strong className="text-slate-200">{document.metadata.tenant}</strong> • Rent: <strong className="text-indigo-300">{document.metadata.rentAmount}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-center">
            <span className="block text-slate-400 text-[10px]">Total Clauses</span>
            <span className="text-base font-bold text-white">{document.clauses.length}</span>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 px-3.5 py-2 text-center">
            <span className="block text-rose-400 text-[10px]">Elevated Risks</span>
            <span className="text-base font-bold text-rose-300">
              {document.clauses.filter(c => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL').length}
            </span>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-3.5 py-2 text-center">
            <span className="block text-amber-400 text-[10px]">Missing Items</span>
            <span className="text-base font-bold text-amber-300">{document.missingItems.length}</span>
          </div>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 px-3.5 py-2 text-center">
            <span className="block text-indigo-400 text-[10px]">Ambiguities</span>
            <span className="text-base font-bold text-indigo-300">{document.ambiguities.length}</span>
          </div>
        </div>
      </div>

      {/* Visual Risk Domain Cards */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Risk Domains Matrix</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {document.riskFindings.map((finding) => {
            const Icon = domainIcons[finding.category] || Info;
            const isSelected = selectedCategory === finding.category;

            const getCardStyle = (level: string) => {
              switch (level) {
                case 'CRITICAL':
                  return 'border-rose-500/50 bg-rose-950/20 text-rose-300 hover:border-rose-400';
                case 'HIGH':
                  return 'border-rose-500/40 bg-rose-950/10 text-rose-400 hover:border-rose-400';
                case 'MEDIUM':
                  return 'border-amber-500/40 bg-amber-950/10 text-amber-300 hover:border-amber-400';
                default:
                  return 'border-emerald-500/30 bg-emerald-950/10 text-emerald-300 hover:border-emerald-400';
              }
            };

            return (
              <button
                key={finding.category}
                onClick={() => onSelectCategory(isSelected ? 'All' : finding.category)}
                className={`flex flex-col justify-between rounded-xl border p-3 text-left transition duration-150 cursor-pointer ${getCardStyle(finding.level)} ${
                  isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">{finding.category}</span>
                  <Icon className="h-4 w-4 opacity-80" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider">{finding.level}</span>
                  <span className="text-[10px] opacity-75 font-mono">{finding.score}/100</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
