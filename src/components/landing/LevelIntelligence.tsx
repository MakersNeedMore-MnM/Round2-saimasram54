'use client';

import React from 'react';
import { FileSearch, ShieldAlert, Scale, Check } from 'lucide-react';

export const LevelIntelligence: React.FC = () => {
  return (
    <section id="intelligence" className="py-20 bg-black border-b border-[#1f1f1f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            INTELLIGENCE ARCHITECTURE
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Three Levels of Legal Intelligence
          </h2>
          <p className="text-sm text-neutral-400 sm:text-base">
            LeaseLens AI goes far beyond generic chat PDF tools by organizing intelligence into three structured, evidence-grounded layers.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* LEVEL 1 */}
          <div className="relative rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-6 transition hover:border-neutral-700 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#1f1f1f] bg-black text-white mb-5">
                <FileSearch className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3 mb-3">
                <span className="font-mono text-xs font-semibold text-neutral-400 uppercase tracking-wider">LEVEL 1</span>
                <span className="font-mono text-[11px] text-neutral-500">Parsing</span>
              </div>
              <h3 className="text-base font-semibold text-white">"What's inside this lease?"</h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                Extracts key metadata, payment dates, effective terms, landlord/tenant obligations, and categorizes every clause into Financial, Termination, Maintenance, Restrictions, and Legal domains.
              </p>
            </div>
            <ul className="mt-6 space-y-2 text-xs font-mono text-neutral-400 border-t border-[#1f1f1f] pt-4">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Preserves page & section numbers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Extracts landlord & tenant details</span>
              </li>
            </ul>
          </div>

          {/* LEVEL 2 */}
          <div className="relative rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-6 transition hover:border-neutral-700 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#1f1f1f] bg-black text-white mb-5">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3 mb-3">
                <span className="font-mono text-xs font-semibold text-neutral-400 uppercase tracking-wider">LEVEL 2</span>
                <span className="font-mono text-[11px] text-neutral-500">Risk Engine</span>
              </div>
              <h3 className="text-base font-semibold text-white">"What should I pay attention to?"</h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                Evaluates clauses against a transparent <strong>Likelihood × Impact</strong> risk model. Highlights critical penalties, missing terms, vague wording, and ambiguous liabilities.
              </p>
            </div>
            <ul className="mt-6 space-y-2 text-xs font-mono text-neutral-400 border-t border-[#1f1f1f] pt-4">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>LOW, MEDIUM, HIGH, CRITICAL badges</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Missing info & ambiguity detector</span>
              </li>
            </ul>
          </div>

          {/* LEVEL 3 */}
          <div className="relative rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-6 transition hover:border-neutral-700 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#1f1f1f] bg-black text-white mb-5">
                <Scale className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3 mb-3">
                <span className="font-mono text-xs font-semibold text-neutral-400 uppercase tracking-wider">LEVEL 3</span>
                <span className="font-mono text-[11px] text-neutral-500">Statutory RAG</span>
              </div>
              <h3 className="text-base font-semibold text-white">"How does this relate to statutory law?"</h3>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                Cross-references contract clauses with official statutory legislation (California Civil Code, NY Real Property Law, UK Housing Acts, Model Tenancy Act) to surface legal protections.
              </p>
            </div>
            <ul className="mt-6 space-y-2 text-xs font-mono text-neutral-400 border-t border-[#1f1f1f] pt-4">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>CONTRACT vs. LEGAL Evidence Split</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>State & Country Jurisdiction selector</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
