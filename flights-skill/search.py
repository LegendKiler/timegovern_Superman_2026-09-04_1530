import json
import sys
from fast_flights import FlightQuery, Passengers, create_query, get_flights

def search_flights(origin, destination, date, return_date=None, adults=1, children=0, infants=0, seat='economy', trip='one-way', proxy_url=None):
    _stdout = sys.stdout
    sys.stdout = sys.stderr
    try:
        flights_args = [FlightQuery(date=date, from_airport=origin, to_airport=destination)]
        if trip == 'round-trip' and return_date:
            flights_args.append(FlightQuery(date=return_date, from_airport=destination, to_airport=origin))

        query = create_query(
            flights=flights_args,
            seat=seat,
            trip=trip,
            passengers=Passengers(adults=adults, children=children, infants_in_seat=0, infants_on_lap=infants),
        )
        
        # Pass the proxy URL directly to fast-flights (primp)
        results = get_flights(query, proxy=proxy_url)
    finally:
        sys.stdout = _stdout

    output = []
    for flight in results:
        segments = []
        for seg in (flight.flights or []):
            segments.append({
                'from': {'code': seg.from_airport.code, 'name': seg.from_airport.name},
                'to': {'code': seg.to_airport.code, 'name': seg.to_airport.name},
                'departure': {
                    'date': f"{seg.departure.date[0]}-{seg.departure.date[1]:02d}-{seg.departure.date[2]:02d}",
                    'time': f"{seg.departure.time[0]:02d}:{seg.departure.time[1]:02d}",
                },
                'arrival': {
                    'date': f"{seg.arrival.date[0]}-{seg.arrival.date[1]:02d}-{seg.arrival.date[2]:02d}",
                    'time': f"{seg.arrival.time[0]:02d}:{seg.arrival.time[1]:02d}",
                },
                'duration_min': seg.duration,
                'plane': seg.plane_type,
            })
        output.append({
            'price': flight.price,
            'airlines': flight.airlines,
            'type': flight.type,
            'segments': segments,
            'stops': len(segments) - 1,
        })
    return output

if __name__ == '__main__':
    try:
        flights = search_flights(sys.argv[1].upper(), sys.argv[2].upper(), sys.argv[3])
        print(json.dumps({'success': True, 'count': len(flights), 'flights': flights}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
        sys.exit(1)
