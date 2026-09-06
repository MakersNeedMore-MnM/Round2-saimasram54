'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LeaseDocument, ChatMessage } from '@/types/lease';
import { MessageSquare, Send, Sparkles, Loader2, Bot, User, Scale, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface AskYourLeaseChatProps {
  document: LeaseDocument;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const AskYourLeaseChat: React.FC<AskYourLeaseChatProps> = ({
  document,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I am your **Ask Your Lease** legal assistant. Ask me anything about your uploaded lease (**${document.metadata.documentTitle || document.fileName}**). All answers are grounded strictly in your document text and statutory legal context.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    'Can my landlord increase my rent?',
    'What notice do I need to give to move out?',
    'Who pays for repairs and HVAC?',
    'Can I sublet or host guests?',
    'What happens if I terminate early?',
    'Is my security deposit refundable?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim() !== '') {
      handleSend(initialQuestion);
      if (onClearInitialQuestion) onClearInitialQuestion();
    }
  }, [initialQuestion]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text.trim(),
          documentId: document.id,
          rawText: document.rawText,
          jurisdiction: document.jurisdiction,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch grounded response');
      }

      const assistantMsg: ChatMessage = await res.json();
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('AskYourLease chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `I'm sorry, I encountered an error processing your query. Please try rephrasing your question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Ask Your Lease</h3>
            <p className="text-[10px] text-slate-400">Strictly Grounded Document & Statutory Q&A</p>
          </div>
        </div>

        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
          DOCUMENT CITATIONS ACTIVE
        </span>
      </div>

      {/* Preset Chips */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 p-3 overflow-x-auto custom-scrollbar flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Popular:</span>
        {presetQuestions.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="shrink-0 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 transition"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-slate-800 bg-slate-950/80 text-slate-200 shadow-md'
            }`}>
              {msg.role === 'user' ? (
                <p className="leading-relaxed font-medium">{msg.content}</p>
              ) : (
                <div className="space-y-3">
                  {msg.shortAnswer && (
                    <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Short Answer</p>
                      <p className="text-xs font-semibold text-white leading-relaxed">{msg.shortAnswer}</p>
                    </div>
                  )}

                  {msg.accordingToLease && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">According to Your Lease</p>
                      <p className="text-slate-300 leading-relaxed">{msg.accordingToLease}</p>
                    </div>
                  )}

                  {msg.relevantClauseRef && (
                    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-400 text-[11px]">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Relevant Clause Citation</span>
                      </div>
                      <p className="mt-1 text-slate-300 text-[11px] font-mono">{msg.relevantClauseRef}</p>
                    </div>
                  )}

                  {msg.legalContext && (
                    <div className="rounded-lg border border-violet-500/30 bg-violet-950/20 p-2.5">
                      <div className="flex items-center gap-1.5 font-bold text-violet-300 text-[11px]">
                        <Scale className="h-3.5 w-3.5 text-violet-400" />
                        <span>Statutory Legal Context</span>
                      </div>
                      <p className="mt-1 text-slate-300 text-[11px]">{msg.legalContext}</p>
                      {msg.source && <p className="mt-1 text-[10px] text-violet-400 font-mono">Source: {msg.source}</p>}
                    </div>
                  )}

                  {!msg.shortAnswer && <div className="prose prose-invert max-w-none text-xs leading-relaxed">{msg.content}</div>}

                  {msg.confidence && (
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="h-3 w-3" />
                        Confidence Rating: {msg.confidence}
                      </span>
                      <span className="text-slate-500 italic">Informational Analysis Only</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-indigo-400">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-3">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              <span>Retrieving relevant document chunks & legal statutory sources...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-slate-800 p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your lease document..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
