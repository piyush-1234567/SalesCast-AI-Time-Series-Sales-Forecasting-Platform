import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import API from "../../api";
import "./ResetPassword.css";

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await API.post("/reset-password", {
        token,
        new_password: password,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Password reset failed.");
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>

        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            minLength={8}
            required
          />
          <button type="submit" disabled={!token}>
            Reset Password →
          </button>
        </form>

        {message && <p className="reset-success">{message}</p>}
        {error && <p className="reset-error">{error}</p>}

        {!token && <p className="reset-error">Invalid or missing reset token.</p>}

        <Link to="/login">← Back to Login</Link>
      </div>
    </div>
  );
}

export default ResetPassword;