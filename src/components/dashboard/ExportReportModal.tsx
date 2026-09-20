'use client';

import React, { useRef } from 'react';
import { LeaseDocument } from '@/types/lease';
import { X, Printer, Shield } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f1f1f] p-4 bg-black">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-white text-black font-mono text-xs font-bold">
              L
            </div>
            <h3 className="text-xs font-semibold text-white">Export Executive Legal Intelligence Report</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-mono text-xs font-medium text-black hover:bg-neutral-200 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-[4px] p-1.5 text-neutral-400 hover:bg-[#171717] hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-black text-white text-xs custom-scrollbar">
          {/* Document Title Header */}
          <div className="border-b border-[#1f1f1f] pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white tracking-tight">LeaseLens AI — Executive Intelligence Report</span>
              <span className="rounded-[4px] border border-rose-900/50 bg-rose-950/40 px-3 py-1 font-mono text-xs text-rose-400 uppercase">
                OVERALL RISK: {document.overallRisk} ({document.overallRiskScore}/100)
              </span>
            </div>
            <p className="font-mono text-xs text-neutral-400">Generated on {new Date(document.analyzedAt).toLocaleDateString()} for {document.metadata.documentTitle}</p>
          </div>

          {/* Metadata Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-4">
            <div>
              <span className="block font-mono text-[9px] text-neutral-500 uppercase">Landlord</span>
              <span className="font-semibold text-white">{document.metadata.landlord}</span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-neutral-500 uppercase">Tenant</span>
              <span className="font-semibold text-white">{document.metadata.tenant}</span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-neutral-500 uppercase">Property</span>
              <span className="font-semibold text-white">{document.metadata.propertyAddress}</span>
            </div>
            <div>
              <span className="block font-mono text-[9px] text-neutral-500 uppercase">Jurisdiction</span>
              <span className="font-semibold text-white">{document.jurisdiction.state}, {document.jurisdiction.country}</span>
            </div>
          </div>

          {/* Key Risk Summary */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider border-b border-[#1f1f1f] pb-2">Executive Risk Findings</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {document.riskFindings.map((finding) => (
                <div key={finding.category} className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{finding.category} Risk</span>
                    <span className="font-mono text-[10px] uppercase font-bold text-rose-400">{finding.level}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{finding.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Clause Breakdown */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider border-b border-[#1f1f1f] pb-2">Extracted Clauses & Evidence Matrix</h4>
            <div className="space-y-3">
              {document.clauses.map((clause) => (
                <div key={clause.id} className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">{clause.title} ({clause.section})</span>
                    <span className="font-mono text-[10px] text-neutral-400 uppercase">Page {clause.page} • {clause.riskLevel} RISK</span>
                  </div>

                  <p className="font-mono text-neutral-300 italic text-[11px]">"{clause.originalText}"</p>
                  <p className="text-neutral-200"><strong>Plain Explanation:</strong> {clause.plainExplanation}</p>

                  {clause.legalEvidence && (
                    <div className="rounded-[4px] border border-[#1f1f1f] bg-black p-2 font-mono text-[10px] text-neutral-400">
                      <strong>Statutory Legal Citation:</strong> {clause.legalEvidence.sourceName} ({clause.legalEvidence.statuteCitation})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="border-t border-[#1f1f1f] pt-4 font-mono text-[10px] text-neutral-500 uppercase">
            This document was generated by LeaseLens AI for informational decision support only. It does not constitute formal legal advice.
          </div>
        </div>
      </div>
    </div>
  );
};
