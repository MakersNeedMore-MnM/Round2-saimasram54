'use client';

import React, { useRef } from 'react';
import { LeaseDocument } from '@/types/lease';
import { X, Download, Printer, Shield, CheckCircle2, Scale, BookOpen } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LeaseDocument;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-950">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Export Executive Legal Intelligence Report</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950 text-slate-100 text-xs custom-scrollbar">
          {/* Document Title Header */}
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">LeaseLens AI — Executive Intelligence Report</span>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-extrabold text-rose-300">
                OVERALL RISK: {document.overallRisk} ({document.overallRiskScore}/100)
              </span>
            </div>
            <p className="text-slate-400">Generated on {new Date(document.analyzedAt).toLocaleDateString()} for {document.metadata.documentTitle}</p>
          </div>

          {/* Metadata Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Landlord</span>
              <span className="font-semibold text-white">{document.metadata.landlord}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Tenant</span>
              <span className="font-semibold text-white">{document.metadata.tenant}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Property</span>
              <span className="font-semibold text-white">{document.metadata.propertyAddress}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Jurisdiction</span>
              <span className="font-semibold text-indigo-400">{document.jurisdiction.state}, {document.jurisdiction.country}</span>
            </div>
          </div>

          {/* Key Risk Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Executive Risk Findings</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {document.riskFindings.map((finding) => (
                <div key={finding.category} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{finding.category} Risk</span>
                    <span className="font-mono text-[10px] font-bold text-rose-400">{finding.level}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{finding.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Clause Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Extracted Clauses & Evidence Matrix</h4>
            <div className="space-y-3">
              {document.clauses.map((clause) => (
                <div key={clause.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{clause.title} ({clause.section})</span>
                    <span className="font-mono text-[10px] text-indigo-400">Page {clause.page} • {clause.riskLevel} RISK</span>
                  </div>

                  <p className="text-slate-300 italic text-[11px]">"{clause.originalText}"</p>
                  <p className="text-slate-200"><strong>Plain Explanation:</strong> {clause.plainExplanation}</p>

                  {clause.legalEvidence && (
                    <div className="rounded border border-violet-500/30 bg-violet-950/20 p-2 text-[10px] text-violet-300">
                      <strong>Statutory Legal Citation:</strong> {clause.legalEvidence.sourceName} ({clause.legalEvidence.statuteCitation})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-500">
            This document was generated by LeaseLens AI for informational decision support only. It does not constitute formal legal advice.
          </div>
        </div>
      </div>
    </div>
  );
};
