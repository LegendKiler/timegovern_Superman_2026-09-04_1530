from flask import Flask, request, jsonify
from flask_cors import CORS
from search import search_flights
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)


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
            trip=data.get('tripType', 'one-way'),
        )
        return jsonify({'success': True, 'count': len(flights), 'flights': flights})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/search-multi', methods=['POST'])
def search_multi():
    data = request.json or {}
    origin = data.get('origin', 'LHR').upper()
    destination = data.get('destination', 'JFK').upper()
    adults = int(data.get('adults', 1))
    cabin = data.get('cabin', 'economy')
    center_date = data.get('centerDate')
    days_around = int(data.get('daysAround', 3))

    results = []
    if center_date:
        center = datetime.strptime(center_date, '%Y-%m-%d')
        dates = [(center + timedelta(days=offset)).strftime('%Y-%m-%d')
                 for offset in range(-days_around, days_around + 1)]
    else:
        dates = data.get('dates', [])

    for d in dates:
        try:
            flights = search_flights(origin, destination, d, adults=adults, seat=cabin)
            cheapest = min(flights, key=lambda f: f['price']) if flights else None
            results.append({
                'date': d,
                'price': cheapest['price'] if cheapest else None,
                'airline': cheapest['airlines'][0] if cheapest and cheapest.get('airlines') else None,
            })
        except Exception as e:
            results.append({'date': d, 'price': None, 'error': str(e)})
    return jsonify({'success': True, 'results': results})


if __name__ == '__main__':
    print('Bridge running on http://localhost:5000')
    app.run(port=5000, host='0.0.0.0', debug=False)
