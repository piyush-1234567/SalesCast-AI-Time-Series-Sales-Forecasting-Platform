import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


function Dashboard() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");
    const [chartData, setChartData] = useState([]);
    const [username, setUsername] = useState("");
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState([
        ["💰", "Total Sales", "—", "Uploaded data"],
        ["📊", "Average Sales", "—", "Uploaded data"],
        ["📈", "Highest Sale", "—", "Uploaded data"],
        ["📋", "Total Records", "—", "Uploaded data"],
    ]);
    const [showForecast, setShowForecast] = useState(false);
    const navigate = useNavigate();
    const handleAnalyze = async () => {
        if (!file) {
            setMessage("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        if (!salesColumn) {
            setMessage("Please select a sales column");
            return;
        }
        formData.append("sales_column", salesColumn);
        try {
            const response = await API.post("/analyze", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setResult(response.data);
            setChartData(response.data.chart_data);
            setStats([
                ["💰", "Total Sales", `₹${response.data.total_sales}`, "Calculated"],
                ["📊", "Average Sales", `₹${response.data.average_sales}`, "Calculated"],
                ["📈", "Highest Sale", `₹${response.data.highest_sale}`, "Calculated"],
                ["📋", "Total Records", response.data.records, "Analyzed"],
            ]);
            setMessage("Analysis successful!");
        } catch (error) {
            setMessage(error.response?.data?.detail || "Analysis failed");
        }
    };
    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    };
    const [columns, setColumns] = useState([]);
    const [salesColumn, setSalesColumn] = useState("");

const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setColumns([]);
    setSalesColumn("");

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const response = await API.post("/upload", formData);
        setColumns(response.data.columns);
        setMessage("File uploaded successfully!");
    } catch (error) {
        setMessage(error.response?.data?.detail || "Upload failed");
    }
};
useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    API.get("/profile", { headers })
        .then(res => setUsername(res.data.name))
        .catch(console.error);

    API.get("/projects", { headers })
        .then(res => setProjects(res.data))
        .catch(console.error);
}, []);
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>SalesCast <span>AI</span></h2>
        <nav>
          <a className="active" href="#overview">⌂ Dashboard</a>
          <a href="#upload">▤ Upload Data</a>
          <a href="#forecast">▥ Forecast</a>
          <a href="#models">⚗ Compare Models</a>
          <a href="#insights">♧ Insights</a>
          <a href="#projects">▱ Projects</a>
          
        </nav>
        <button className="logout" onClick={handleLogout}>
        ↪ Logout
        </button>
      </aside>

      <main className="dashboard-main" id="overview">
        <header className="dashboard-header">
          <input placeholder="Search projects, datasets..." />
          <span>🔔 &nbsp; {username || "Loading..."} ▾</span>
        </header>

        <section className="dashboard-welcome">
          <h1>Welcome back! 👋</h1>
          <p>Upload your data, analyze trends, and forecast sales with AI.</p>
        </section>

        <section className="stats-grid">
          {stats.map(([icon, title, value, note]) => (
            <article className="stat-box" key={title}>
              <span>{icon}</span>
              <div><p>{title}</p><h2>{value}</h2><small>{note}</small></div>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel" id="forecast">
            <h2>Sales Forecast</h2>
            <p>Historical sales and future predictions</p>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="record" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#6366f1" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {showForecast && result?.forecasts && (
                <div>
                    <h3>Future Sales Forecast</h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={[0, 1, 2].map((i) => ({
                        period: result.forecast_months?.[i] || `Period ${i + 1}`,
                        linear: result.forecasts["Linear Regression"][i],
                        forest: result.forecasts["Random Forest"][i],
                        xgboost: result.forecasts["XGBoost"][i],
                        }))}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Line dataKey="linear" name="Linear Regression" stroke="#6366f1" />
                        <Line dataKey="forest" name="Random Forest" stroke="#16a34a" />
                        <Line dataKey="xgboost" name="XGBoost" stroke="#ea580c" />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                )}
          </article>

          <article className="panel" id="models">
            <h2>Model Comparison</h2>
            <p>Compare machine learning models</p>
            <table>
                <thead>
                    <tr>
                    <th>Model</th>
                    <th>MAE</th>
                    <th>RMSE</th>
                    </tr>
                </thead>
                <tbody>
                    {result?.model_comparison?.map((model) => (
                    <tr key={model.model}>
                        <td>{model.model}</td>
                        <td>{model.mae}</td>
                        <td>{model.rmse}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

                {result?.best_model && (
                <p>🏆 Best Model: {result.best_model}</p>
                )}
          </article>
        </section>

        <section className="dashboard-grid lower-grid">
          <article className="panel" id="upload">
            <h2>Upload Sales Data</h2>
            <p>Upload your CSV or Excel file to get started.</p>
            <label className="upload-area">
              <span>☁️</span>
              <p>Choose a CSV or Excel file</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
            />
                
            </label>
            <select
                value={salesColumn}
                onChange={(e) => setSalesColumn(e.target.value)}
                >
                <option value="">Select sales column</option>
                {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                ))}
                </select>
            <button className="dashboard-btn" onClick={handleAnalyze}>
                Analyze Data
            </button>
            {message && <p>{message}</p>}

            {result && (
                <div className="upload-results" id="insights-results">
                    <h3>Sales Analysis</h3>
                    <p>Total Sales: ₹{result.total_sales}</p>
                    <p>Average Sales: ₹{result.average_sales}</p>
                    <p>Highest Sale: ₹{result.highest_sale}</p>
                    <p>Total Records: {result.records}</p>
                    <hr />
                        <h3> Sales Insights</h3>

                        <p>
                         Trend: {
                            chartData.length > 1
                            ? chartData[chartData.length - 1].sales > chartData[0].sales
                                ? "Sales are increasing"
                                : chartData[chartData.length - 1].sales < chartData[0].sales
                                ? "Sales are decreasing"
                                : "Sales are stable"
                            : "Insufficient data"
                        }
                        </p>

                        <p>
                         Highest sale: Record {
                            chartData.reduce((max, item) =>
                            item.sales > max.sales ? item : max
                            , chartData[0])?.record
                        }
                        </p>

                        <p>
                         Lowest sale: Record {
                            chartData.reduce((min, item) =>
                            item.sales < min.sales ? item : min
                            , chartData[0])?.record
                        }
                        </p>
                </div>
            )}
          </article>

          <article className="panel" id="projects">
                <h2>Recent Projects</h2>
                {projects.length ? projects.map(project => (
                    <p key={project.id}>{project.name}</p>
                )) : <p>No projects yet.</p>}
          </article>

          <article className="panel" id="insights">
            <h2>Quick Actions</h2>
            <button
                className="dashboard-btn"
                onClick={() => setShowForecast(true)}
                disabled={!result?.forecasts}
                >
                Run Forecast
            </button>
            <button
                className="dashboard-btn"
                onClick={() => document.getElementById("models")?.scrollIntoView({ behavior: "smooth" })}
                >
                Compare Models
            </button>
            <button
                className="dashboard-btn"
                onClick={() => document.getElementById("insights-results")?.scrollIntoView({ behavior: "smooth" })}
                >
                View Insights
            </button>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;