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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50 flex items-center justify-center p-4">
      {/* Main Glass Container */}
      <div className="w-full max-w-md h-[650px] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white">

        {/* Modern Header */}
        <div className="px-6 py-5 bg-white/50 border-b border-zinc-100 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-xl tracking-tight text-zinc-900">COOLCHAT</h1>
              <span className="animate-pulse text-[10px] font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                FREE
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-0.5">Global Room</p>
          </div>
          <Link href="/dashboard" className="h-10 w-10 flex items-center justify-center bg-zinc-100 rounded-full hover:bg-zinc-200 transition-all active:scale-95">
            <span className="text-zinc-600 text-lg">✕</span>
          </Link>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && <div className="text-red-500 text-xs text-center p-3 bg-red-50 rounded-2xl border border-red-100">{error}</div>}

          {messages.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-full opacity-20 italic text-zinc-500">
              <span className="text-4xl mb-2">💬</span>
              <p>No messages yet...</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="group flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 ml-1 mb-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{msg.username}</span>
                <span className="text-[9px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">Just now</span>
              </div>
              <div className="bg-white border border-zinc-100 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-zinc-700 leading-relaxed max-w-[85%]">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 border-t border-zinc-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message..."
              className="w-full bg-zinc-100/50 border border-transparent focus:border-indigo-500/20 focus:bg-white px-5 py-4 rounded-[1.5rem] text-sm outline-none transition-all pr-16 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 bg-indigo-600 text-white h-10 px-4 rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-200"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}