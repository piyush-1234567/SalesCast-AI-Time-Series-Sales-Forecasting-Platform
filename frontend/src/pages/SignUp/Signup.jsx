import "./Signup.css";
import { useState } from "react";
import API from "../../api";
function Signup() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const response = await API.post("/signup", {
                name: fullName,
                email,
                password
            });
            setMessage(response.data.message);
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            setMessage(error.response?.data?.detail || "Signup failed");
        }
    };
  return (
    <div className="signup-page">
      <nav className="signup-navbar">
        <h2>SalesCast <span>AI</span></h2>
        <a href="/">← Back to Home</a>
      </nav>

      <main className="signup-container">
        <section className="signup-info">
          <span className="signup-tag">SMARTER FORECASTING STARTS HERE</span>
          <h1>Make your next<br />business move<br /><span>your best one.</span></h1>
          <p>Create your account and turn sales data into confident decisions.</p>

          <div className="signup-benefit">✓ AI-powered sales forecasting</div>
          <div className="signup-benefit">✓ Interactive insights and reports</div>
          <div className="signup-benefit">✓ Secure data management</div>
        </section>

        <section className="signup-card">
          <h2>Create your account</h2>
          <p className="signup-subtitle">Start forecasting smarter today.</p>

          <form onSubmit={handleSignup}>
            <label>Full name</label>
            <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
            />
            <label>Email address</label>
            <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label>Password</label>
            <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
            />

            <label>Confirm password</label>
            <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
            />

            <button type="submit" className="signup-submit">Create Account →</button>
          </form>
          {message && <p>{message}</p>}

          <p className="signup-login">
            Already have an account? <a href="/login">Log in</a>
          </p>
          <p className="signup-terms">By signing up, you agree to our Terms of Service and Privacy Policy.</p>
        </section>
      </main>
    </div>
  );
}

export default Signup;