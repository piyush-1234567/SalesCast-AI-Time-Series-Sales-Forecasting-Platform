# 📊 SalesCast AI — Time Series Sales Forecasting Platform

SalesCast AI is a machine learning-powered web application that analyzes historical sales data, compares multiple regression models, and forecasts future sales. It helps users understand sales trends and evaluate model performance through an interactive dashboard.

## 🚀 Live Demo

- **Frontend:** https://sales-cast-ai-time-series-sales-for.vercel.app/
- **Backend API:** https://salescast-ai-time-series-sales.onrender.com
- **API Documentation:** https://salescast-ai-time-series-sales.onrender.com/docs

## ✨ Features

- **User Authentication:** Signup, login, and password reset functionality.
- **Dataset Upload:** Upload sales datasets in CSV and Excel formats.
- **Sales Analysis:** Calculate total sales, average sales, highest sale, and number of records.
- **Machine Learning Models:** Train and compare Linear Regression, Random Forest, and XGBoost.
- **Model Evaluation:** Compare models using Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE).
- **Sales Forecasting:** Generate predictions for the next three periods.
- **Model Comparison:** Identify the model with the lowest MAE.
- **Interactive Dashboard:** Visualize historical sales data and forecast results.
- **Project History:** Save and revisit previous analysis results.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- SQLAlchemy

### Machine Learning & Data Processing
- Pandas
- NumPy
- Scikit-learn
- XGBoost

### Database
- PostgreSQL
- Neon PostgreSQL

### Deployment
- Vercel — Frontend
- Render — Backend

## 🧠 Machine Learning Models

SalesCast AI compares three regression algorithms:

| Model | Purpose |
|---|---|
| Linear Regression | Models a linear relationship between time and sales. |
| Random Forest Regressor | Combines multiple decision trees to generate predictions. |
| XGBoost Regressor | Uses gradient boosting to learn predictive patterns. |

### Evaluation Metrics

- **MAE (Mean Absolute Error):** Measures the average absolute difference between actual and predicted sales.
- **RMSE (Root Mean Squared Error):** Measures prediction error while penalizing larger errors more heavily.

The application selects the model with the lowest MAE as the best-performing model among those evaluated.

## ⚙️ How It Works

1. Create an account and log in.
2. Upload a sales dataset in CSV or Excel format.
3. Select the column containing sales values.
4. Analyze historical sales data.
5. Split the data into training and testing sets.
6. Train and evaluate the three machine learning models.
7. Compare their MAE and RMSE scores.
8. Select the model with the lowest MAE.
9. Generate forecasts for the next three periods.
10. Save and revisit analysis results through project history.

## 📁 Project Structure

```text
SalesCast-AI/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── email_service.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
├── docs/
├── project.md
└── README.md
```

*The structure above represents the expected organization; adjust filenames to match your repository.*

## 💻 Local Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/piyush-1234567/SalesCast-AI-Time-Series-Sales-Forecasting-Platform.git
cd SalesCast-AI-Time-Series-Sales-Forecasting-Platform
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the backend directory and configure the required environment variables:

```env
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5173
SMTP_SERVER=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_LOGIN=your_smtp_login
SMTP_PASSWORD=your_smtp_password
```

Use your own credentials. Never commit real secrets or `.env` files to GitHub.

Start the backend:

```bash
uvicorn main:app --reload
```

Backend API: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a frontend `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📈 Model Evaluation Example

The following results illustrate how the models can be compared. Actual results depend on the uploaded dataset.

| Model | MAE | RMSE |
|---|---:|---:|
| Linear Regression | 52,912.59 | 62,601.45 |
| Random Forest | 65,981.67 | 90,877.48 |
| XGBoost | 92,234.48 | 111,410.66 |

**Best Model: Linear Regression**

These values are dataset-dependent and represent prediction errors in the same units as the sales data.

## ⚠️ Current Limitations

- Forecasts are generated for the next three periods.
- The current implementation uses row positions as the time variable.
- Chronological ordering of the uploaded dataset is important.
- Missing or non-numeric sales values are excluded.
- Model performance depends on dataset quality, size, and patterns.
- The best model is selected using MAE on the test set; performance may differ on unseen future data.

## 🔮 Future Improvements

- Automatic date-column detection and time-series validation.
- Improved handling of missing values and outliers.
- Seasonality-aware forecasting models.
- Additional evaluation metrics, including MAPE where appropriate.
- Customizable forecast horizons.
- Downloadable reports and forecast results.
- Enhanced data visualization and model explainability.

## 👨‍💻 Author

**Piyush Jain**

GitHub: [piyush-1234567](https://github.com/piyush-1234567)

---

⭐ If you find this project useful, consider giving the repository a star.