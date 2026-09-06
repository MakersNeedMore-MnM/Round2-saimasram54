'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, Loader2, AlertTriangle, Globe, MapPin, Building2, Eye, Cpu } from 'lucide-react';
import { Jurisdiction, LeaseDocument } from '@/types/lease';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (document: LeaseDocument) => void;
}

export type ProcessingStep = 
  | 'idle'
  | 'uploading'
  | 'validating'
  | 'extracting'
  | 'ocr'
  | 'clauses'
  | 'risk'
  | 'legal'
  | 'report'
  | 'complete'
  | 'error';

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState<ProcessingStep>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Jurisdiction selection
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('California');
  const [leaseType, setLeaseType] = useState<'Residential' | 'Commercial' | 'Retail' | 'Industrial'>('Residential');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = e.dataTransfer.files[0];
      validateAndSetFile(selected);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selected: File) => {
    setErrorMessage(null);
    const ext = selected.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setErrorMessage('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    if (selected.size > 25 * 1024 * 1024) {
      setErrorMessage('File is too large. Please upload a PDF or document smaller than 25 MB.');
      return;
    }
    setFile(selected);
  };

  const startAnalysis = async () => {
    if (!file) return;

    setStep('uploading');
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('country', country);
      formData.append('state', state);
      formData.append('leaseType', leaseType);

      // Real pipeline step transitions
      setTimeout(() => setStep('validating'), 400);
      setTimeout(() => setStep('extracting'), 900);
      setTimeout(() => setStep('ocr'), 1500);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setStep('clauses');
      setTimeout(() => setStep('risk'), 600);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to process document');
      }

      const leaseDoc: LeaseDocument = await res.json();

      setStep('report');
      setTimeout(() => {
        setStep('complete');
        onAnalysisComplete(leaseDoc);
        onClose();
      }, 500);

    } catch (err: any) {
      console.error('Upload analysis error:', err);
      setStep('error');
      setErrorMessage(err.message || 'An error occurred while analyzing the lease document.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Upload Lease Document</h3>
            <p className="text-xs text-slate-400">PDF (Text/Scanned), DOCX, or TXT (Max 25MB)</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Jurisdiction Selector */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Globe className="h-4 w-4" />
            <span>Select Lease Jurisdiction</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="United States">United States</option>
                <option value="India">India</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">State / Province</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {country === 'United States' && (
                  <>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Texas">Texas</option>
                  </>
                )}
                {country === 'India' && (
                  <>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                  </>
                )}
                {country === 'United Kingdom' && <option value="England">England</option>}
                {country === 'Canada' && <option value="Ontario">Ontario</option>}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">Lease Type</label>
              <select
                value={leaseType}
                onChange={(e: any) => setLeaseType(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Retail">Retail</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        {step === 'idle' || step === 'error' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
              dragOver ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400">
              <Upload className="h-6 w-6" />
            </div>

            {file ? (
              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold text-white">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium text-slate-200">
                  <span className="text-indigo-400 font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PDF (Text/Scanned), DOCX, or TXT format</p>
              </div>
            )}
          </div>
        ) : (
          /* Processing Pipeline View */
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
              <h4 className="text-sm font-bold text-white">Processing Document Pipeline...</h4>
            </div>

            <div className="space-y-3 pl-2 text-xs">
              <PipelineStep label="Document uploaded" currentStep={step} stepId="uploading" />
              <PipelineStep label="PDF header & signature check (%PDF-)" currentStep={step} stepId="validating" />
              <PipelineStep label="Page-aware text extraction" currentStep={step} stepId="extracting" />
              <PipelineStep label="Detecting scanned pages & Vision OCR fallback" currentStep={step} stepId="ocr" />
              <PipelineStep label="Extracting clauses & section headers" currentStep={step} stepId="clauses" />
              <PipelineStep label="Risk analysis (Likelihood × Impact model)" currentStep={step} stepId="risk" />
              <PipelineStep label="Generating legal intelligence report" currentStep={step} stepId="report" />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={startAnalysis}
            disabled={!file || (step !== 'idle' && step !== 'error')}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {step !== 'idle' && step !== 'error' ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Processing Pipeline...
              </>
            ) : (
              'Start AI Analysis'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PipelineStep: React.FC<{ label: string; currentStep: ProcessingStep; stepId: ProcessingStep }> = ({
  label,
  currentStep,
  stepId,
}) => {
  const stepsOrder: ProcessingStep[] = ['uploading', 'validating', 'extracting', 'ocr', 'clauses', 'risk', 'report', 'complete'];
  const currentIndex = stepsOrder.indexOf(currentStep);
  const targetIndex = stepsOrder.indexOf(stepId);

  const isCompleted = currentIndex > targetIndex || currentStep === 'complete';
  const isCurrent = currentIndex === targetIndex;

  return (
    <div className="flex items-center gap-3">
      {isCompleted ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      ) : isCurrent ? (
        <Loader2 className="h-4 w-4 animate-spin text-indigo-400 shrink-0" />
      ) : (
        <div className="h-4 w-4 rounded-full border border-slate-700 bg-slate-900 shrink-0" />
      )}
      <span className={isCompleted ? 'text-slate-200 font-medium' : isCurrent ? 'text-indigo-300 font-semibold' : 'text-slate-500'}>
        {label}
      </span>
    </div>
  );
};
