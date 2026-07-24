"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Send, Paperclip, Smile, X, FileText } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import Modal from "@/components/Modal";
import { useMessages } from "@/components/MessagesContext";
import { inputClass } from "@/components/formStyles";

function isImageAttachment(attachment) {
  return attachment.type?.startsWith("image/");
}

function NewConversationModal({ open, onClose, onStarted }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/messages/users?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => setResults(Array.isArray(data) ? data : []))
        .finally(() => setSearching(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  async function startWith(userId) {
    const res = await fetch("/api/messages/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setQuery("");
    setResults([]);
    onStarted(data.id);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New conversation">
      <input
        className={inputClass}
        placeholder="Search by name or email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div className="user-search-results">
        {searching && <div className="announcements-empty">Searching…</div>}
        {!searching && query.trim() && !results.length && (
          <div className="announcements-empty">No users found.</div>
        )}
        {results.map((u) => (
          <button key={u.id} className="user-search-item" onClick={() => startWith(u.id)}>
            <span className="user-search-avatar">{u.name?.charAt(0)?.toUpperCase()}</span>
            <span>
              <strong>{u.name}</strong>
              <span className="user-search-email">{u.email}</span>
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default function MessagesView() {
  const { data: session } = useSession();
  const { conversations, onlineMap, refreshConversations, subscribe } = useMessages();
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showNewConvo, setShowNewConvo] = useState(false);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);
  const threadEndRef = useRef(null);

  const activeConversation = conversations.find((c) => c.id === activeId);

  const loadMessages = useCallback(async (id) => {
    if (!id) return;
    const res = await fetch(`/api/messages/conversations/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data);
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMessages(activeId);
  }, [activeId, loadMessages]);

  useEffect(() => {
    return subscribe((payload) => {
      if (payload.conversationId === activeId) {
        setMessages((prev) => [...prev, payload]);
        loadMessages(activeId);
      }
    });
  }, [activeId, subscribe, loadMessages]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!showEmoji) return;
    function onClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showEmoji]);

  function onPickFile(e) {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = "";
  }

  async function uploadAttachment(file) {
    const signRes = await fetch("/api/messages/upload", { method: "POST" });
    if (!signRes.ok) throw new Error("Attachments are not configured yet.");
    const { timestamp, folder, signature, apiKey, cloudName } = await signRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", timestamp);
    form.append("folder", folder);
    form.append("signature", signature);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: form,
    });
    if (!uploadRes.ok) throw new Error("Upload failed");
    const uploaded = await uploadRes.json();
    return {
      url: uploaded.secure_url,
      type: file.type || "application/octet-stream",
      name: file.name,
      size: file.size,
    };
  }

  async function sendMessage() {
    if (!activeId || (!text.trim() && !pendingFile)) return;
    let attachments = [];
    try {
      if (pendingFile) {
        setUploading(true);
        attachments = [await uploadAttachment(pendingFile)];
      }
    } catch (err) {
      setUploading(false);
      alert(err.message || "Failed to upload attachment.");
      return;
    }
    setUploading(false);

    const res = await fetch(`/api/messages/conversations/${activeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim(), attachments }),
    });
    if (!res.ok) return;
    const message = await res.json();
    setMessages((prev) => [...prev, message]);
    setText("");
    setPendingFile(null);
    setShowEmoji(false);
    refreshConversations();
  }

  return (
    <div>
      <h1>Messages</h1>
      <p className="page-sub">Chat with other members of the community.</p>

      <div className="messages-layout">
        <div className="conversation-list">
          <button className="btn small" onClick={() => setShowNewConvo(true)}>
            New conversation
          </button>
          {!conversations.length && (
            <div className="announcements-empty">No conversations yet. Start one above.</div>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              className={`conversation-item${c.id === activeId ? " active" : ""}`}
              onClick={() => setActiveId(c.id)}
            >
              <span className="conversation-avatar">
                {c.otherUser?.name?.charAt(0)?.toUpperCase()}
                <span className={`online-dot${onlineMap[c.otherUser?.id] ? " online" : ""}`} />
              </span>
              <span className="conversation-meta">
                <strong>{c.otherUser?.name || "Unknown user"}</strong>
                <span className="conversation-preview">{c.lastMessagePreview}</span>
              </span>
              {c.unreadCount > 0 && <span className="nav-badge">{c.unreadCount}</span>}
            </button>
          ))}
        </div>

        <div className="message-thread">
          {!activeConversation ? (
            <div className="announcements-empty">Select a conversation to start chatting.</div>
          ) : (
            <>
              <div className="message-thread-header">
                <strong>{activeConversation.otherUser?.name}</strong>
                <span className={`online-status${onlineMap[activeConversation.otherUser?.id] ? " online" : ""}`}>
                  {onlineMap[activeConversation.otherUser?.id] ? "Online" : "Offline"}
                </span>
              </div>

              <div className="message-thread-body">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`message-bubble${m.sender === session?.user?.id ? " own" : " other"}`}
                  >
                    {m.text && <p>{m.text}</p>}
                    {(m.attachments || []).map((a, i) =>
                      isImageAttachment(a) ? (
                        <a key={i} href={a.url} target="_blank" rel="noopener noreferrer">
                          <img src={a.url} alt={a.name} className="attachment-preview" />
                        </a>
                      ) : (
                        <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="attachment-file">
                          <FileText size={16} /> {a.name}
                        </a>
                      )
                    )}
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>

              {pendingFile && (
                <div className="attachment-chip">
                  <Paperclip size={14} /> {pendingFile.name}
                  <button className="btn small subtle" onClick={() => setPendingFile(null)} aria-label="Remove attachment">
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="message-composer">
                <div className="emoji-picker-wrap" ref={emojiRef}>
                  <button
                    type="button"
                    className="btn subtle"
                    title="Emoji"
                    onClick={() => setShowEmoji((v) => !v)}
                  >
                    <Smile size={18} />
                  </button>
                  {showEmoji && (
                    <div className="emoji-picker-popover">
                      <EmojiPicker
                        onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
                        width={300}
                        height={360}
                      />
                    </div>
                  )}
                </div>
                <button type="button" className="btn subtle" title="Attach file" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip size={18} />
                </button>
                <input type="file" ref={fileInputRef} onChange={onPickFile} hidden />
                <input
                  className={inputClass}
                  placeholder="Type a message…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button className="btn primary" onClick={sendMessage} disabled={uploading} title="Send">
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <NewConversationModal
        open={showNewConvo}
        onClose={() => setShowNewConvo(false)}
        onStarted={(id) => {
          refreshConversations();
          setActiveId(id);
        }}
      />
    </div>
  );
}
