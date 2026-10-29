import "./Home.css";
import { Link } from "react-router-dom";

const features = [
  { icon: "📁", title: "Easy Data Upload", text: "Upload your sales data in CSV or Excel format." },
  { icon: "📈", title: "Analyze Trends", text: "Discover sales patterns and seasonal insights." },
  { icon: "🤖", title: "Compare ML Models", text: "Evaluate multiple models using accuracy metrics." },
  { icon: "🎯", title: "Forecast Sales", text: "Predict future sales to make smarter decisions." },
];

function Home() {
  return (
    <div className="home">
      <nav className="navbar">
        <a className="logo" href="/">SalesCast<span> AI</span></a>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="login-btn">Login</Link>
          <Link  to="/signup" className="signup-btn">Sign Up ↗</Link>
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">✦ SMARTER SALES WITH AI</span>
            <h1>Predict Sales.<br />Make <span>Smarter</span><br />Business Decisions.</h1>
            <p>Turn your historical sales data into powerful forecasts. Analyze trends, compare machine learning models, and plan confidently.</p>
            <div className="hero-buttons">
              <Link to="/signup" className="primary-btn">Get Started <span>↗</span></Link>
              <a className="demo-btn" href="#how-it-works">▷ &nbsp; How It Works</a>
            </div>
            <div className="hero-points">
              <span>✓ Easy data upload</span>
              <span>✓ Multiple ML models</span>
              <span>✓ Interactive insights</span>
            </div>
          </div>

          <div className="dashboard-preview">
            <div className="preview-top">
              <div><span className="live-dot"></span> Sales Overview <small>LIVE PREVIEW</small></div>
              <span className="period">Last 12 months⌄</span>
            </div>
            <div className="stat-grid">
              <div className="stat-card"><small>Total Sales</small><h3>₹8.42L</h3><span>↗ 12.8%</span></div>
              <div className="stat-card"><small>Forecast Growth</small><h3>+18.6%</h3><span>↗ Positive</span></div>
            </div>
            <div className="chart-card">
              <div className="chart-heading"><strong>Sales Forecast</strong><span>Historical · Predicted</span></div>
              <div className="chart">
                <div className="chart-y"><span>80k</span><span>60k</span><span>40k</span><span>20k</span></div>
                <svg viewBox="0 0 400 150" preserveAspectRatio="none" role="img" aria-label="Illustrative sales forecast line chart">
                  <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ed8b45" stopOpacity=".25"/><stop offset="100%" stopColor="#ed8b45" stopOpacity="0"/></linearGradient></defs>
                  {[20,55,90,125].map(y=><line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#e9e8df" strokeDasharray="4 4"/>)}
                  <path d="M0 120 L35 105 L70 113 L105 75 L140 88 L175 57 L210 70 L245 38 L280 50 L315 25 L350 35 L400 8 L400 150 L0 150Z" fill="url(#chartFill)"/>
                  <path d="M0 120 L35 105 L70 113 L105 75 L140 88 L175 57 L210 70 L245 38 L280 50 L315 25" fill="none" stroke="#245b43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M315 25 L350 35 L400 8" fill="none" stroke="#ed8b45" strokeWidth="3" strokeDasharray="6 5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="chart-months"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dec</span></div>
            </div>
            <div className="model-row"><span>🏆 Best model</span><strong>XGBoost</strong><span className="accuracy">92.4% accuracy*</span></div>
          </div>
          <div className="hero-decoration decoration-one"></div>
          <div className="hero-decoration decoration-two"></div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="eyebrow">BUILT FOR BETTER DECISIONS</span>
            <h2>Everything you need to <span>forecast smarter.</span></h2>
            <p>From raw data to actionable predictions, all in one place.</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <article className={`feature-card feature-${index + 1}`} key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <span className="feature-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section" id="how-it-works">
          <span className="eyebrow">SIMPLE WORKFLOW</span>
          <h2>Your data in. <span>Clear insights out.</span></h2>
          <p>Upload your dataset, compare models, and generate forecasts in a few simple steps.</p>
        </section>
      </main>

      <footer id="about">
        <a className="logo" href="/">SalesCast<span> AI</span></a>
        <p>Smarter forecasting starts here.</p>
        <small>© {new Date().getFullYear()} SalesCast AI</small>
      </footer>
    </div>
  );
}

export default Home;