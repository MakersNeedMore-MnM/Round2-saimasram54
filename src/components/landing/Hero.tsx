'use client';

import React from 'react';
import { ArrowRight, FileText, Sparkles, Check, BookOpen, Scale } from 'lucide-react';

interface HeroProps {
  onOpenUpload: () => void;
  onRunDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenUpload, onRunDemo }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#1f1f1f]">
      {/* Structural background grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Hero Text */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1f1f1f] bg-[#0a0a0a] px-3.5 py-1 font-mono text-xs text-neutral-400 tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5 text-neutral-300" />
              EVIDENCE-GROUNDED LEGAL INTELLIGENCE
            </div>

            <h1 className="text-4xl font-bold tracking-[ -0.04em] text-white sm:text-5xl lg:text-6xl leading-[1.08]">
              Understand Your Lease <br />
              <span className="text-neutral-400">
                Before You Sign.
              </span>
            </h1>

            <p className="text-sm text-neutral-400 sm:text-base max-w-2xl leading-relaxed">
              LeaseLens AI transforms complex lease agreements into evidence-grounded legal intelligence reports—helping you understand obligations, identify potential risks, and retrieve relevant statutory context.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                <FileText className="h-4 w-4" />
                Analyze My Lease
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onRunDemo}
                className="inline-flex items-center justify-center gap-2.5 rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] px-6 py-3 text-sm font-medium text-neutral-300 transition hover:border-neutral-700 hover:bg-[#171717] hover:text-white"
              >
                <Sparkles className="h-4 w-4 text-neutral-400" />
                Try Demo Lease (Instant)
              </button>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-neutral-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Page & Clause Citations</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Statutory Legal RAG</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Likelihood × Impact Model</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-4 shadow-2xl">
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                  <span className="ml-2 font-mono text-[11px] text-neutral-400">Standard_Residential_Lease_2026.pdf</span>
                </div>
                <span className="rounded-[4px] border border-rose-900/50 bg-rose-950/40 px-2 py-0.5 font-mono text-[10px] font-medium text-rose-400 uppercase">
                  OVERALL: CRITICAL RISK
                </span>
              </div>

              {/* Sample Clause Card Mockup */}
              <div className="space-y-3">
                <div className="rounded-[4px] border border-rose-900/40 bg-rose-950/20 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-rose-400">Page 3 • Clause 7</span>
                    <span className="rounded-[4px] bg-rose-950 border border-rose-900/50 px-2 py-0.5 font-mono text-[10px] text-rose-300">HIGH RISK (Score 20/25)</span>
                  </div>
                  <h4 className="mt-1 text-xs font-semibold text-white">Early Termination & Penalty</h4>
                  <p className="mt-1 text-xs text-neutral-400 italic line-clamp-2">
                    "Tenant must provide 120 days written notice, forfeit the $11,400 deposit, and pay 3 months additional rent penalty..."
                  </p>
                </div>

                {/* Evidence Split Mockup */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-2.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 uppercase">
                      <BookOpen className="h-3 w-3 text-white" />
                      CONTRACT EVIDENCE
                    </div>
                    <p className="mt-1 text-[10px] text-neutral-400">Page 3, Section 7: Mandatory $22,800 total forfeiture penalty.</p>
                  </div>

                  <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-2.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 uppercase">
                      <Scale className="h-3 w-3 text-white" />
                      LEGAL EVIDENCE
                    </div>
                    <p className="mt-1 text-[10px] text-neutral-400">Cal. Civ. Code § 1671: Unenforceable unconscionable penalty.</p>
                  </div>
                </div>

                {/* Ask Your Lease Prompt Bar */}
                <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-3 flex items-center justify-between text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Ask Your Lease: <em>"Can I terminate early?"</em></span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400 border border-[#1f1f1f] bg-[#0a0a0a] px-2 py-0.5 rounded-[4px] uppercase">Grounded Q&A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
