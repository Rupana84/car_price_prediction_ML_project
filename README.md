#  Car Price Prediction Project

This is a beginner full-stack project that predicts car prices using machine learning.  
The backend is made with **Flask** and the frontend with **React**.  
It allows users to **log in**, **get an authentication token**, and **predict car prices** based on input details.

---

##  Project Structure

car_price_prediction_ML_project/
├─ backend/
│  ├─ app.py
│  ├─ model.pkl
│  ├─ feature_order.csv
│  ├─ car_prediction_data.csv
│  ├─ requirements.txt
│  └─ (optional) .flaskenv / .env
├─ frontend/
   ├─ package.json
   ├─ public/ (index.html, etc.)
   ├─ src/
   │  ├─ App.js
   │  ├─ style.css
   │  └─ component/
   │     ├─ AuthCard.js
   │     ├─ PredictCard.js
   │     └─ Toast.js
   └─ .env

---

##  How to Run Backend (Flask)

1. Go to the backend folder  
   ```bash
   cd backend

2.	Create a virtual environment
    python -m venv venv
    source venv/bin/activate        # on Windows: venv\Scripts\activate

3.	Install the requirements

  	pip install -r requirements.txt

4.	Start the Flask server

    python app.py

    Flask will run on http://127.0.0.1:5000

##  How to Run Frontend (React)
	
1.	Go to the frontend folder

    cd frontend

2.	Install dependencies

    npm install

3.	Create a file called .env inside the frontend folder and add:

  	REACT_APP_API_BASE=http://127.0.0.1:5000

	4.	Start React

      npm start

      It will open on http://localhost:3000

##   Test Login Accounts

  Username                 Password
  admin                     admin123                    
  dealer1                   pass123
  guest1                    guest123

##   Example Input for Prediction


      {
  "Year": 2017,
  "Present_Price": 9.5,
  "Kms_Driven": 42000,
  "Fuel_Type": "Petrol",
  "Seller_Type": "Dealer",
  "Transmission": "Manual",
  "Owner": 0,
  "Car_Name": "TATA"
}


##    Technologies Used

  
	    •	Python, Flask
	    •	React, Node.js
	    •	Pandas, scikit-learn
	    •	Flask-JWT-Extended (for authentication)


##     Author

Gurpreet Singh Rupana
Student Developer – Full Stack & Machine Learning
GitHub: Rupana84


