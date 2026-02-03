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
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      {/* Container with restricted width and height */}
      <div className="w-full max-w-md h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200">

        {/* Compact Header */}
        <div className="p-4 bg-white border-b flex justify-between items-center">
          <h1 className="font-bold text-lg">CoolChat 💬</h1>
          <Link href="/dashboard" className="text-xs bg-zinc-100 px-3 py-1 rounded-full hover:bg-zinc-200 transition">
            Exit
          </Link>
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50">
          {error && <div className="text-red-500 text-xs text-center p-2 bg-red-50 rounded">Error: {error}</div>}

          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col items-start">
              <span className="text-[9px] font-bold text-zinc-400 ml-1 mb-0.5 uppercase tracking-wider">{msg.username}</span>
              <div className="bg-white border border-zinc-200 px-3 py-1.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-zinc-800">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Integrated Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            className="flex-1 bg-zinc-100 px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}