'use client';

import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-white">LeaseLens AI</span>
          </div>

          <p className="text-slate-400 text-center sm:text-right">
            Track 01 — AI, ML & Emerging Tech (PS 03 Generative AI for Productivity & PS 05 Prediction & Decision Support)
          </p>
        </div>

        {/* Mandatory Disclaimer Requirement */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3 text-slate-300">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">Legal Disclaimer</p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              This tool provides AI-assisted document analysis for informational purposes only. It is not legal advice and does not establish an attorney-client relationship. Laws and their application vary by jurisdiction and circumstances. Consult a qualified legal professional for important legal decisions.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-4 text-center text-slate-500 text-[11px]">
          © {new Date().getFullYear()} LeaseLens AI Platform. Hackathon Production MVP.
        </div>
      </div>
    </footer>
  );
};
