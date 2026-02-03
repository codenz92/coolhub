'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CryptoJS from 'crypto-js';

// Shared secret key for encryption/decryption
const SECRET_KEY = 'coolhub-private-key-2026';

export default function CoolChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages', { cache: 'no-store' });
        const data = await res.json();

        // DECRYPTION: Unlocking Username, Text, and Timestamp
        const decryptedData = data.map(msg => {
          try {
            // Decrypt Username
            const userBytes = CryptoJS.AES.decrypt(msg.username || '', SECRET_KEY);
            const decryptedUser = userBytes.toString(CryptoJS.enc.Utf8);

            // Decrypt Message Text
            const textBytes = CryptoJS.AES.decrypt(msg.text || '', SECRET_KEY);
            const decryptedText = textBytes.toString(CryptoJS.enc.Utf8);

            // Decrypt Timestamp (if present in payload)
            const timeBytes = CryptoJS.AES.decrypt(msg.created_at || '', SECRET_KEY);
            const decryptedTime = timeBytes.toString(CryptoJS.enc.Utf8);

            return {
              ...msg,
              username: decryptedUser || 'Anonymous',
              text: decryptedText || '[Decryption Failed]',
              displayTime: decryptedTime || ''
            };
          } catch (e) {
            // Defaulting to LOCKED for old plain-text entries
            return { ...msg, username: 'LOCKED', text: '[Encrypted]', displayTime: '' };
          }
        });

        setMessages(decryptedData);
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

    // Use current session user (placeholder 'dev' used here)
    const myUsername = 'dev';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // ENCRYPTION: Scramble everything before it hits the database
    const encryptedUser = CryptoJS.AES.encrypt(myUsername, SECRET_KEY).toString();
    const encryptedText = CryptoJS.AES.encrypt(input, SECRET_KEY).toString();
    const encryptedTime = CryptoJS.AES.encrypt(now, SECRET_KEY).toString();

    setInput('');
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        username: encryptedUser, // Now sending scrambled username
        text: encryptedText,     // Sending scrambled text
        created_at: encryptedTime // Sending scrambled time
      })
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-300 flex items-center justify-center p-4 z-[999]">
      <div className="w-full max-w-[450px] h-[650px] bg-white rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col border border-zinc-400 overflow-hidden">

        <div className="px-6 py-5 border-b flex justify-between items-center bg-white">
          <div>
            <h1 className="font-black text-xs tracking-[0.2em] text-black uppercase">COOLCHAT</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
              <span className="text-[7px] font-bold text-indigo-600 uppercase tracking-widest">Full Metadata Stealth</span>
            </div>
          </div>
          <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors">
            EXIT
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((msg, i) => {
            // ADMIN identification based on decrypted username
            const isAdmin = msg.username?.toLowerCase() === 'dev' || msg.username?.toLowerCase() === 'rio';
            return (
              <div key={i} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-1">
                <div className="flex items-center gap-2 mb-1 ml-1">
                  <span className={`text-[9px] font-black uppercase tracking-tighter ${isAdmin ? 'text-indigo-600' : 'text-zinc-400'}`}>
                    {msg.username} {isAdmin && '• ADMIN'}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-300 tracking-tighter uppercase">{msg.displayTime}</span>
                </div>
                <div className={`px-4 py-2 rounded-2xl rounded-tl-none border text-[13px] max-w-[90%] font-medium ${isAdmin ? 'bg-indigo-50 border-indigo-100 text-indigo-900 shadow-sm' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        <div className="p-5 bg-zinc-50 border-t border-zinc-200">
          <form onSubmit={handleSend} className="flex border-2 border-black bg-white shadow-[3px_3px_0px_black]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Secure transmission..."
              className="flex-1 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 font-mono"
            />
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