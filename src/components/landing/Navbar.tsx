'use client';

import React from 'react';
import { Shield, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onRunDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpload, onRunDemo }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">LeaseLens<span className="text-indigo-400">.ai</span></span>
            <span className="ml-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">HACKATHON MVP</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#intelligence" className="transition hover:text-white">3-Level Intelligence</a>
          <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRunDemo}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Try Demo Lease
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
          >
            <FileText className="h-3.5 w-3.5" />
            Analyze My Lease
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
