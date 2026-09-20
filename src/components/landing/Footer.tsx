'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1f1f1f] bg-black py-12 text-xs text-neutral-400 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-white text-black font-mono text-xs font-bold">
              L
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">LeaseLens AI</span>
          </div>

          <p className="text-neutral-500 font-mono text-[11px] text-center sm:text-right">
            TRACK 01 — GENERATIVE AI & DECISION SUPPORT
          </p>
        </div>

        {/* Mandatory Disclaimer Requirement */}
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-mono text-xs font-medium text-neutral-300 uppercase tracking-wider">Legal Disclaimer</p>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              This tool provides AI-assisted document analysis for informational purposes only. It is not legal advice and does not establish an attorney-client relationship. Laws and their application vary by jurisdiction and circumstances. Consult a qualified legal professional for important legal decisions.
            </p>
          </div>
        </div>

        <div className="border-t border-[#1f1f1f] pt-4 text-center font-mono text-neutral-500 text-[11px]">
          © {new Date().getFullYear()} LEASELENS AI PLATFORM. HACKATHON PRODUCTION MVP.
        </div>
      </div>
    </footer>
  );
};
