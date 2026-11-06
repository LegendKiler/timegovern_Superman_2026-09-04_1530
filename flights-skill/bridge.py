from flask import Flask, request, jsonify
from flask_cors import CORS
from search import search_flights
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'timegovern-flights'})

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
        if not flights:
            return jsonify({
                'success': False, 
                'limit_reached': True,
                'error': 'Live data temporarily unavailable',
                'message': 'We are experiencing high demand. Live flight prices are temporarily paused to protect our systems. Please check back later, or book directly on Google Flights below.'
            }), 429
        return jsonify({'success': True, 'count': len(flights), 'flights': flights})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
