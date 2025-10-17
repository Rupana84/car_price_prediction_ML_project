import React from "react";

export default function PredictCard({ form, setForm, doPredict, pred, token, loading }) {
  return (
    <form onSubmit={doPredict} className="card">
      <h3 className="card-title">2) Predict (requires valid token)</h3>

      <div className="grid-2">
        {Object.entries(form).map(([key, value]) => (
          key === "Fuel_Type" || key === "Seller_Type" || key === "Transmission" ? (
            <div key={key} className="field">
              <label>{key}</label>
              <select
                value={value}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              >
                {key === "Fuel_Type" && (
                  <>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                  </>
                )}
                {key === "Seller_Type" && (
                  <>
                    <option>Dealer</option>
                    <option>Individual</option>
                  </>
                )}
                {key === "Transmission" && (
                  <>
                    <option>Manual</option>
                    <option>Automatic</option>
                  </>
                )}
              </select>
            </div>
          ) : (
            <div key={key} className="field">
              <label>{key}</label>
              <input
                type={typeof value === "number" ? "number" : "text"}
                value={value}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]: typeof value === "number" ? +e.target.value : e.target.value,
                  })
                }
              />
            </div>
          )
        ))}
      </div>

      <div className="row">
        <button type="submit" disabled={!token || loading}>
          {loading ? "Working…" : "Predict"}
        </button>
      </div>

      {pred && (
        <pre className="result">
{JSON.stringify(pred, null, 2)}
        </pre>
      )}
    </form>
  );
}