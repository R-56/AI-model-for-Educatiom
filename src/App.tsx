/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Send, 
  Bot, 
  User, 
  Languages, 
  Search, 
  Info, 
  ChevronRight, 
  Sparkles,
  Loader2,
  RefreshCcw,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { Message, Language, LANGUAGES, TRANSLATIONS } from './types';

const SYSTEM_INSTRUCTION = `You are "Yojana Sahayak", an expert AI assistant specializing in Indian Government scholarships and welfare schemes (Central and State governments). 
Your goal is to help citizens find relevant schemes based on their eligibility (age, gender, caste, income, occupation, state).

Guidelines:
1. Provide accurate, up-to-date information about schemes like PM-Kisan, PMAY, Ayushman Bharat, Post-Matric Scholarships, etc.
2. If a user asks in a specific Indian language, respond in that language.
3. Structure your responses clearly using Markdown (bullet points, bold text).
4. Always mention that users should verify details on official government portals (like myscheme.gov.in or scholarships.gov.in).
5. If you don't know about a specific local scheme, suggest where they can find it (e.g., "Check your State's official portal").
6. Be empathetic, professional, and helpful.
7. Keep responses concise but comprehensive.
8. If the user provides eligibility details, suggest 2-3 most relevant schemes.`;

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: TRANSLATIONS.en.welcome,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      // Prepare history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await chat.sendMessage({
        message: text,
      });

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that request.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error while connecting to the service. Please try again later.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: t.welcome,
      timestamp: Date.now(),
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{t.title}</h1>
            <p className="text-xs text-slate-500 font-medium">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 text-slate-600"
              title="Change Language"
            >
              <Languages size={20} />
              <span className="text-xs font-semibold uppercase">{language}</span>
            </button>
            
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={cn(
                          "px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between",
                          language === lang.code ? "text-brand-600 font-semibold bg-brand-50" : "text-slate-700"
                        )}
                      >
                        <span>{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-400">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={clearChat}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            title="Clear Chat"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full gap-3",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm",
                message.role === 'user' ? "bg-brand-100 text-brand-700" : "bg-white border border-slate-200 text-brand-600"
              )}>
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={cn(
                "max-w-[85%] px-4 py-3 rounded-2xl shadow-sm",
                message.role === 'user' 
                  ? "bg-brand-600 text-white rounded-tr-none" 
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
              )}>
                {message.role === 'model' ? (
                  <div className="markdown-body prose prose-slate max-w-none">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                )}
                <div className={cn(
                  "text-[10px] mt-2 opacity-60",
                  message.role === 'user' ? "text-right" : "text-left"
                )}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 animate-pulse">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-brand-500" />
                <span className="text-sm text-slate-500 italic">Thinking...</span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer / Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Suggestions */}
          {messages.length === 1 && !isLoading && (
            <div className="flex flex-wrap gap-2 justify-center">
              {t.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 rounded-full text-xs text-slate-600 hover:text-brand-700 transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={12} className="text-brand-500" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <MessageSquare size={18} />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                input.trim() && !isLoading 
                  ? "bg-brand-600 text-white shadow-brand-200 hover:bg-brand-700 active:scale-95" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Send size={20} />
            </button>
          </form>
          
          <p className="text-[10px] text-center text-slate-400 px-4">
            Yojana Sahayak can make mistakes. Always verify scheme details on official government websites.
          </p>
        </div>
      </footer>
    </div>
  );
}
