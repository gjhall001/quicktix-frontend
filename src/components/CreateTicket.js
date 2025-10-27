// src/components/CreateTicket.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTicket.css";
import { useTickets } from "../TicketsContext";

const API_BASE = "https://csci441-group-project.onrender.com";

function CreateTicket() {
  const navigate = useNavigate();
  const { currentUser, refreshCurrentUser } = useTickets();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const makeTicketId = () =>
    `TIX-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.description.trim() || !formData.priority) {
      setError("Please complete Title, Description, and Priority.");
      return;
    }

    setSubmitting(true);
    try {
      // Ensure we actually have a logged-in user (refresh via /api/users/profile if needed)
      let user = currentUser;
      if (!user) {
        user = await refreshCurrentUser(); // 👈 try to load from backend
      }
      if (!user) {
        setError("You must be logged in to create a ticket.");
        setSubmitting(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Missing auth token. Please log in again.");
        setSubmitting(false);
        return;
      }

      const now = new Date().toISOString();
      const payload = {
        ticketId: makeTicketId(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: "Open",
        priority: formData.priority,
        customer: user._id || user.userId || user.email, // reference to current user
        agent: null,
        createdAt: now,
        updatedAt: now,
      };

      const res = await fetch(`${API_BASE}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to create ticket");
      }

      alert("Ticket created successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Create ticket error:", err);
      setError(err.message || "Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <div className="formContainer">
        <h3>Create New Ticket</h3>
        <p>Required fields are marked with an asterisk*.</p>

        {error && <p className="error-message">{error}</p>}

        <form className="ticketForm" onSubmit={handleSubmit}>
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description of Issue*</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            maxLength={4000}
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Priority*</label>
          <div className="radioGroup">
            <label className="radioOption">
              <input
                type="radio"
                name="priority"
                value="Low"
                checked={formData.priority === "Low"}
                onChange={handleChange}
              />
              Low
            </label>
            <label className="radioOption">
              <input
                type="radio"
                name="priority"
                value="Medium"
                checked={formData.priority === "Medium"}
                onChange={handleChange}
              />
              Medium
            </label>
            <label className="radioOption">
              <input
                type="radio"
                name="priority"
                value="High"
                checked={formData.priority === "High"}
                onChange={handleChange}
              />
              High
            </label>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateTicket;
