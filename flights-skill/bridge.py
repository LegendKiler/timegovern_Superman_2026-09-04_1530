from flask import Flask, request, jsonify
from flask_cors import CORS
from search import search_flights
import traceback

app = Flask(__name__)
# Allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'timegovern-flights'})

@app.route('/', methods=['GET'])
def root():
    return jsonify({'status': 'ok', 'message': 'TimeGovern Flights Bridge is running'})

# Add search-multi to prevent CORS 404 errors
@app.route('/search-multi', methods=['POST', 'OPTIONS'])
def search_multi():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    return search()

@app.route('/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.json or {}
    try:
        # Try calling your search function
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
        # Return the exact error so we can see it in the browser network tab!
        error_details = traceback.format_exc()
        print(error_details)
        return jsonify({'success': False, 'error': str(e), 'traceback': error_details}), 500

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
