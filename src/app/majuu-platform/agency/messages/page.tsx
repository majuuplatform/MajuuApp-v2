'use client';

import React from 'react';
import { MessageSquare, Send, User } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-12rem)] rounded-3xl border border-slate-900 bg-slate-900/10 overflow-hidden">
      {/* Sidebar: Chats List */}
      <div className="w-80 border-r border-slate-900 bg-slate-950/40 flex flex-col">
        <div className="p-4 border-b border-slate-900 bg-slate-900/20">
          <h3 className="text-sm font-semibold text-white">Active Chats</h3>
          <p className="text-xs text-slate-500 mt-0.5">Communicate directly with applicants.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <button className="w-full flex gap-3 p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <User className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">John Doe</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">"Here is my CV..."</p>
            </div>
          </button>
          <button className="w-full flex gap-3 p-3 rounded-2xl hover:bg-slate-900/40 text-left transition">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
              <User className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Sarah W.</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">"I have uploaded the bank..."</p>
            </div>
          </button>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-slate-950/20">
        {/* Chat header */}
        <div className="p-4 border-b border-slate-900 bg-slate-900/20 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">John Doe</h4>
            <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
            </p>
          </div>
        </div>

        {/* Messages body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex gap-3 max-w-lg">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-900 p-4 border border-slate-800">
              <p className="text-sm text-slate-300">
                Hi, I'm working on submitting my Study Visa Poland application. Could you review my passport scan?
              </p>
              <span className="text-[9px] text-slate-500 block mt-2 text-right">10:14 AM</span>
            </div>
          </div>

          <div className="flex gap-3 max-w-lg ml-auto flex-row-reverse">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white">
              A
            </div>
            <div className="rounded-2xl rounded-tr-none bg-indigo-600 p-4 text-white">
              <p className="text-sm">
                Sure! Please upload the scanned copy of your passport in the documents tab under request details, and I will review it shortly.
              </p>
              <span className="text-[9px] text-indigo-200 block mt-2 text-right">10:16 AM</span>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-slate-900 bg-slate-900/20 flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shrink-0">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
