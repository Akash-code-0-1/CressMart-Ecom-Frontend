"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatEngine } from "@/hooks/useChat";
import { FiSend, FiPaperclip, FiX, FiFileText, FiLoader, FiAlertCircle } from "react-icons/fi";
import { BsChatDotsFill } from "react-icons/bs";
import { apiFetch } from "@/utils/api";

interface Attachment {
  type: "IMAGE" | "VIDEO" | "FILE";
  url: string;
  name: string;
  mimeType: string;
  size: number;
}

const ChatWidget = () => {
  const user = useAuthStore((state) => state.user);
  const isStoreReady = useAuthStore((state) => state._hasHydrated);
  
  const isOpen = useAuthStore((state) => state.isChatOpen);
  const setIsOpen = useAuthStore((state) => state.setIsChatOpen);

  const [inputText, setInputText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { 
    messages, loadingHistory, isAdminTyping, sendTypingStatus, sendMessage 
  } = useChatEngine(isOpen);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAdminTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && pendingAttachments.length === 0) return;

    sendMessage({
      text: inputText.trim() || null,
      attachments: pendingAttachments.length > 0 ? pendingAttachments : null,
    });

    setInputText("");
    setPendingAttachments([]);
    setIsTyping(false);
    sendTypingStatus(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorText(null);
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiFetch("/chat/attachments/upload", { 
        method: "POST", 
        body: formData 
      });
      
      const jsonResponse = await res.json();
      if (!res.ok) throw new Error(jsonResponse?.message || "Upload failed.");

      const innerData = jsonResponse.data;

      setPendingAttachments((prev) => [
        ...prev,
        {
          type: innerData.type,
          url: innerData.url,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
        },
      ]);
    } catch (err: any) {
      setErrorText(err.message || "Failed to process attachment staging.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePendingAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const renderAttachmentPreview = (att: any, isMe: boolean) => {
    const baseStorageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";
    const absoluteAssetUrl = `${baseStorageUrl}${att.url}`;
    const type = att.type;
    const mime = att.mimeType || att.mimetype;
    const name = att.name || "File Asset";

    if (type === "IMAGE") {
      return (
        <div className="mt-1.5 rounded-xl overflow-hidden border border-gray-100 max-w-[220px] shadow-sm bg-white hover:opacity-95 transition-opacity cursor-pointer">
          <img 
            src={absoluteAssetUrl} 
            alt={name} 
            className="w-full object-cover max-h-[160px]" 
            style={{ height: "auto" }}
          />
        </div>
      );
    }
    if (type === "VIDEO") {
      return (
        <video controls className="mt-1.5 w-full rounded-xl max-h-[160px] bg-black shadow-sm border border-gray-200">
          <source src={absoluteAssetUrl} type={mime} />
        </video>
      );
    }
    return (
      <a 
        href={absoluteAssetUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`mt-1.5 flex items-center gap-2.5 border p-2.5 rounded-xl text-xs transition-all shadow-3xs max-w-[240px] ${
          isMe 
            ? "bg-white/10 border-white/10 text-white hover:bg-white/20" 
            : "bg-slate-50 border-gray-200 text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isMe ? "bg-white/20" : "bg-orange-50"}`}>
          <FiFileText size={16} className={isMe ? "text-white" : "text-[#FF7050]"} />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="truncate font-semibold text-[11px]">{name}</p>
        </div>
      </a>
    );
  };

  if (!isStoreReady || !user) return null;

  return (
    <div className="fixed bottom-[85px] right-4 lg:bottom-6 lg:right-6 z-[210] font-sans flex flex-col items-end antialiased selection:bg-orange-100">
      {isOpen && (
        <div className="w-[calc(100vw-32px)] sm:w-[400px] h-[480px] sm:h-[520px] bg-white border border-gray-100 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden mb-4 transition-all duration-300 transform scale-100 origin-bottom-right animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Widget Header */}
          <div className="p-4 bg-gradient-to-r from-[#FF7050] to-[#ff846b] text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-sm relative border border-white/10 shadow-inner">
                CM
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#FF7050] rounded-full shadow-sm animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wide">Creass Mart Help Desk</h4>
                <p className="text-[10px] text-orange-50/80 font-medium">We typically reply instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer text-white border-none outline-none bg-transparent">
                <FiX size={16} />
              </button>
            </div>
          </div>

          {errorText && (
            <div className="bg-amber-50 border-b border-amber-100 px-3 py-1.5 flex items-center gap-2 text-amber-700 text-xs shrink-0 font-medium">
              <FiAlertCircle size={14} className="shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Messages Viewport Log stream layout */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] space-y-3.5 custom-scrollbar">
            {loadingHistory ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <FiLoader className="animate-spin text-[#FF7050]" size={20} />
                <p className="text-xs font-medium">Loading previous messages...</p>
              </div>
            ) : Array.isArray(messages) && messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 gap-2">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-3xs border mb-1">
                  <BsChatDotsFill size={18} className="text-gray-300" />
                </div>
                <h5 className="text-xs font-bold text-gray-700">Hello! How can we help?</h5>
                <p className="text-[11px] max-w-[200px] leading-relaxed text-gray-400 font-medium">Send a message below to start talking with an admin.</p>
              </div>
            ) : null}

            {!loadingHistory && Array.isArray(messages) && messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex gap-2.5 w-full ${isMe ? "justify-end" : "justify-start"} animate-in fade-in-50 duration-150`}>
                  <div className={`flex flex-col max-w-[78%] ${isMe ? "items-end" : "items-start"}`}>
                    {msg.text && (
                      <div className={`p-3 text-[13px] leading-relaxed shadow-3xs border ${
                        // 🚀 UPDATED BUBBLE BEAUTIFICATION SCHEME
                        isMe 
                          ? "bg-gradient-to-r from-[#FF7050] to-[#ff846b] text-white rounded-2xl rounded-tr-none border-transparent font-medium" 
                          : "bg-white text-gray-800 rounded-2xl rounded-tl-none border-gray-200/60 font-normal"
                      }`}>
                        {msg.text}
                      </div>
                    )}
                    {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.map((att, i) => (
                      <div key={i} className="max-w-full">{renderAttachmentPreview(att, isMe)}</div>
                    ))}
                    <span className="text-[9px] text-gray-400 mt-1 px-1 font-medium tracking-tight">
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                </div>
              );
            })}

            {isAdminTyping && (
              <div className="flex gap-2 items-center justify-start animate-pulse">
                <div className="bg-white border border-gray-200/60 px-3 py-2 rounded-xl rounded-tl-none shadow-3xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Typing Panel and Form Bar Console */}
          <div className="p-3 border-t border-gray-100 bg-white shrink-0 flex flex-col gap-2">
            
            {pendingAttachments.length > 0 && (
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-dashed border-gray-200">
                {pendingAttachments.map((att, idx) => {
                  const storageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";
                  return (
                    <div key={idx} className="relative group flex items-center gap-1.5 bg-white border p-1 rounded-lg max-w-[140px] shadow-3xs">
                      {att.type === "IMAGE" ? (
                        <img 
                          src={`${storageUrl}${att.url}`} 
                          className="w-8 h-8 object-cover rounded-md" 
                          alt="" 
                        />
                      ) : (
                        <FiFileText size={16} className="text-[#FF7050] ml-1" />
                      )}
                      <span className="text-[10px] text-gray-600 truncate max-w-[80px] font-semibold">{att.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removePendingAttachment(idx)}
                        className="bg-red-500 text-white rounded-full p-0.5 ml-1 hover:bg-red-600 cursor-pointer border-none flex items-center justify-center shadow-sm"
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <form 
              onSubmit={handleSendMessage} 
              className="flex items-center gap-2.5 bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#FF7050] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(255,112,80,0.06)] transition-all relative w-full"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button 
                type="button" 
                disabled={uploading || loadingHistory} 
                onClick={() => fileInputRef.current?.click()} 
                className="text-gray-400 hover:text-[#FF7050] transition-colors disabled:opacity-50 cursor-pointer shrink-0 border-none outline-none bg-transparent p-0 flex items-center"
              >
                {uploading ? <FiLoader className="animate-spin text-[#FF7050]" size={18} /> : <FiPaperclip size={18} />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder={uploading ? "Uploading attachment..." : "Write a reply..."}
                disabled={uploading || loadingHistory}
                className="w-full bg-transparent border-none outline-none text-xs py-0.5 text-gray-800 pr-10 placeholder-gray-400 font-medium"
              />

              <button 
                type="submit" 
                disabled={uploading || loadingHistory || (!inputText.trim() && pendingAttachments.length === 0)} 
                className="absolute right-2 text-white bg-[#FF7050] hover:bg-[#e65c3c] p-2 rounded-lg transition-all disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer flex items-center justify-center shrink-0 border-none outline-none shadow-3xs"
              >
                <FiSend size={13} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="hidden lg:flex bg-[#FF7050] text-white p-4 rounded-full shadow-[0_8px_24px_rgba(255,112,80,0.35)] hover:bg-[#e66345] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer items-center justify-center z-[100]"
      >
        {isOpen ? <FiX size={24} /> : <BsChatDotsFill size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;