'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { LevelIntelligence } from '@/components/landing/LevelIntelligence';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Footer } from '@/components/landing/Footer';
import { UploadModal } from '@/components/upload/UploadModal';
import { ExecutiveSummaryBar } from '@/components/dashboard/ExecutiveSummaryBar';
import { JurisdictionSelector } from '@/components/dashboard/JurisdictionSelector';
import { NavPane } from '@/components/dashboard/NavPane';
import { DocumentViewer } from '@/components/dashboard/DocumentViewer';
import { IntelligencePanel } from '@/components/dashboard/IntelligencePanel';
import { MissingAndAmbiguityView } from '@/components/dashboard/MissingAndAmbiguityView';
import { QuestionsGeneratorView } from '@/components/dashboard/QuestionsGeneratorView';
import { AskYourLeaseChat } from '@/components/dashboard/AskYourLeaseChat';
import { ExportReportModal } from '@/components/dashboard/ExportReportModal';
import { LeaseDocument, Clause, Jurisdiction } from '@/types/lease';
import { SAMPLE_LEASE_ANALYSIS } from '@/lib/document/sample-lease';
import { Shield, ArrowLeft, Download, MessageSquare, AlertTriangle, HelpCircle, Layers } from 'lucide-react';

export default function Home() {
  const [activeDoc, setActiveDoc] = useState<LeaseDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Active view tab in dashboard
  const [dashboardTab, setDashboardTab] = useState<'intelligence' | 'missing' | 'questions' | 'chat'>('intelligence');

  // Filter & Selected Clause state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState(1);

  // Chat query state
  const [chatInitialQuery, setChatInitialQuery] = useState<string>('');

  const handleRunDemo = () => {
    setActiveDoc(SAMPLE_LEASE_ANALYSIS);
    setSelectedClause(SAMPLE_LEASE_ANALYSIS.clauses[0] || null);
  };

  const handleAnalysisComplete = (document: LeaseDocument) => {
    setActiveDoc(document);
    setSelectedClause(document.clauses[0] || null);
  };

  const handleJurisdictionChange = (updated: Jurisdiction) => {
    if (activeDoc) {
      setActiveDoc({
        ...activeDoc,
        jurisdiction: updated,
      });
    }
  };

  const handleAskInChat = (q: string) => {
    setChatInitialQuery(q);
    setDashboardTab('chat');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {!activeDoc ? (
        /* LANDING PAGE VIEW */
        <div className="flex flex-col min-h-screen">
          <Navbar onOpenUpload={() => setIsUploadOpen(true)} onRunDemo={handleRunDemo} />
          <main className="flex-1">
            <Hero onOpenUpload={() => setIsUploadOpen(true)} onRunDemo={handleRunDemo} />
            <LevelIntelligence />
            <HowItWorks />
          </main>
          <Footer />
        </div>
      ) : (
        /* FULL 3-PANE INTERACTIVE DASHBOARD VIEW */
        <div className="flex h-screen flex-col overflow-hidden bg-black">
          {/* Dashboard Header Bar */}
          <header className="flex h-14 items-center justify-between border-b border-[#1f1f1f] bg-black/90 px-4 sm:px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveDoc(null)}
                className="flex items-center gap-1.5 rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] px-2.5 py-1 text-xs font-medium text-neutral-300 hover:bg-[#171717] hover:border-neutral-700 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>

              <div className="flex items-center gap-2 border-l border-[#1f1f1f] pl-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-white text-black font-mono text-xs font-bold">
                  L
                </div>
                <span className="text-sm font-semibold tracking-tight text-white">LeaseLens<span className="text-neutral-400 font-mono text-xs">.ai</span></span>
              </div>
            </div>

            {/* Middle: Jurisdiction Selector */}
            <JurisdictionSelector
              jurisdiction={activeDoc.jurisdiction}
              onChange={handleJurisdictionChange}
            />

            {/* Right: Dashboard Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-[#171717] hover:border-neutral-700 hover:text-white transition"
              >
                Upload Another
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-black hover:bg-neutral-200 transition"
              >
                <Download className="h-3.5 w-3.5" />
                Export Report
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden p-4 space-y-4">
            {/* Top Executive Summary Bar */}
            <ExecutiveSummaryBar
              document={activeDoc}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Dashboard Sub-Nav Tabs */}
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDashboardTab('intelligence')}
                  className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs font-medium transition ${
                    dashboardTab === 'intelligence'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#0a0a0a] border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  3-Pane Explorer
                </button>

                <button
                  onClick={() => setDashboardTab('missing')}
                  className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs font-medium transition ${
                    dashboardTab === 'missing'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#0a0a0a] border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Missing & Ambiguity
                </button>

                <button
                  onClick={() => setDashboardTab('questions')}
                  className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs font-medium transition ${
                    dashboardTab === 'questions'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#0a0a0a] border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Negotiation Questions
                </button>

                <button
                  onClick={() => setDashboardTab('chat')}
                  className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs font-medium transition ${
                    dashboardTab === 'chat'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#0a0a0a] border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Ask Your Lease
                </button>
              </div>

              <span className="text-[11px] text-neutral-500 font-mono">
                {activeDoc.clauses.length} CLAUSES • {activeDoc.missingItems.length} MISSING ITEMS
              </span>
            </div>

            {/* Active Tab View Rendering */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {dashboardTab === 'intelligence' && (
                <div className="grid h-full min-h-0 gap-4 md:grid-cols-12 overflow-hidden">
                  {/* LEFT PANE (Col 3): Navigation & Clause Index */}
                  <div className="h-full min-h-0 md:col-span-3">
                    <NavPane
                      clauses={activeDoc.clauses}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      selectedClauseId={selectedClause?.id || null}
                      onSelectClause={(c) => {
                        setSelectedClause(c);
                        setActivePage(c.page);
                      }}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      totalPages={activeDoc.totalPages}
                      activePage={activePage}
                      onSelectPage={setActivePage}
                    />
                  </div>

                  {/* CENTER PANE (Col 5): Lease Document Viewer */}
                  <div className="h-full min-h-0 md:col-span-5">
                    <DocumentViewer
                      document={activeDoc}
                      selectedClause={selectedClause}
                      onSelectClause={setSelectedClause}
                      activePage={activePage}
                    />
                  </div>

                  {/* RIGHT PANE (Col 4): AI Legal Intelligence Panel */}
                  <div className="h-full min-h-0 md:col-span-4">
                    <IntelligencePanel
                      clause={selectedClause}
                      jurisdiction={activeDoc.jurisdiction}
                      onAskQuestionInChat={handleAskInChat}
                    />
                  </div>
                </div>
              )}

              {dashboardTab === 'missing' && (
                <div className="h-full overflow-y-auto custom-scrollbar">
                  <MissingAndAmbiguityView document={activeDoc} onAskInChat={handleAskInChat} />
                </div>
              )}

              {dashboardTab === 'questions' && (
                <div className="h-full overflow-y-auto custom-scrollbar">
                  <QuestionsGeneratorView document={activeDoc} onAskInChat={handleAskInChat} />
                </div>
              )}

              {dashboardTab === 'chat' && (
                <div className="h-full">
                  <AskYourLeaseChat
                    document={activeDoc}
                    initialQuestion={chatInitialQuery}
                    onClearInitialQuestion={() => setChatInitialQuery('')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {/* Export Report Modal */}
      {activeDoc && (
        <ExportReportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          document={activeDoc}
        />
      )}
    </div>
  );
}
