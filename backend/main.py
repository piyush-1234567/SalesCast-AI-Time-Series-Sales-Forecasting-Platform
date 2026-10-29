from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import engine
from models import Base, User, Project
from schemas import UserCreate, UserLogin, UserResetPassword
from auth import hash_password, verify_password, create_access_token
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np
import pandas as pd
from fastapi import UploadFile, File,Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import verify_access_token
from auth import create_reset_token
from email_service import send_reset_email
from auth import verify_reset_token

app = FastAPI(title="SalesCast AI")
security = HTTPBearer()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://sales-cast-ai-time-series-sales-for.vercel.app"
    ]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@app.get("/profile")
def get_profile(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    email = verify_access_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"name": user.name, "email": user.email}
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "Account created successfully"}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user or not verify_password(
        user.password, existing_user.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(existing_user.email)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/projects")
def get_projects(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    email = verify_access_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    projects = db.query(Project).filter(
        Project.user_id == user.id
    ).order_by(Project.id.desc()).all()

    return [
        {
            "id": p.id,
            "name": p.name,
            "filename": p.filename,
            "results": p.results
        }
        for p in projects
    ]


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        elif file.filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(400, "Upload CSV or Excel files")

        return {
            "filename": file.filename,
            "rows": len(df),
            "columns": list(df.columns),
            "preview": df.head(5).to_dict(orient="records")
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(400, "Unable to read file")
    finally:
        await file.close()


@app.post("/analyze")
async def analyze_file(
    file: UploadFile = File(...),
    sales_column: str = Form(...),
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        email = verify_access_token(credentials.credentials)
        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        elif file.filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(400, "Upload CSV or Excel files")

        if sales_column not in df.columns:
            raise HTTPException(400, "Selected column not found")

        sales = pd.to_numeric(
            df[sales_column], errors="coerce"
        ).dropna().reset_index(drop=True)

        if len(sales) < 5:
            raise HTTPException(400, "At least 5 valid numeric values are required")

        values = sales.to_numpy(dtype=float)
        X = np.arange(len(values)).reshape(-1, 1)
        y = values

        split = max(2, int(len(values) * 0.8))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        models = {
            "Linear Regression": LinearRegression(),
            "Random Forest": RandomForestRegressor(
                n_estimators=100, random_state=42
            ),
            "XGBoost": XGBRegressor(
                n_estimators=100,
                max_depth=3,
                learning_rate=0.05,
                objective="reg:squarederror",
                random_state=42
            )
        }

        comparison = []
        forecasts = {}
        future_X = np.arange(len(values), len(values) + 3).reshape(-1, 1)
        best_model = None
        best_mae = float("inf")

        for name, model in models.items():
            model.fit(X_train, y_train)
            predictions = model.predict(X_test)

            mae = mean_absolute_error(y_test, predictions)
            rmse = np.sqrt(mean_squared_error(y_test, predictions))

            comparison.append({
                "model": name,
                "mae": round(float(mae), 2),
                "rmse": round(float(rmse), 2)
            })

            if mae < best_mae:
                best_mae = mae
                best_model = name

            model.fit(X, y)
            forecasts[name] = [
                round(float(v), 2) for v in model.predict(future_X)
            ]

        chart_data = [
            {"record": i + 1, "sales": round(float(v), 2)}
            for i, v in enumerate(values)
        ]

        months = (
            df["Month"].dropna().astype(str).tolist()[-len(values):]
            if "Month" in df.columns else []
        )

        future_months = []
        if months:
            last_month = pd.to_datetime(months[-1], errors="coerce")
            if pd.notna(last_month):
                future_months = [
                    (last_month + pd.DateOffset(months=i)).strftime("%b %Y")
                    for i in range(1, 4)
                ]

        result = {
            "total_sales": round(float(values.sum()), 2),
            "average_sales": round(float(values.mean()), 2),
            "highest_sale": round(float(values.max()), 2),
            "records": len(values),
            "chart_data": chart_data,
            "model_comparison": comparison,
            "best_model": best_model,
            "forecast_months": future_months,
            "forecasts": forecasts
        }

        project = Project(
            name=file.filename,
            filename=file.filename,
            results=result,
            user_id=user.id
        )
        db.add(project)
        db.commit()

        result["project_id"] = project.id
        return result

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(400, f"Unable to analyze file: {str(e)}")
    finally:
        await file.close()

@app.post("/forgot-password")
async def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if user:
        token = create_reset_token(email)
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        await send_reset_email(email, reset_link)

    return {"message": "If the account exists, a reset email will be sent."}


@app.post("/reset-password")
def reset_password(
    data: UserResetPassword,
    db: Session = Depends(get_db)
):
    email = verify_reset_token(data.token)

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link"
        )

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password reset successfully"}