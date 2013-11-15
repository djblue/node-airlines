# API DOCS

This document contains a listing of all of the api routes for Node
Airlines and their purpose, usage, and results.

## Login

Login a user and start a session. Some others routes require an active
session such view reserve flights, purchasing flights, and canceling
flights (The expected data is _username_ and _password_).

    POST /api/login

## Logout

Logout a user and end a session.
    
    GET /api/logout

## Users

Get all of the information of the current user.

    GET /api/user

### Signup:

To sign-up or register to the api, you need to make the following request.

    POST /api/user

The server expects and object with a firstname, lastname, username,
email, password. The username will be checked for uniqueness. No further
validation is performed.

### Purchase:

Purchase a flight.

    GET /api/user/flights/:id

### Cancel:

Cancel a flight. The user will receive 50% of the original cost of the
flight. 

    DELETE /api/user/flights/:id

## Locations

Query database for all possible locations.
    
    GET /api/locations

### Objects:

An example location object is shown below:

```javascript
    { "_id" : 20, "city" : "Annapolis", "state" : "Maryland" }
```

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
