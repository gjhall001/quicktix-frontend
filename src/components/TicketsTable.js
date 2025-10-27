// src/components/TicketsTable.js
import React from "react";
import "./TicketsTable.css";
import { useTickets } from "../TicketsContext";

function TicketsTable({ tickets: propTickets }) {
  const { tickets: contextTickets, currentUser } = useTickets();

  // Use tickets from props if provided, otherwise from context
  const tickets = propTickets || contextTickets;

  if (!currentUser) {
    return <p>Please log in to view your tickets.</p>;
  }

  if (!tickets || tickets.length === 0) {
    return <p>No tickets found.</p>;
  }

  return (
    <div className="ticketsTableContainer">
      <h3>{currentUser.email}'s Tickets</h3>
      <table className="ticketsTable">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.id || "N/A"}</td>
              <td>{t.title}</td>
              <td>{t.category || "-"}</td>
              <td>{t.priorityLevel || "-"}</td>
              <td>{t.status || "Open"}</td>
              <td>
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketsTable;