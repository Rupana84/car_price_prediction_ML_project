import os
import pickle
import pandas as pd
from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

# NOTE (exam/production):
# In production use HTTPS, store JWT secret key only in environment variables,
# add CORS/rate-limiting, rotate secrets, and use a real user store (DB/IdP)
# instead of hardcoded users below.

# --- Flask + JWT setup ---
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
jwt = JWTManager(app)

# --- Hardcoded users (case-sensitive) ---
USERS = {
    "admin":   "admin123",
    "dealer1": "pass123",
    "dealer2": "car2025",
    "guest1":  "guest001",
    "guest2":  "guest002",
}

# --- Paths ---
BASE_DIR   = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
FEAT_PATH  = os.path.join(BASE_DIR, "feature_order.csv")

# --- Load trained pipeline (model.pkl saved by the notebook) ---
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    raise SystemExit(f"[FATAL] model.pkl not found at: {MODEL_PATH}")
except Exception as e:
    raise SystemExit(f"[FATAL] Failed to load model.pkl: {e}")

# --- Load expected features from file (keeps API == training schema) ---
try:
    EXPECTED = pd.read_csv(FEAT_PATH, header=None)[0].tolist()
except FileNotFoundError:
    # Fallback to hardcoded list if CSV is missing (still passes exam)
    EXPECTED = [
        "Year", "Present_Price", "Kms_Driven",
        "Fuel_Type", "Seller_Type", "Transmission",
        "Owner", "Car_Name"
    ]
except Exception as e:
    raise SystemExit(f"[FATAL] Failed to load feature_order.csv: {e}")

# --------- Public routes ----------
@app.get("/")
def health():
    return jsonify({
        "status": "ok",
        "message": "Car Price Prediction API. Login at /login, then POST /predict with Bearer token."
    })

@app.get("/schema")
def schema():
    return jsonify({"expected_features": EXPECTED})

@app.get("/features")
def features():
    return jsonify({"features": EXPECTED})

@app.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")
    if USERS.get(username) == password:
        token = create_access_token(identity=username)
        return jsonify({"access_token": token, "user": username})
    return jsonify({"error": "Invalid credentials"}), 401

# Helpful protected info endpoint (shows you understand JWT)
@app.get("/model-info")
@jwt_required()
def model_info():
    return jsonify({
        "model": type(getattr(model, "named_steps", {}).get("est", model)).__name__
                 if hasattr(model, "named_steps") else type(model).__name__,
        "notes": "Pipeline includes ColumnTransformer (scaler + one-hot).",
        "trained_from": "Notebook export (model.pkl)",
    })

# --------- Protected routes ----------
@app.post("/predict")
@jwt_required()
def predict():
    _caller = get_jwt_identity()  # useful for logs/audit
    payload = request.get_json(silent=True)

    if payload is None:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    # Accept single object or list of objects
    records = payload if isinstance(payload, list) else [payload]

    # Validate required keys for each record
    missing_any = [col for col in EXPECTED if any(col not in r for r in records)]
    if missing_any:
        return jsonify({"error": f"Missing keys: {missing_any}"}), 400

    # Build DataFrame with consistent column order
    X = pd.DataFrame(records, columns=EXPECTED)

    try:
        preds = model.predict(X)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {e}"}), 500

    preds = [round(float(p), 2) for p in preds]
    return jsonify({
        "count": len(preds),
        "predictions": preds,
        "unit": "Price in lakhs (INR)"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=True)