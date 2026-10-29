import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await API.post("/forgot-password", null, {
        params: { email },
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Forgot Password?</h2>
        <p>Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <button type="submit">Send Reset Link →</button>
        </form>

        {message && <p className="forgot-success">{message}</p>}
        {error && <p className="forgot-error">{error}</p>}

        <Link to="/login" className="forgot-back">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;