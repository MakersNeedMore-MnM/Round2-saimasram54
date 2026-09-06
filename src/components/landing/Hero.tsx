'use client';

import React from 'react';
import { Shield, Sparkles, FileText, ArrowRight, CheckCircle2, AlertTriangle, Scale, Lock, BookOpen } from 'lucide-react';

interface HeroProps {
  onOpenUpload: () => void;
  onRunDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenUpload, onRunDemo }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Glow background effects */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-600/20 via-violet-600/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-40 -z-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Hero Text */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Evidence-Grounded Legal Document Intelligence
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Understand Your Lease <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                Before You Sign.
              </span>
            </h1>

            <p className="text-base text-slate-300 sm:text-lg max-w-2xl leading-relaxed">
              LeaseLens AI transforms complex lease agreements into evidence-grounded legal intelligence reports—helping you understand obligations, identify potential risks, and retrieve relevant statutory context.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 transition duration-200 hover:from-indigo-500 hover:to-indigo-400 active:scale-95"
              >
                <FileText className="h-4 w-4" />
                Analyze My Lease
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onRunDemo}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 shadow-md transition duration-200 hover:border-slate-600 hover:bg-slate-800 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                Try Demo Lease (Instant)
              </button>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                <span>Page & Clause Citations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                <span>Statutory Legal RAG</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                <span>Likelihood × Impact Model</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-semibold text-slate-400">Standard_Residential_Lease_2026.pdf</span>
                </div>
                <span className="rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                  🔴 OVERALL: CRITICAL RISK
                </span>
              </div>

              {/* Sample Clause Card Mockup */}
              <div className="space-y-3">
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Page 3 • Clause 7</span>
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">🔴 HIGH RISK (Score 20/25)</span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold text-white">Early Termination & Penalty</h4>
                  <p className="mt-1 text-xs text-slate-300 italic line-clamp-2">
                    "Tenant must provide 120 days written notice, forfeit the $11,400 deposit, and pay 3 months additional rent penalty..."
                  </p>
                </div>

                {/* Evidence Split Mockup */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                      <BookOpen className="h-3 w-3" />
                      CONTRACT EVIDENCE
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">Page 3, Section 7: Mandatory $22,800 total forfeiture penalty.</p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <Scale className="h-3 w-3" />
                      LEGAL EVIDENCE
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">Cal. Civ. Code § 1671: Unenforceable unconscionable penalty.</p>
                  </div>
                </div>

                {/* Ask Your Lease Prompt Bar */}
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Ask Your Lease: <em>"Can I terminate early?"</em></span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">Grounded Q&A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
