import os
import pickle
import pandas as pd
from flask_cors import CORS
from datetime import timedelta
from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {
    "origins": ["http://localhost:3000", "http://127.0.0.1:3000"]
}})

# --- JWT config (set BEFORE init) ---
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=500)  # short expiry for tests
jwt = JWTManager(app)

# --- Clear 401s for bad/missing/expired tokens ---
@jwt.unauthorized_loader
def _missing_token(msg):
    return jsonify({"error": "Authorization required", "detail": msg}), 401

@jwt.invalid_token_loader
def _invalid_token(msg):
    return jsonify({"error": "Invalid token", "detail": msg}), 401

@jwt.expired_token_loader
def _expired_token(h, p):
    return jsonify({"error": "Token expired"}), 401

# --- Users & model ---
USERS = {"admin": "admin123", "dealer1": "pass123", "guest1": "guest123"}

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

EXPECTED = [
    "Year", "Present_Price", "Kms_Driven",
    "Fuel_Type", "Seller_Type", "Transmission",
    "Owner", "Car_Name"
]

# -------- Public --------
@app.get("/")
def health():
    return jsonify({"status": "ok", "message": "Login at /login to get a JWT token."})

@app.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    u, p = data.get("username", ""), data.get("password", "")
    if USERS.get(u) == p:
        token = create_access_token(identity=u, fresh=True)  # fresh token
        return jsonify({"access_token": token, "user": u})
    return jsonify({"error": "Invalid credentials"}), 401

# -------- Protected helpers --------
@app.get("/whoami")
@jwt_required()
def whoami():
    return jsonify({"user": get_jwt_identity()})

@app.get("/auth/validate")
@jwt_required()
def auth_validate():
    return jsonify({"ok": True, "user": get_jwt_identity()})

# -------- Predict (fresh token required) --------
@app.post("/predict")
@jwt_required(fresh=True)
def predict():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    payload = request.get_json(silent=False)
    records = payload if isinstance(payload, list) else [payload]

    missing = []
    for i, r in enumerate(records):
        miss = [c for c in EXPECTED if c not in r]
        if miss:
            missing.append({"index": i, "missing": miss})
    if missing:
        return jsonify({"error": "Missing required keys", "details": missing}), 400

    X = pd.DataFrame(records, columns=EXPECTED)
    preds = model.predict(X)
    preds = [round(float(p), 2) for p in preds]
    return jsonify({"count": len(preds), "predictions": preds, "unit": "Price in lakhs (INR)"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)