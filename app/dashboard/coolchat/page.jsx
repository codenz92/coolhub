'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CryptoJS from 'crypto-js';

export default function CoolChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatPassword, setChatPassword] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const handleUnlock = (enteredValue) => {
    // 1. Check for presence and minimum length (16 characters)
    if (!enteredValue || enteredValue.length < 16) {
      alert("SECURITY ERROR: SECRET_KEY MUST BE AT LEAST 16 CHARACTERS.");
      return;
    }

    if (!enteredValue) return;

    // 1. Clear old messages immediately to prevent the "flicker"
    setMessages([]);

    // 2. Set the new key and unlock
    setChatPassword(enteredValue);
    setIsLocked(false);
  };

  // Targeted deletion: only clears messages successfully decrypted by the current key
  const clearChat = async () => {
    const visibleMessageIds = messages.map(msg => msg.id).filter(Boolean);
    if (visibleMessageIds.length === 0) return;

    if (!confirm(`PERMANENTLY DELETE ${visibleMessageIds.length} DECRYPTED MESSAGES?`)) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'DELETE',
        body: JSON.stringify({ ids: visibleMessageIds }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) setMessages([]);
    } catch (err) {
      console.error("Failed to clear vault:", err);
    }
  };

  useEffect(() => {
    if (isLocked) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages', { cache: 'no-store' });
        const data = await res.json();

        // PROTECTION: Ensure data is an array before mapping
        if (!Array.isArray(data)) {
          console.error("Server error or invalid data format:", data);
          return;
        }

        const decryptedData = data.map(msg => {
          try {
            const textBytes = CryptoJS.AES.decrypt(msg.text || '', chatPassword);
            const decryptedText = textBytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedText) return null

            const userBytes = CryptoJS.AES.decrypt(msg.username || '', chatPassword);
            const decryptedUser = userBytes.toString(CryptoJS.enc.Utf8);

            const timeBytes = CryptoJS.AES.decrypt(msg.created_at || '', chatPassword);
            const decryptedTime = timeBytes.toString(CryptoJS.enc.Utf8);

            return {
              ...msg,
              username: decryptedUser || 'Anonymous',
              text: decryptedText,
              displayTime: decryptedTime || ''
            };
          } catch (e) {
            return null;
          }
        }).filter(Boolean);

        setMessages(decryptedData);
      } catch (err) {
        console.error("Connection failed:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [isLocked, chatPassword]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatPassword) return;

    const myUsername = 'dev';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Client-side encryption ensures the server never sees the raw message content
    const encryptedUser = CryptoJS.AES.encrypt(myUsername, chatPassword).toString();
    const encryptedText = CryptoJS.AES.encrypt(input, chatPassword).toString();
    const encryptedTime = CryptoJS.AES.encrypt(now, chatPassword).toString();

    setInput('');
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        username: encryptedUser,
        text: encryptedText,
        created_at: encryptedTime
      })
    });
  };

  if (isLocked) {
    return (
      /* 1. Page Background Wrapper */
      <div className="min-h-screen bg-zinc-300 flex items-center justify-center p-4">

        {/* 2. Main Container Box */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-zinc-400 p-12 text-center">

          <h1 className="font-black text-2xl mb-1 tracking-tighter text-black uppercase">
            ENCRYPTED COOLCHAT
          </h1>
          <p className="text-[10px] font-bold text-black mb-8 uppercase tracking-widest">
            ENTER CHAT SECRET TO ACCESS
          </p>

          <input
            ref={inputRef}
            type="password"
            placeholder="SECRET_KEY (MIN. 16 CHARS)"
            className="w-full p-4 border border-zinc-200 mb-4 font-mono text-center outline-none focus:border-black transition-colors text-black"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUnlock(e.target.value);
                e.target.value = '';
              }
            }}
          />

          <button
            onClick={() => {
              if (inputRef.current) {
                handleUnlock(inputRef.current.value);
                inputRef.current.value = '';
              }
            }}
            className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all mb-6 active:scale-95"
          >
            UNLOCK CHAT
          </button>

          <div className="mt-8">
            <Link
              href="/dashboard"
              className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
            >
              🏠 RETURN TO DASHBOARD 🏠
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-zinc-300 flex items-center justify-center p-4 z-[999]">
      <div className="w-full max-w-[450px] h-[650px] bg-white rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col border border-zinc-400 overflow-hidden">
        <div className="px-6 py-5 border-b flex justify-between items-center bg-white">
          <div>
            <h1 className="text-[5px] font-black text-xs tracking-[0.2em] text-black uppercase">COOLCHAT</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[5px] font-bold text-green-600 uppercase tracking-widest">🔒 End-to-End Encryption active 🔒</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={clearChat} className="text-[10px] font-bold text-zinc-300 hover:text-red-600 transition-colors uppercase tracking-widest">Clear Vault</button>
            <button onClick={() => setIsLocked(true)} className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors uppercase">LOCK</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((msg, i) => {
            const isAdmin = msg.username?.toLowerCase() === 'dev';
            return (
              <div key={i} className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1 ml-1">
                  <span className={`text-[9px] font-black uppercase tracking-tighter ${isAdmin ? 'text-indigo-600' : 'text-zinc-400'}`}>{msg.username} {isAdmin && '• ADMIN'}</span>
                  <span className="text-[8px] font-bold text-zinc-300 tracking-tighter uppercase">{msg.displayTime}</span>
                </div>
                <div className={`px-4 py-2 rounded-2xl rounded-tl-none border text-[13px] max-w-[90%] font-medium ${isAdmin ? 'bg-indigo-50 border-indigo-100 text-indigo-900 shadow-sm' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>{msg.text}</div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
        <div className="p-5 bg-zinc-50 border-t border-zinc-200">
          <form onSubmit={handleSend} className="flex border-2 border-black bg-white shadow-[3px_3px_0px_black]">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Secure transmission..." className="flex-1 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 font-mono" />
            <button type="submit" className="bg-black text-white px-6 rounded-none text-[10px] font-black uppercase tracking-widest">SEND</button>
          </form>
        </div>
      </div>
    </div>
  );
}