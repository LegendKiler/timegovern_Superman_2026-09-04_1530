import os
import time
import hashlib
import requests
from fast_flights import FlightQuery, Passengers, create_query, get_flights

RAPIDAPI_KEY = os.environ.get("RAPIDAPI_KEY")
RAPIDAPI_HOST = "sky-scrapper.p.rapidapi.com"
CACHE_TTL = 3600 * 6

_cache = {}

def _get_cache_key(params):
    key_str = f"{params['origin']}-{params['destination']}-{params['date']}-{params['adults']}"
    return hashlib.md5(key_str.encode()).hexdigest()

def _fetch_from_rapidapi(params):
    if not RAPIDAPI_KEY:
        print("❌ RapidAPI Error: RAPIDAPI_KEY environment variable is missing.")
        return None
    
    sky_map = {"LHR": "LOND", "JFK": "NYCA", "LAX": "LAXA"}
    origin_id = sky_map.get(params['origin'].upper(), params['origin'].upper())
    dest_id = sky_map.get(params['destination'].upper(), params['destination'].upper())

    url = "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights"
    headers = {"X-RapidAPI-Key": RAPIDAPI_KEY, "X-RapidAPI-Host": RAPIDAPI_HOST}
    querystring = {
        "originSkyId": origin_id, "destinationSkyId": dest_id,
        "date": params['date'], "adults": str(params['adults']),
        "cabinClass": params.get('cabin', 'economy'), "currency": "USD"
    }
    
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=15)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') and data.get('data', {}).get('itineraries'):
                itineraries = data['data']['itineraries']
                formatted = []
                for item in itineraries:
                    # Safely extract airline
                    airlines = []
                    try:
                        airlines = [leg['carriers']['marketing'][0]['name'] for leg in item.get('legs', [])]
                    except:
                        pass
                    
                    # Safely extract price
                    price = 0
                    try:
                        price = item.get('price', {}).get('raw', 0)
                    except:
                        pass

                    # Safely extract legs
                    formatted_legs = []
                    try:
                        for leg in item.get('legs', []):
                            formatted_legs.append({
                                "duration": leg.get('duration', 0),
                                "departure_airport": leg.get('origin', {}).get('displayCode', ''),
                                "arrival_airport": leg.get('destination', {}).get('displayCode', '')
                            })
                    except:
                        pass

                    formatted.append({
                        "name": airlines[0] if airlines else "Unknown",
                        "airlines": airlines,
                        "price": price,
                        "legs": formatted_legs
                    })
                return formatted
            else:
                print("⚠️ RapidAPI returned 200 but no itineraries.")
        else:
            print(f"❌ RapidAPI HTTP {response.status_code}: {response.text[:200]}")
    except Exception as e:
        print(f"❌ RapidAPI Request failed: {e}")
    return None

def _fetch_from_scraper(params):
    try:
        query = create_query(
            flights=[FlightQuery(date=params['date'], from_airport=params['origin'], to_airport=params['destination'])],
            seat=params.get('cabin', 'economy'),
            trip=params.get('trip', 'one-way'),
            passengers=Passengers(adults=params['adults'])
        )
        results = get_flights(query)
        flights_list = results.flights if hasattr(results, 'flights') else results
        
        formatted = []
        for f in flights_list:
            formatted.append({
                "name": f.airlines[0] if hasattr(f, 'airlines') and f.airlines else "Unknown",
                "airlines": f.airlines if hasattr(f, 'airlines') else [],
                "price": getattr(f, 'price', 0),
                "legs": [
                    {
                        "duration": getattr(l, 'duration', 0), 
                        "departure_airport": getattr(l, 'from_airport', ''), 
                        "arrival_airport": getattr(l, 'to_airport', '')
                    } for l in getattr(f, 'legs', [])
                ]
            })
        return formatted
    except Exception as e:
        print(f"Scraper fallback failed: {e}")
        return []

def search_flights(origin, destination, date, return_date=None, adults=1, children=0, infants=0, seat='economy', trip='one-way'):
    params = {'origin': origin, 'destination': destination, 'date': date, 'adults': adults, 'cabin': seat, 'trip': trip}
    
    cache_key = _get_cache_key(params)
    if cache_key in _cache:
        cached_data, timestamp = _cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            print("✅ Cache hit")
            return cached_data
        else:
            del _cache[cache_key]

    print("⏳ Cache miss. Trying RapidAPI...")
    results = _fetch_from_rapidapi(params)
    
    if results is None or len(results) == 0:
        print("⚠️ RapidAPI failed or empty. Falling back to scraper...")
        results = _fetch_from_scraper(params)
    
    if results:
        _cache[cache_key] = (results, time.time())
        
    return results
