import os
import time
import hashlib
import requests
from fast_flights import FlightQuery, Passengers, create_query, get_flights

# ── Configuration ──
RAPIDAPI_KEY = os.environ.get("RAPIDAPI_KEY")
RAPIDAPI_HOST = "sky-scrapper.p.rapidapi.com"
CACHE_TTL = 3600 * 6  # 6 hours

# ── Simple In-Memory Cache ──
_cache = {}

def _get_cache_key(params):
    key_str = f"{params['origin']}-{params['destination']}-{params['date']}-{params['adults']}"
    return hashlib.md5(key_str.encode()).hexdigest()

# ── Layer 1: RapidAPI Sky-Scrapper ──
def _fetch_from_rapidapi(params):
    if not RAPIDAPI_KEY:
        print("❌ RapidAPI Error: RAPIDAPI_KEY environment variable is missing.")
        return None
    
    # Sky-Scrapper requires SkyIDs instead of IATA codes for many airports
    sky_map = {
        "LHR": "LOND", "LGW": "LOND",
        "JFK": "NYCA", "EWR": "NYCA", "LGA": "NYCA",
        "LAX": "LAXA", "SFO": "SFOA", "DXB": "DXBA"
    }
    origin_id = sky_map.get(params['origin'].upper(), params['origin'].upper())
    dest_id = sky_map.get(params['destination'].upper(), params['destination'].upper())

    url = "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights"
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }
    querystring = {
        "originSkyId": origin_id,
        "destinationSkyId": dest_id,
        "date": params['date'],
        "adults": str(params['adults']),
        "cabinClass": params.get('cabin', 'economy'),
        "currency": "USD"
    }
    
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=15)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') and data.get('data', {}).get('itineraries'):
                return data['data']['itineraries']
            else:
                print(f"⚠️ RapidAPI returned 200 but no itineraries. Response: {response.text[:200]}")
        else:
            print(f"❌ RapidAPI HTTP {response.status_code}: {response.text[:200]}")
    except Exception as e:
        print(f"❌ RapidAPI Request failed: {e}")
    return None

# ── Layer 3: fast-flights Scraper Fallback ──
def _fetch_from_scraper(params):
    try:
        query = create_query(
            flights=[FlightQuery(date=params['date'], from_airport=params['origin'], to_airport=params['destination'])],
            seat=params.get('cabin', 'economy'),
            trip=params.get('trip', 'one-way'),
            passengers=Passengers(adults=params['adults'])
        )
        # FIX: Removed fetch_mode="fallback" as it's not supported in this version
        results = get_flights(query)
        
        formatted = []
        for f in results:
            formatted.append({
                "name": f.airlines[0] if f.airlines else "Unknown",
                "airlines": f.airlines,
                "price": f.price,
                "legs": [{"duration": l.duration, "departure_airport": l.from_airport, "arrival_airport": l.to_airport} for l in f.legs]
            })
        return formatted
    except Exception as e:
        print(f"Scraper fallback failed: {e}")
        return []

# ── Main Function (Orchestrator) ──
def search_flights(origin, destination, date, return_date=None, adults=1, children=0, infants=0, seat='economy', trip='one-way'):
    params = {
        'origin': origin, 'destination': destination, 'date': date,
        'adults': adults, 'cabin': seat, 'trip': trip
    }
    
    # 1. Check Cache
    cache_key = _get_cache_key(params)
    if cache_key in _cache:
        cached_data, timestamp = _cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            print("✅ Cache hit")
            return cached_data
        else:
            del _cache[cache_key]

    # 2. Try Primary API
    print("⏳ Cache miss. Trying RapidAPI...")
    results = _fetch_from_rapidapi(params)
    
    # 3. Try Fallback Scraper
    if results is None or len(results) == 0:
        print("⚠️ RapidAPI failed or empty. Falling back to scraper...")
        results = _fetch_from_scraper(params)
    
    # 4. Store in Cache
    if results:
        _cache[cache_key] = (results, time.time())
        
    return results
