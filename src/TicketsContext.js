// src/TicketsContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE = "https://csci441-group-project.onrender.com";
const TicketsCtx = createContext();

export function TicketsProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [tickets, setTickets] = useState([]);

  // Fetch the logged-in user's profile using JWT from localStorage
  const refreshCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrentUser(null);
        return null;
      }
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // token invalid/expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
        return null;
      }
      const user = await res.json();
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch {
      setCurrentUser(null);
      return null;
    }
  };

  // load from localStorage on mount, then verify via profile if token exists
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined" && stored !== "null") {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {/* ignore */}
    if (localStorage.getItem("token")) {
      refreshCurrentUser();
    }
  }, []);

  useEffect(() => {
    if (currentUser) localStorage.setItem("user", JSON.stringify(currentUser));
    else localStorage.removeItem("user");
  }, [currentUser]);

  const createTicket = async (ticketData) => {
    const newTicket = { ...ticketData, id: Date.now() };
    setTickets((prev) => [...prev, newTicket]);
    return newTicket;
  };

  const fetchTickets = async (userId) => tickets.filter((t) => t.userId === userId);

  return (
    <TicketsCtx.Provider
      value={{
        currentUser,
        setCurrentUser,
        refreshCurrentUser,
        tickets,
        setTickets,
        createTicket,
        fetchTickets,
      }}
    >
      {children}
    </TicketsCtx.Provider>
  );
}

export function useTickets() {
  return useContext(TicketsCtx);
}
