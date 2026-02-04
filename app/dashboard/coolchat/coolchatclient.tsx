'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CryptoJS from 'crypto-js';
import { Session } from 'next-auth';

interface CoolChatClientProps {
    session: Session;
}

export default function CoolChatClient({ session }: CoolChatClientProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [chatPassword, setChatPassword] = useState('');
    const [isLocked, setIsLocked] = useState(true);
    const [showKey, setShowKey] = useState(false);

    // Explicitly typed refs to prevent 'never' and 'scrollTop' errors
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    // Handle Dark Mode toggling
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

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleUnlock = (enteredValue: string) => {
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

    // Fetch and Decrypt Messages
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

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chatPassword) return;

        // Use dynamic username from session
        const myUsername = (session?.user as any)?.username || 'User';
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(chatPassword);
        alert("KEY COPIED TO CLIPBOARD");
    };

    // --- RENDERING ---

    if (isLocked) {
        return (
            <div className="min-h-screen bg-zinc-300 dark:bg-black flex items-center justify-center p-4 transition-colors">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-400 dark:border-zinc-800 p-8 sm:p-12 text-center">
                    <h1 className="font-black text-xl sm:text-2xl mb-1 tracking-tighter text-black dark:text-white uppercase">ENCRYPTED TERMINAL</h1>
                    <p className="text-[10px] font-bold text-black dark:text-zinc-400 mb-8 uppercase tracking-widest">ENTER CHAT SECRET TO ACCESS</p>
                    <input
                        ref={inputRef}
                        type="password"
                        placeholder="SECRET_KEY (MIN 16 CHARS)"
                        className="w-full p-4 border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 mb-4 font-mono text-center outline-none focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleUnlock((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
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
                        className="w-full bg-black dark:bg-white text-white dark:text-black p-4 font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all mb-6 active:scale-95"
                    >
                        UNLOCK CHAT
                    </button>
                    <Link href="/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">
                        RETURN TO DASHBOARD
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-300 dark:bg-black flex items-center justify-center p-2 sm:p-4 transition-colors">
            <div className="w-full max-w-[600px] h-[88vh] sm:h-[650px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col border border-zinc-400 dark:border-zinc-800 overflow-hidden">

                {/* HEADER */}
                <div className="w-full px-4 sm:px-6 py-3 sm:py-4 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:grid sm:grid-cols-3 items-center gap-2 sm:gap-0 min-h-fit sm:min-h-[90px]">
                    <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                        <h1 className="font-black text-[9px] sm:text-[10px] tracking-[0.2em] text-black dark:text-white uppercase">COOLCHAT</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[6px] sm:text-[7px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[90px] sm:max-w-[120px]">
                                KEY: {showKey ? chatPassword : '•'.repeat(8)}
                            </p>
                            <button onClick={() => setShowKey(!showKey)} className="hover:opacity-70 transition-opacity p-0.5">
                                {showKey ? '🙈' : '👁️'}
                            </button>
                            <button onClick={copyToClipboard} className="hover:opacity-70 transition-opacity p-0.5" title="Copy Key">📋</button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                            <span className="text-[7px] sm:text-[8px] font-bold text-green-600 uppercase tracking-widest">SECURE</span>
                        </div>
                    </div>

                    <div className="flex justify-center sm:justify-end items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-[9px] sm:text-[10px] font-black text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-widest">{isDarkMode ? 'LIGHT' : 'DARK'}</button>
                        <button onClick={clearChat} className="text-[9px] sm:text-[10px] font-black text-zinc-300 hover:text-red-600 uppercase tracking-widest">CLEAR</button>
                        <button onClick={() => setIsLocked(true)} className="text-[9px] sm:text-[10px] font-black text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-widest">LOCK</button>
                    </div>
                </div>

                {/* MESSAGES */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white dark:bg-zinc-900">
                    {messages.map((msg, i) => {
                        const isAdmin = ["dev", "rio"].includes(msg.username?.toLowerCase());
                        return (
                            <div key={i} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-2 mb-1 ml-1">
                                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tighter ${isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                                        {msg.username} {isAdmin && '• ADMIN'}
                                    </span>
                                    <span className="text-[8px] sm:text-[9px] font-bold text-zinc-300 dark:text-zinc-600 tracking-tighter uppercase">{msg.displayTime}</span>
                                </div>
                                <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl rounded-tl-none border text-[12px] sm:text-[14px] max-w-[90%] sm:max-w-[85%] w-fit font-medium ${isAdmin ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 shadow-sm' : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* INPUT */}
                <div className="p-3 sm:p-8 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800">
                    <form onSubmit={handleSend} className="flex border-2 border-black dark:border-white bg-white dark:bg-zinc-800 overflow-hidden">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 px-3 sm:px-5 py-2.5 sm:py-4 text-xs sm:text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-mono bg-transparent dark:text-white min-w-0"
                        />
                        <button type="submit" className="bg-black dark:bg-white text-white dark:text-black px-4 sm:px-10 font-black uppercase tracking-widest border-l-2 border-black dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 text-[9px] sm:text-[11px]">
                            SEND
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}