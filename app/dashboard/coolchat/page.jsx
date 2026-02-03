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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 lg:p-8 selection:bg-indigo-500/30">
      {/* Ultra-Modern Dark Glass Container */}
      <div className="w-full max-w-4xl h-[850px] bg-white/5 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-white/10 relative">

        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Header: Refined & Minimal */}
        <div className="px-10 py-8 flex justify-between items-center z-10 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-black text-2xl tracking-tight text-white uppercase">CoolChat</h1>
                <span className="animate-pulse text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  FREE
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Encrypted Node</p>
            </div>
          </div>
          <Link href="/dashboard" className="h-12 px-6 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95 text-zinc-400 hover:text-white text-xs font-bold tracking-widest">
            DISCONNECT
          </Link>
        </div>

        {/* Messages Area: Fixed "Fatness" with Slimmer Bubbles */}
        <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 scrollbar-hide bg-black/10">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-3 mb-2 opacity-50">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{msg.username}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* Slimmer Message Box */}
              <div className="inline-block max-w-[70%] bg-white/5 border border-white/10 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm backdrop-blur-md">
                <p className="text-[14px] leading-relaxed text-zinc-200 font-medium">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar: Floating Style */}
        <div className="p-8 z-10">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-[#1a1a1a] border border-white/10 rounded-[1.8rem] overflow-hidden">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a secure message..."
                className="w-full bg-transparent px-8 py-6 text-sm text-white outline-none placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="mr-3 bg-white text-black h-12 px-8 rounded-2xl font-black text-[10px] tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl"
              >
                SEND
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}