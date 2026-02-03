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
    /* Background darkened to bg-zinc-300 to make the white chat box pop */
    <div className="fixed inset-0 bg-zinc-300 flex items-center justify-center p-4">

      {/* CHAT WINDOW: 
          - max-w-[50vw] centers it and keeps it at half-screen width
          - shadow-[...] adds a massive deep shadow for the "stand out" effect
      */}
      <div className="w-full max-w-[50vw] h-[75vh] bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col border border-zinc-400/30 overflow-hidden">

        {/* Header - Clean with no FREE badge */}
        <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-white">
          <h1 className="font-black text-sm tracking-[0.3em] text-black uppercase">CoolChat</h1>
          <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors bg-zinc-50 px-3 py-1.5 rounded-full">
            EXIT
          </Link>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
          {messages.map((msg, i) => {
            const isAdmin = msg.username?.toLowerCase() === 'dev' || msg.username?.toLowerCase() === 'rio';
            return (
              <div key={i} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className={`text-[10px] font-black mb-1.5 ml-1 uppercase tracking-wider ${isAdmin ? 'text-indigo-600' : 'text-zinc-400'}`}>
                  {msg.username} {isAdmin && '• ADMIN'}
                </span>
                <div className={`px-5 py-3 rounded-2xl rounded-tl-none border text-[14px] max-w-[80%] font-medium leading-relaxed ${isAdmin ? 'bg-indigo-50 border-indigo-100 text-indigo-900' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input area: SHARP SHARK EDGES */}
        <div className="p-8 bg-white border-t border-zinc-100">
          <form onSubmit={handleSend} className="flex border-2 border-black bg-white overflow-hidden shadow-[4px_4px_0px_black]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-5 py-4 text-sm outline-none placeholder:text-zinc-400"
            />
            {/* Shark Edge Button - Fully Square */}
            <button
              type="submit"
              className="bg-black text-white px-10 rounded-none text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors active:bg-indigo-600"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}