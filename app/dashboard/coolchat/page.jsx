'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CoolChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages', { cache: 'no-store' });
        const data = await res.json();
        setMessages(data);
      } catch (err) { console.error(err); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput('');
    await fetch('/api/messages', { method: 'POST', body: JSON.stringify({ text }) });
  };

  return (
    // "bg-zinc-200" and "p-10" make the white chat box pop/stand out more
    <div className="min-h-screen bg-zinc-200 flex items-center justify-center p-10">

      {/* The Chat Window - High contrast shadow to make it stand out */}
      <div className="w-full max-w-[420px] h-[650px] bg-white rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col border border-zinc-300 overflow-hidden">

        {/* Header - Removed FREE badge */}
        <div className="p-5 border-b flex justify-between items-center bg-white">
          <h1 className="font-black text-sm tracking-widest text-black">COOLCHAT</h1>
          <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors">
            EXIT
          </Link>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((msg, i) => {
            const isAdmin = msg.username?.toLowerCase() === 'dev' || msg.username?.toLowerCase() === 'rio';
            return (
              <div key={i} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-1">
                <span className={`text-[9px] font-black mb-1 ml-1 uppercase tracking-tighter ${isAdmin ? 'text-indigo-600' : 'text-zinc-400'}`}>
                  {msg.username} {isAdmin && '• ADMIN'}
                </span>
                <div className={`px-4 py-2 rounded-2xl rounded-tl-none border text-[13px] max-w-[85%] font-medium ${isAdmin ? 'bg-indigo-50 border-indigo-100 text-indigo-900' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200">
          <form onSubmit={handleSend} className="flex gap-0 border border-black overflow-hidden bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-4 py-3 text-sm outline-none placeholder:text-zinc-400"
            />
            {/* "rounded-none" creates the sharp shark-edges for the button */}
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors active:invert"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}