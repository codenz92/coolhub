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

  // Initialize state from localStorage with SSR safety
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // Sync state with document class and localStorage for persistence
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUnlock = (enteredValue) => {
    if (!enteredValue || enteredValue.length < 16) {
      alert("SECURITY ERROR: SECRET_KEY MUST BE AT LEAST 16 CHARACTERS.");
      return;
    }
    setMessages([]);
    setChatPassword(enteredValue);
    setIsLocked(false);
  };

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
        if (!Array.isArray(data)) return;

        const decryptedData = data.map(msg => {
          try {
            const textBytes = CryptoJS.AES.decrypt(msg.text || '', chatPassword);
            const decryptedText = textBytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedText) return null;
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
          } catch (e) { return null; }
        }).filter(Boolean);
        setMessages(decryptedData);
      } catch (err) { console.error("Connection failed:", err); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [isLocked, chatPassword]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatPassword) return;
    const myUsername = 'dev';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const encryptedUser = CryptoJS.AES.encrypt(myUsername, chatPassword).toString();
    const encryptedText = CryptoJS.AES.encrypt(input, chatPassword).toString();
    const encryptedTime = CryptoJS.AES.encrypt(now, chatPassword).toString();
    setInput('');
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ username: encryptedUser, text: encryptedText, created_at: encryptedTime })
    });
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-zinc-300 dark:bg-black flex items-center justify-center p-4 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-zinc-400 dark:border-zinc-800 p-12 text-center">
          <h1 className="font-black text-2xl mb-1 tracking-tighter text-black dark:text-white uppercase">ENCRYPTED TERMINAL</h1>
          <p className="text-[10px] font-bold text-black dark:text-zinc-400 mb-8 uppercase tracking-widest">ENTER CHAT SECRET TO ACCESS</p>
          <input
            ref={inputRef}
            type="password"
            placeholder="SECRET_KEY (MIN. 16 CHARS)"
            className="w-full p-4 border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 mb-4 font-mono text-center outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
            onKeyDown={(e) => { if (e.key === 'Enter') { handleUnlock(e.target.value); e.target.value = ''; } }}
          />
          <button
            onClick={() => { if (inputRef.current) { handleUnlock(inputRef.current.value); inputRef.current.value = ''; } }}
            className="w-full bg-black dark:bg-white text-white dark:text-black p-4 font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all mb-6 active:scale-95"
          >
            UNLOCK CHAT
          </button>
          <div className="mt-8">
            <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">
              RETURN TO DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-300 dark:bg-black flex items-center justify-center p-4 transition-colors">
      <div
        style={{ width: '600px', height: '650px' }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col border border-zinc-400 dark:border-zinc-800 overflow-hidden"
      >
        <div className="w-full px-6 py-5 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 grid grid-cols-3 items-center min-h-[90px]">
          <div className="flex justify-start">
            <h1 className="font-black text-[10px] tracking-[0.2em] text-black dark:text-white uppercase">
              COOLCHAT
            </h1>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">
                SECURE
              </span>
            </div>
            <p className="text-[7px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest mt-1">
              24H AUTO-ERASE
            </p>
          </div>

          <div className="flex justify-end items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-[10px] font-black text-zinc-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest"
            >
              {isDarkMode ? 'LIGHT' : 'DARK'}
            </button>
            <button
              onClick={clearChat}
              className="text-[10px] font-black text-zinc-300 hover:text-red-600 transition-colors uppercase tracking-widest"
            >
              CLEAR
            </button>
            <button
              onClick={() => setIsLocked(true)}
              className="text-[10px] font-black text-zinc-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest"
            >
              LOCK
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-zinc-900">
          {messages.map((msg, i) => {
            const isAdmin = msg.username?.toLowerCase() === 'dev';
            return (
              <div key={i} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 mb-1 ml-1">
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                    {msg.username} {isAdmin && '• ADMIN'}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-300 dark:text-zinc-600 tracking-tighter uppercase">{msg.displayTime}</span>
                </div>
                <div className={`px-4 py-2 rounded-2xl rounded-tl-none border text-[14px] max-w-[85%] w-fit font-medium ${isAdmin ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 shadow-sm' : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT AREA REFINED TO MATCH TARGET IMAGE */}
        <div className="p-8 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 transition-colors">
          <form
            onSubmit={handleSend}
            className="flex border-2 border-black dark:border-white bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_black] dark:shadow-[4px_4px_0px_white] transition-all"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Secure transmission..."
              className="flex-1 px-5 py-4 text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-mono bg-transparent dark:text-white"
            />
            <button
              type="submit"
              className="bg-black dark:bg-white text-white dark:text-black px-10 rounded-none text-[11px] font-black uppercase tracking-[0.2em] border-l-2 border-black dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}