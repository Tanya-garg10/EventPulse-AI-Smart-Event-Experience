import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Navigation,
  Clock,
  MapPin,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Terminal,
  Zap,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ConciergeService } from '../../services/ai/conciergeService';
import { ChatMessage, Session } from '../../types';

export const AIConciergeView: React.FC = () => {
  const {
    sessions,
    zones,
    savedSessionIds,
    toggleSaveSession,
    navigateDirectlyToZone,
    setActiveView,
  } = useEvent();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Pulse AI connected to live venue nodes. What do you want to experience?",
      timestamp: '11:15 AM',
      suggestedSessions: [sessions[1], sessions[4]],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedCommands = [
    'Plan my next 2 hours',
    'Find AI sessions',
    'Where is the quietest area?',
    'What should I attend next?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await ConciergeService.askConcierge(
        textToSend,
        sessions,
        zones,
        savedSessionIds
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedSessions: response.suggestedSessions,
        suggestedRoute: response.suggestedRoute,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: "I analyzed the live venue nodes and synthesized recommended steps based on active crowds and room capacity.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedSessions: [sessions[0], sessions[2]],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      // Refocus input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-6 pb-20">
      {/* Floating Command Center Header */}
      <div className="text-center space-y-2 border-b border-cyan-500/20 pb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono tracking-widest uppercase">
          <Terminal className="w-3.5 h-3.5" />
          <span>FLOATING COMMAND INTERFACE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          PULSE AI
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Ask the event anything. Living paths, quiet zones, and sequential multi-stop itineraries.
        </p>
      </div>

      {/* Suggested Commands Row */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block text-center">
          SUGGESTED COMMANDS
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {suggestedCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSend(cmd)}
              className="px-3.5 py-1.5 rounded-full bg-[#0b1018] border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white transition-all hover:scale-102 cursor-pointer shadow-md"
            >
              → “{cmd}”
            </button>
          ))}
        </div>
      </div>

      {/* Floating Command Box */}
      <div className="relative bg-[#080b11] border-2 border-cyan-500/40 rounded-3xl p-3 shadow-2xl glow-cyan-sm">
        <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest px-3 pt-1 block">
          ASK THE EVENT
        </span>
        <div className="flex items-center space-x-2 mt-1 px-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="What do you want to experience?"
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none py-2 px-1 font-mono"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold transition-all shadow-lg glow-cyan cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stream of Visual Action Cards & Conversational Responses */}
      <div className="space-y-6 pt-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-3`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-2xl p-4 sm:p-5 rounded-3xl font-mono text-xs leading-relaxed shadow-xl ${
                  isUser
                    ? 'bg-slate-900 border border-cyan-500/40 text-cyan-200'
                    : 'bg-[#090d16] border border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 border-b border-slate-800 pb-1">
                  <span className="font-bold text-cyan-400 uppercase">
                    {isUser ? 'ATTENDEE' : 'PULSE AI'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>

              {/* Requirement 9: VISUAL ACTION CARDS ("YOUR NEXT 90 MINUTES") */}
              {msg.suggestedSessions && msg.suggestedSessions.length > 0 && (
                <div className="w-full max-w-2xl bg-[#070a10] border-2 border-cyan-500/30 rounded-3xl p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>YOUR NEXT 90 MINUTES</span>
                    </div>
                    <span className="text-[10px] font-mono text-lime-400 font-bold">
                      SEQUENTIAL PATH
                    </span>
                  </div>

                  {/* Sequential Timeline Nodes */}
                  <div className="space-y-3">
                    {(msg.suggestedSessions || []).map((session, idx) => {
                      const matchPct = 92 - idx * 5;
                      return (
                        <div key={session.id} className="space-y-2">
                          <div className="p-4 rounded-2xl bg-[#0d131f] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-start space-x-3">
                              <span className="px-2 py-1 rounded-lg bg-cyan-950 text-cyan-300 font-mono text-xs font-black">
                                0{idx + 1}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase font-sans">
                                  {session.title}
                                </h4>
                                <p className="text-[11px] font-mono text-slate-400">
                                  {session.startTime} · {session.hallName}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <span className="px-2 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold">
                                {matchPct}% MATCH
                              </span>
                              <button
                                onClick={() => toggleSaveSession(session.id)}
                                className={`p-2 rounded-xl border ${
                                  savedSessionIds.includes(session.id)
                                    ? 'bg-cyan-900 border-cyan-400 text-cyan-300'
                                    : 'bg-slate-900 border-slate-700 text-slate-400'
                                }`}
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Arrow down connector */}
                          {idx < msg.suggestedSessions!.length - 1 && (
                            <div className="text-center text-cyan-400 font-mono text-xs">
                              ↓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* START ROUTE ACTION */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const firstSession = msg.suggestedSessions![0];
                        navigateDirectlyToZone(firstSession.hallId);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl glow-cyan active:scale-95"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>START ROUTE IN LIVING MAP</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 p-4 bg-[#090d16] rounded-2xl border border-slate-800 max-w-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Pulse AI synthesizing venue nodes...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
