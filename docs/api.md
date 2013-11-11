# API DOCS

This document contains a listing of all of the 

## Locations

Query database for all possible locations.
    
    GET /api/locations

## Flights

Query database for flights (MAX 20 results). If no documents are founds,
an empty array is returned.

    GET /api/flights


### Parameters:

- dep: The departure location index (/api/locations for list of
  possible locations).
- des: The destination location index (/api/locations for list of
  possible locations).
- date: The initial date to search from. (YYYY-MM-DD)
- cost: The _maximum_ cost to search.

### Example:

The following will query for flights _departing_ from location indexed at
10 on October 12, 2013 and arriving at index location 20 which cost at
most __$200.00__. (/api/locations will return indexed locations)

    curl -X GET 'localhost:3000/api/flights?des=20&dep=10&cost=200&date=2013-10-12'

### Object:

The following is an example of the type of object that would be returned
when the flights api is queried.

```javascript
{
    "price": 23,
    "available": 20,
    "total": 250,
    "_id": "5280aae1219fe7e308000797",
    "__v": 0,
    "destination": {
        "date": "2013-11-11T14:01:05.394Z",
        "location": {
            "_id": 20,
            "city": "Annapolis",
            "state": "Maryland"
        }
    },
    "departure": {
        "date": "2014-03-29T10:01:05.394Z",
        "location": {
            "_id": 5,
            "city": "Sacramento",
            "state": "California"
        }
    }
}
```
