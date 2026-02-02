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
    <div className="flex flex-col h-screen bg-zinc-100">
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <h1 className="font-bold text-xl">CoolChat 💬</h1>
        <Link href="/dashboard" className="text-blue-600 font-medium">Exit</Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && <div className="text-red-500 text-center bg-red-50 p-2 rounded">Error: {error}</div>}
        {messages.length === 0 && !error && <div className="text-center text-zinc-400 mt-10">No messages yet...</div>}

        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">{msg.username}</span>
            <div className="bg-white border border-zinc-200 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-100 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold">Send</button>
      </form>
    </div>
  );
}