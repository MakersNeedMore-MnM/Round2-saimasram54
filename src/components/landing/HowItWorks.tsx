'use client';

import React from 'react';
import { Upload, Cpu, ShieldCheck, Search, MessageSquare } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Upload,
      title: 'Upload Lease',
      desc: 'Drag & drop your PDF, DOCX, or TXT lease agreement file.',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'AI Processing',
      desc: 'Extracts clauses, preserves page/section numbers, and parses obligations.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      title: 'Risk Engine',
      desc: 'Scores each clause using transparent Likelihood × Impact metrics.',
    },
    {
      num: '04',
      icon: Search,
      title: 'Legal RAG',
      desc: 'Cross-references statutory code and jurisdiction laws for evidence.',
    },
    {
      num: '05',
      icon: MessageSquare,
      title: 'Interactive Q&A',
      desc: 'Ask questions, review evidence, and export comprehensive PDF reports.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-[#1f1f1f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">PIPELINE</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How LeaseLens AI Works
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            A transparent 5-step processing pipeline designed for speed, evidence, and accuracy.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-5 flex flex-col justify-between hover:border-neutral-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-neutral-400">{step.num}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#1f1f1f] bg-black text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
