// src/components/Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { useTickets } from "../TicketsContext"; // ✅ import context

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useTickets(); // ✅ use context function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Call backend API
      const response = await fetch(
        "https://csci441-group-project.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      // If server returns an error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      // ✅ Parse success response
      const data = await response.json();
      console.log("Login success:", data);

      // Example expected structure:
      // { token: "...", user: { id, email, name, role } }

      // ✅ Save token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Update global context
      setCurrentUser(data.user);

      // ✅ Redirect based on role
      const role = data.user?.role?.toLowerCase();
      if (role === "admin") navigate("/admin");
      else if (role === "agent") navigate("/agent");
      else navigate("/home");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Welcome back</h2>
        <p>Login with your QuickTix credentials</p>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          placeholder="you@example.com"
          required
        />

        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          placeholder="••••••••"
          required
        />

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="reset-link">
          Forgot your password?{" "}
          <Link to="/reset">Reset it</Link>
        </p>

        <p className="sign-up">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
