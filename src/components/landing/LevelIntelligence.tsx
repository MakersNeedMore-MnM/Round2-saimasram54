'use client';

import React from 'react';
import { FileSearch, ShieldAlert, Scale, ArrowRight, CheckCircle } from 'lucide-react';

export const LevelIntelligence: React.FC = () => {
  return (
    <section id="intelligence" className="py-16 bg-slate-950/60 border-y border-slate-800/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            Hackathon Priority Core Feature
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Three Levels of Legal Intelligence
          </h2>
          <p className="text-sm text-slate-400 sm:text-base">
            LeaseLens AI goes far beyond generic chat PDF tools by organizing intelligence into three structured, evidence-grounded layers.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* LEVEL 1 */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition hover:border-indigo-500/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-5">
              <FileSearch className="h-6 w-6" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">LEVEL 1</span>
              <span className="text-xs font-medium text-slate-400">Document Understanding</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-white">"What's inside this lease?"</h3>
            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              Extracts key metadata, payment dates, effective terms, landlord/tenant obligations, and categorizes every clause into Financial, Termination, Maintenance, Restrictions, and Legal domains.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                <span>Preserves page & section numbers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                <span>Extracts landlord & tenant details</span>
              </li>
            </ul>
          </div>

          {/* LEVEL 2 */}
          <div className="relative rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6 shadow-xl transition hover:border-amber-500/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-5">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">LEVEL 2</span>
              <span className="text-xs font-medium text-slate-400">Risk Intelligence</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-white">"What should I pay attention to?"</h3>
            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              Evaluates clauses against a transparent <strong>Likelihood × Impact</strong> risk model. Highlights critical penalties, missing terms, vague wording, and ambiguous liabilities.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-amber-400" />
                <span>LOW, MEDIUM, HIGH, CRITICAL badges</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-amber-400" />
                <span>Missing info & ambiguity detector</span>
              </li>
            </ul>
          </div>

          {/* LEVEL 3 */}
          <div className="relative rounded-2xl border border-violet-500/30 bg-slate-900/80 p-6 shadow-xl transition hover:border-violet-500/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 mb-5">
              <Scale className="h-6 w-6" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-400 tracking-wider uppercase">LEVEL 3</span>
              <span className="text-xs font-medium text-slate-400">Legal Context</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-white">"How does this relate to statutory law?"</h3>
            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              Cross-references contract clauses with official statutory legislation (California Civil Code, NY Real Property Law, UK Housing Acts, Model Tenancy Act) to surface legal protections.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-violet-400" />
                <span>CONTRACT vs. LEGAL Evidence Split</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-violet-400" />
                <span>State & Country Jurisdiction selector</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
