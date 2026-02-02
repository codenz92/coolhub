// app/dashboard/coolchat/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CoolChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // 1. Refresh messages every 2 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // 2. Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Send message to the API
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput(''); // Clear input for speed

    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ text: currentInput }),
    });
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      {/* Top Bar */}
      <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
        <h1 className="font-bold text-xl text-black">CoolChat 💬</h1>
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
          Exit Chat
        </Link>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-zinc-400 ml-1 uppercase">{msg.username}</span>
            <div className="bg-white border border-zinc-200 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm text-zinc-800">
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-100 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
}