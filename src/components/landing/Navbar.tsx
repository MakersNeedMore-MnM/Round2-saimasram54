'use client';

import React from 'react';
import { ArrowRight, Sparkles, FileText } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onRunDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpload, onRunDemo }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1f1f1f] bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-white text-black font-mono font-bold text-sm">
            L
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-white">LeaseLens<span className="text-neutral-500 font-mono text-xs">.ai</span></span>
            <span className="rounded-[4px] border border-[#262626] bg-[#0a0a0a] px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
              HACKATHON MVP
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-neutral-400">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#intelligence" className="transition hover:text-white">3-Level Intelligence</a>
          <a href="#how-it-works" className="transition hover:text-white">How It Works</a>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRunDemo}
            className="hidden sm:inline-flex items-center gap-2 rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] px-3.5 py-2 text-xs font-medium text-neutral-300 transition hover:border-neutral-700 hover:bg-[#171717] hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
            Try Demo Lease
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-neutral-200"
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
