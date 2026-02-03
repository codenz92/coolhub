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
    // This outer div ensures the chat stays centered and doesn't fill the screen
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4">

      {/* This is the Chat Window - strictly limited in size */}
      <div className="w-full max-w-[400px] h-[600px] bg-white rounded-3xl shadow-xl flex flex-col border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">COOLCHAT</span>
            <span className="text-[8px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">FREE</span>
          </div>
          <Link href="/dashboard" className="text-[10px] font-bold text-gray-400 hover:text-black">EXIT</Link>
        </div>

        {/* Messages - Slim Bubbles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {messages.map((msg, i) => {
            const isDev = msg.username?.toLowerCase() === 'dev';
            const isRio = msg.username?.toLowerCase() === 'rio';

            return (
              <div key={i} className="flex flex-col">
                <span className={`text-[9px] font-bold mb-0.5 ml-1 uppercase ${isDev ? 'text-indigo-500' : isRio ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {msg.username} {(isDev || isRio) && '• Admin'}
                </span>
                <div className={`inline-block self-start max-w-[85%] px-3 py-1.5 rounded-2xl rounded-tl-none border text-sm ${isDev ? 'bg-indigo-50 border-indigo-100 text-indigo-900' :
                  isRio ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                    'bg-white border-gray-200 text-gray-700'
                  }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-sm outline-none"
          />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold active:scale-95 transition-transform">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}