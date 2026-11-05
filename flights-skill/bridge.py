from flask import Flask, request, jsonify
from flask_cors import CORS
from search import search_flights
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Mock data for fallback
MOCK_FLIGHTS = [
    {
        "name": "British Airways",
        "airlines": ["British Airways"],
        "price": 450,
        "legs": [
            {"duration": 360, "departure_airport": "LHR", "arrival_airport": "JFK"}
        ]
    },
    {
        "name": "Virgin Atlantic",
        "airlines": ["Virgin Atlantic"],
        "price": 480,
        "legs": [
            {"duration": 380, "departure_airport": "LHR", "arrival_airport": "JFK"}
        ]
    }
]

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'timegovern-flights'})

@app.route('/search-multi', methods=['POST', 'OPTIONS'])
def search_multi():
    if request.method == 'OPTIONS': return jsonify({}), 200
    return search()

@app.route('/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS': return jsonify({}), 200
        
    data = request.json or {}
    try:
        flights = search_flights(
            origin=data.get('origin', 'LHR').upper(),
            destination=data.get('destination', 'JFK').upper(),
            date=data.get('date', '2027-01-15'),
            return_date=data.get('returnDate'),
            adults=int(data.get('adults', 1)),
            children=int(data.get('children', 0)),
            infants=int(data.get('infants', 0)),
            seat=data.get('cabin', 'economy'),
            trip=data.get('tripType', 'one-way')
        )
        return jsonify({'success': True, 'count': len(flights), 'flights': flights})
    except Exception as e:
        print("SEARCH FAILED - FALLING BACK TO MOCK DATA")
        print(traceback.format_exc())
        # Return mock data instead of a 500 error
        return jsonify({'success': True, 'count': len(MOCK_FLIGHTS), 'flights': MOCK_FLIGHTS, 'is_demo': True})

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
