'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CoolChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const currentInput = input;
    setInput('');
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ text: currentInput }),
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Expanded Modern Container */}
      <div className="w-full max-w-2xl h-[750px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border border-zinc-200">

        {/* Fancy Header */}
        <div className="px-8 py-6 bg-white border-b border-zinc-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200">💬</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl tracking-tight text-zinc-900">COOLCHAT</h1>
                <span className="animate-pulse text-[10px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                  FREE
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-0.5">Community Server</p>
            </div>
          </div>
          <Link href="/dashboard" className="group flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors">
            EXIT <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa]">
          {error && (
            <div className="text-red-600 text-xs font-bold text-center p-4 bg-red-50 rounded-2xl border border-red-100">
              Connection Error: {error}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-tighter">{msg.username}</span>
                <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
                <span className="text-[10px] text-zinc-300">Active</span>
              </div>
              <div className="bg-white border border-zinc-200/60 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm text-[15px] text-zinc-700 leading-relaxed max-w-[90%]">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Improved Input Form */}
        <div className="p-6 bg-white border-t border-zinc-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the community..."
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl text-[15px] outline-none transition-all pr-28"
            />
            {/* Fix: Darker indigo background and bold text for maximum visibility */}
            <button
              type="submit"
              className="absolute right-3 bg-zinc-900 text-white h-12 px-6 rounded-xl font-black text-xs hover:bg-black transition-all active:scale-95 shadow-lg shadow-zinc-200"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}