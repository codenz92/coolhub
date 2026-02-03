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
    // The "fixed inset-0" ensures the background covers everything, 
    // but the flex-center keeps the chat box small in the middle.
    <div className="fixed inset-0 bg-zinc-200 flex items-center justify-center p-4">

      {/* CHAT BOX: Strictly limited width and height so it doesn't take up the screen */}
      <div className="w-full max-w-[450px] h-[650px] bg-white rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.15)] flex flex-col border border-zinc-300 overflow-hidden">

        {/* Header - Minimal with no FREE badge */}
        <div className="px-6 py-5 border-b flex justify-between items-center bg-white">
          <h1 className="font-black text-xs tracking-[0.2em] text-black">COOLCHAT</h1>
          <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors">
            EXIT
          </Link>
        </div>

        {/* Message Feed - Slimmer bubbles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((msg, i) => {
            const isAdmin = msg.username?.toLowerCase() === 'dev' || msg.username?.toLowerCase() === 'rio';
            return (
              <div key={i} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-1">
                <span className={`text-[9px] font-black mb-1 ml-1 uppercase tracking-tighter ${isAdmin ? 'text-indigo-600' : 'text-zinc-400'}`}>
                  {msg.username} {isAdmin && '• ADMIN'}
                </span>
                <div className={`px-4 py-2 rounded-2xl rounded-tl-none border text-[13px] max-w-[90%] font-medium ${isAdmin ? 'bg-indigo-50 border-indigo-100 text-indigo-900 shadow-sm' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar: SHARP SHARK EDGES */}
        <div className="p-5 bg-zinc-50 border-t border-zinc-200">
          <form onSubmit={handleSend} className="flex border-2 border-black bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-4 py-3 text-sm outline-none placeholder:text-zinc-400"
            />
            {/* "rounded-none" for the sharp shark-edge look */}
            <button
              type="submit"
              className="bg-black text-white px-6 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}