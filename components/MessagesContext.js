"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [onlineMap, setOnlineMap] = useState({});
  const [incomingMessage, setIncomingMessage] = useState(null);
  const listenersRef = useRef(new Set());

  const refreshConversations = useCallback(async () => {
    const res = await fetch("/api/messages/conversations");
    if (!res.ok) return;
    const data = await res.json();
    setConversations(data);
    setOnlineMap((prev) => {
      const next = { ...prev };
      for (const c of data) {
        if (c.otherUser) next[c.otherUser.id] = c.otherUser.online;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    const source = new EventSource("/api/messages/stream");

    source.addEventListener("message", (e) => {
      const payload = JSON.parse(e.data);
      setIncomingMessage(payload);
      refreshConversations();
      for (const listener of listenersRef.current) listener(payload);
    });

    source.addEventListener("presence", (e) => {
      const { userId, online } = JSON.parse(e.data);
      setOnlineMap((prev) => ({ ...prev, [userId]: online }));
    });

    return () => source.close();
  }, [refreshConversations]);

  const subscribe = useCallback((listener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const unreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <MessagesContext.Provider
      value={{ conversations, onlineMap, unreadCount, incomingMessage, refreshConversations, subscribe }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used within MessagesProvider");
  return ctx;
}
