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

  // Helper to determine bubble color based on user
  const getBubbleStyle = (username) => {
    const name = username?.toLowerCase();
    if (name === 'dev') return 'bg-indigo-50 border-indigo-100 text-indigo-900 shadow-[0_2px_10px_rgba(79,70,229,0.1)]';
    if (name === 'rio') return 'bg-emerald-50 border-emerald-100 text-emerald-900 shadow-[0_2px_10px_rgba(16,185,129,0.1)]';
    return 'bg-white border-zinc-200 text-zinc-700 shadow-sm';
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center p-6 font-sans">
      {/* Large, Clean Container */}
      <div className="w-full max-w-3xl h-[800px] bg-white rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col border border-zinc-100">

        {/* Header: Minimal & Bright */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-zinc-50 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-xl tracking-tight text-black">COOLCHAT</h1>
            <span className="animate-pulse text-[9px] font-black tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
              FREE
            </span>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-zinc-400 hover:text-black transition-colors px-4 py-2 bg-zinc-50 rounded-full">
            EXIT
          </Link>
        </div>

        {/* Messages: Slim & Clean */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 bg-white">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-2 mb-1 ml-1">
                <span className={`text-[10px] font-black uppercase tracking-wider ${msg.username?.toLowerCase() === 'dev' ? 'text-indigo-600' :
                  msg.username?.toLowerCase() === 'rio' ? 'text-emerald-600' : 'text-zinc-400'
                  }`}>
                  {msg.username}
                </span>
                {(msg.username?.toLowerCase() === 'dev' || msg.username?.toLowerCase() === 'rio') && (
                  <span className="text-[8px] bg-zinc-100 text-zinc-500 px-1 rounded font-bold uppercase">Admin</span>
                )}
              </div>

              {/* Slimmer Message Box with dynamic colors */}
              <div className={`inline-block max-w-[65%] border px-4 py-2.5 rounded-2xl rounded-tl-none ${getBubbleStyle(msg.username)}`}>
                <p className="text-[14px] leading-snug font-medium">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar: High Contrast */}
        <div className="px-8 pb-8 pt-4">
          <form onSubmit={handleSend} className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden focus-within:border-zinc-400 focus-within:bg-white transition-all shadow-inner">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Start typing..."
              className="w-full bg-transparent px-6 py-4 text-sm text-black outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="mr-2 bg-black text-white h-10 px-6 rounded-xl font-bold text-[11px] hover:bg-zinc-800 transition-all active:scale-95"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}