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

  const getBubbleStyle = (username) => {
    const name = username?.toLowerCase();
    if (name === 'dev') return 'bg-indigo-50 border-indigo-100 text-indigo-900';
    if (name === 'rio') return 'bg-emerald-50 border-emerald-100 text-emerald-900';
    return 'bg-white border-zinc-200 text-zinc-700';
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center p-4">
      {/* Constraints: Max-width 'lg' (approx 512px) and fixed height */}
      <div className="w-full max-w-lg h-[700px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-zinc-100">

        {/* Header: More compact */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-zinc-50 bg-white/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base tracking-tight text-black">COOLCHAT</h1>
            <span className="animate-pulse text-[8px] font-black tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
              FREE
            </span>
          </div>
          <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors px-3 py-1.5 bg-zinc-50 rounded-full">
            EXIT
          </Link>
        </div>

        {/* Messages: Tighter spacing */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col animate-in fade-in slide-in-from-bottom-1 duration-400">
              <div className="flex items-center gap-2 mb-1 ml-1">
                <span className={`text-[9px] font-black uppercase tracking-wider ${msg.username?.toLowerCase() === 'dev' ? 'text-indigo-600' :
                  msg.username?.toLowerCase() === 'rio' ? 'text-emerald-600' : 'text-zinc-400'
                  }`}>
                  {msg.username}
                </span>
                {(msg.username?.toLowerCase() === 'dev' || msg.username?.toLowerCase() === 'rio') && (
                  <span className="text-[7px] bg-zinc-100 text-zinc-500 px-1 rounded font-bold uppercase">Admin</span>
                )}
              </div>

              <div className={`inline-block max-w-[80%] border px-3.5 py-2 rounded-2xl rounded-tl-none shadow-sm ${getBubbleStyle(msg.username)}`}>
                <p className="text-[13.5px] leading-snug font-medium">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input: Integrated and slimmer */}
        <div className="px-6 pb-6 pt-2">
          <form onSubmit={handleSend} className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-300 focus-within:bg-white transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message..."
              className="w-full bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="mr-2 bg-black text-white h-9 px-5 rounded-lg font-bold text-[10px] hover:bg-zinc-800 transition-all active:scale-95"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}