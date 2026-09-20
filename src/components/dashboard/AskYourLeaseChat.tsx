'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LeaseDocument, ChatMessage } from '@/types/lease';
import { Send, Sparkles, Loader2, Bot, User, Scale, BookOpen, ShieldCheck } from 'lucide-react';

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
    <div className="flex h-full flex-col rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] shadow-xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#1f1f1f] bg-black text-white">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Ask Your Lease</h3>
            <p className="font-mono text-[10px] text-neutral-400">Strictly Grounded Document & Statutory Q&A</p>
          </div>
        </div>

        <span className="font-mono text-[10px] uppercase font-medium border border-[#1f1f1f] bg-black px-2.5 py-0.5 rounded-[4px] text-neutral-300">
          DOCUMENT CITATIONS ACTIVE
        </span>
      </div>

      {/* Preset Chips */}
      <div className="border-b border-[#1f1f1f] bg-black p-2.5 overflow-x-auto custom-scrollbar flex items-center gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 shrink-0">Popular:</span>
        {presetQuestions.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="shrink-0 rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] px-2.5 py-1 font-mono text-[11px] text-neutral-300 hover:border-neutral-700 hover:bg-[#171717] hover:text-white transition"
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
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-[#1f1f1f] bg-white text-black font-bold">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}

            <div className={`max-w-2xl rounded-lg p-3.5 space-y-2.5 ${
              msg.role === 'user'
                ? 'bg-white text-black font-medium shadow-md'
                : 'border border-[#1f1f1f] bg-black text-neutral-200 shadow-md'
            }`}>
              {msg.role === 'user' ? (
                <p className="leading-relaxed font-medium text-xs text-black">{msg.content}</p>
              ) : (
                <div className="space-y-2.5">
                  {msg.shortAnswer && (
                    <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2.5">
                      <p className="font-mono text-[9px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Short Answer</p>
                      <p className="text-xs font-semibold text-white leading-relaxed">{msg.shortAnswer}</p>
                    </div>
                  )}

                  {msg.accordingToLease && (
                    <div>
                      <p className="font-mono text-[9px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">According to Your Lease</p>
                      <p className="text-neutral-300 leading-relaxed text-xs">{msg.accordingToLease}</p>
                    </div>
                  )}

                  {msg.relevantClauseRef && (
                    <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-white uppercase">
                        <BookOpen className="h-3 w-3" />
                        <span>Relevant Clause Citation</span>
                      </div>
                      <p className="mt-1 text-neutral-300 text-[11px] font-mono">{msg.relevantClauseRef}</p>
                    </div>
                  )}

                  {msg.legalContext && (
                    <div className="rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] p-2 font-sans">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-white uppercase">
                        <Scale className="h-3 w-3" />
                        <span>Statutory Legal Context</span>
                      </div>
                      <p className="mt-1 text-neutral-300 text-[11px]">{msg.legalContext}</p>
                      {msg.source && <p className="mt-1 font-mono text-[10px] text-neutral-400">Source: {msg.source}</p>}
                    </div>
                  )}

                  {!msg.shortAnswer && <div className="prose prose-invert max-w-none text-xs leading-relaxed text-neutral-300">{msg.content}</div>}

                  {msg.confidence && (
                    <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-2 font-mono text-[10px]">
                      <span className="flex items-center gap-1 text-neutral-300 font-medium">
                        <ShieldCheck className="h-3 w-3 text-white" />
                        Confidence Rating: {msg.confidence}
                      </span>
                      <span className="text-neutral-500 italic">Informational Analysis Only</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] text-white font-mono text-xs">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-neutral-400">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-[#1f1f1f] bg-white text-black font-bold">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[#1f1f1f] bg-black p-2.5 font-mono text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
              <span>Retrieving document chunks & legal statutory sources...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-[#1f1f1f] p-3.5 bg-black">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your lease document..."
            className="flex-1 rounded-[4px] border border-[#1f1f1f] bg-[#0a0a0a] px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:bg-neutral-200 disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
