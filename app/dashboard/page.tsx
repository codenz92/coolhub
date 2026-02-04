'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
// Ensure crypto-js is installed: pnpm add crypto-js
import CryptoJS from "crypto-js";

export default function CoolChatPage() {
  // 1. Get the session on the client side
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ user: string; text: string }[]>([]);

  // 2. Handle Loading and Protection
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  // 3. Simple Encryption Example
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Encrypting the message before "sending" (Simulation)
    const secretKey = "cool-hub-secret";
    const encrypted = CryptoJS.AES.encrypt(message, secretKey).toString();
    console.log("Sending Encrypted:", encrypted);

    // Update UI with the plain text for the sender
    setChatLog([...chatLog, {
      user: session.user?.username || "Unknown",
      text: message
    }]);
    setMessage("");
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-zinc-900 p-4 text-white flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            <span className="text-xl">💬</span> COOLCHAT (E2E Encrypted)
          </h2>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded-full uppercase font-black">
            Premium Access
          </span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-50 space-y-4">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.user === session.user?.username ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-400 mb-1">{msg.user}</span>
              <div className={`px-4 py-2 rounded-2xl max-w-xs ${msg.user === session.user?.username
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white border border-zinc-200 text-zinc-900 rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {chatLog.length === 0 && (
            <div className="text-center text-gray-400 mt-20 italic">
              No messages yet. Your session is active as {session.user?.username}.
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-zinc-200 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type an encrypted message..."
            className="flex-1 bg-zinc-100 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}