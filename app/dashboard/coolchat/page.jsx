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
    // This centered layout prevents it from taking up the whole screen
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">

      {/* Strictly limited size container */}
      <div className="w-full max-w-md h-[600px] bg-white rounded-[2rem] shadow-2xl border border-zinc-200 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-tighter text-black">COOLCHAT</h1>
            <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">FREE</span>
          </div>
          <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black">EXIT</Link>
        </div>

        {/* Message Feed - Slim bubbles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50">
          {messages.map((msg, i) => {
            const isAdmin = msg.username?.toLowerCase() === 'dev' || msg.username?.toLowerCase() === 'rio';
            return (
              <div key={i} className="flex flex-col items-start">
                <span className={`text-[9px] font-black mb-1 ml-1 uppercase ${isAdmin ? 'text-indigo-600' : 'text-zinc-400'}`}>
                  {msg.username} {isAdmin && '• ADMIN'}
                </span>
                <div className={`px-4 py-2 rounded-2xl rounded-tl-none border text-sm max-w-[85%] ${isAdmin ? 'bg-indigo-50 border-indigo-100 text-indigo-900' : 'bg-white border-zinc-200 text-zinc-700'
                  }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-zinc-100 px-4 py-2.5 rounded-xl text-sm outline-none focus:bg-white focus:ring-1 focus:ring-zinc-300 transition-all"
          />
          <button type="submit" className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-transform">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}