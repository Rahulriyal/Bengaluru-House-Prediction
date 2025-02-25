from flask import Flask, request, jsonify
from flask import send_from_directory
from flask_cors import CORS
import pickle
import json

app = Flask(__name__)
CORS(app)

try:
    model = pickle.load(open('banglore_home_prices_model.pkl', 'rb'))
except Exception as e:
    print("Error loading model:", e)
    model = None  # Ensure model is None if loading fails

columns = json.load(open('columns.json', 'r'))['data_columns']

@app.route('/api/get_location_names', methods=['GET'])
def get_location_names():
    locations = columns[3:]  # Skip first 3 columns (sqft, bath, bhk)
    return jsonify({'locations': locations})

@app.route('/api/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.json
    total_sqft = float(data['total_sqft'])
    bhk = int(data['bhk'])
    bath = int(data['bath'])
    location = data['location']

    # Prepare input vector
    loc_index = columns.index(location.lower())
    input_vector = [0] * len(columns)
    input_vector[0] = total_sqft
    input_vector[1] = bath
    input_vector[2] = bhk
    if loc_index >= 0:
        input_vector[loc_index] = 1

    # Predict
    price = model.predict([input_vector])[0]
    return jsonify({'estimated_price': round(price, 2)})

@app.route('/')
def home():
    return send_from_directory('.', 'app.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)