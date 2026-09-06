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
import { Shield, Sparkles, FileText, ArrowLeft, Download, MessageSquare, AlertTriangle, HelpCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
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
        <div className="flex h-screen flex-col overflow-hidden bg-slate-950">
          {/* Dashboard Header Bar */}
          <header className="flex h-14 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveDoc(null)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>

              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <Shield className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-bold text-white">LeaseLens<span className="text-indigo-400">.ai</span></span>
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
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Upload Another
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500"
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
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDashboardTab('intelligence')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    dashboardTab === 'intelligence'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  3-Pane Intelligence Explorer
                </button>

                <button
                  onClick={() => setDashboardTab('missing')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    dashboardTab === 'missing'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Missing & Ambiguity Detectors
                </button>

                <button
                  onClick={() => setDashboardTab('questions')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    dashboardTab === 'questions'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Personalized Questions Generator
                </button>

                <button
                  onClick={() => setDashboardTab('chat')}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    dashboardTab === 'chat'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Ask Your Lease Q&A
                </button>
              </div>

              <span className="text-[10px] text-slate-500 font-mono">
                {activeDoc.clauses.length} Clauses • {activeDoc.missingItems.length} Missing Items
              </span>
            </div>

            {/* Active Tab View Rendering */}
            <div className="flex-1 overflow-hidden">
              {dashboardTab === 'intelligence' && (
                <div className="grid h-full gap-4 md:grid-cols-12">
                  {/* LEFT PANE (Col 3): Navigation & Clause Index */}
                  <div className="h-full md:col-span-3">
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
                  <div className="h-full md:col-span-5">
                    <DocumentViewer
                      document={activeDoc}
                      selectedClause={selectedClause}
                      onSelectClause={setSelectedClause}
                      activePage={activePage}
                    />
                  </div>

                  {/* RIGHT PANE (Col 4): AI Legal Intelligence Panel */}
                  <div className="h-full md:col-span-4">
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
