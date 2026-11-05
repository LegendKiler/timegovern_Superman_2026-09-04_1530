from flask import Flask, request, jsonify
from flask_cors import CORS
from search import search_flights

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'timegovern-flights'})

@app.route('/', methods=['GET'])
def root():
    return jsonify({'status': 'ok', 'message': 'TimeGovern Flights Bridge is running'})

@app.route('/search', methods=['POST'])
def search():
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
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
