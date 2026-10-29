import "./Login.css";
import { useState } from "react";
import API from "../../api";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/login", { email, password });
            localStorage.setItem("token", response.data.access_token);
            navigate("/dashboard");
        } catch (error) {
            setMessage(error.response?.data?.detail || "Login failed");
        }
    };
  return (
    <div className="login-page">
      <nav className="login-navbar">
        <Link to="/" className="login-logo">SalesCast <span>AI</span></Link>
        <div>
          <Link to="/" className="login-nav-link">Home</Link>
          <Link to="/signup" className="login-nav-button">Sign Up ↗</Link>
        </div>
      </nav>

      <main className="login-container">
        <section className="login-info">
          <span className="login-tag">WELCOME BACK</span>
          <h1>Sign in to<br />SalesCast <span>AI</span></h1>
          <p>Continue your journey to smarter sales forecasting with AI-powered insights.</p>

          <div className="login-benefit">📊 <div><strong>Access your saved projects</strong><p>Continue where you left off</p></div></div>
          <div className="login-benefit">🧠 <div><strong>Analyze and compare models</strong><p>Get better insights, faster</p></div></div>
          <div className="login-benefit">🛡️ <div><strong>Secure and private</strong><p>Your data is always protected</p></div></div>
        </section>

        <section className="login-card">
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to your account to continue.</p>

          <form onSubmit={handleLogin}>
            <label>Email address</label>
            <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required />

            <label>Password</label>
            <input type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" required />
            <div className="forgot-password-link">
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            {message && <p>{message}</p>}
            <button type="submit">Sign In →</button>
        </form>

          <div className="login-divider">OR CONTINUE WITH</div>
          <div className="social-login">
            <button type="button" onClick={() => alert("Google login will be added later")}>🌐 Google</button>
            <button type="button" onClick={() => alert("GitHub login will be added later")}>◉ GitHub</button>
          </div>

          <p className="login-register">Don't have an account? <Link to="/signup">Sign up</Link></p>
        </section>
      </main>
    </div>
  );
}

export default Login;