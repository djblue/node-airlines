//we need go get from the servers instead of this 
//fake data

var Locations = [
	{city: "Phoenix", 		state : "AZ"},
	{city: "Tucson", 		state : "AZ"},
	{city: "Mesa", 			state : "AZ"},
	{city: "Chandler", 		state : "AZ"},
	{city: "Glendale", 		state : "AZ"},
	{city: "Los Angeles", 	state : "CA"},
	{city: "San Diego", 	state : "CA"},
	{city: "San Jose", 		state : "CA"},
	{city: "San Francisco", state : "CA"},
	{city: "Fresno", 		state : "CA"}
];

var Flights = [
	{price:23, available:20, total:250, destination : { date:"1", _location: Locations[0] }, departure:{ date:"1", _location : Locations[3] }},
	{price:23, available:20, total:250, destination : { date:"1", _location: Locations[0] }, departure:{ date:"1", _location : Locations[0] }},
	{price:23, available:20, total:250, destination : { date:"1", _location: Locations[0] }, departure:{ date:"1", _location : Locations[0] }},
	{price:23, available:20, total:250, destination : { date:"2", _location: Locations[0] }, departure:{ date:"2", _location : Locations[0] }},
	{price:23, available:20, total:250, destination : { date:"2", _location: Locations[2] }, departure:{ date:"2", _location : Locations[0] }},
	{price:23, available:20, total:250, destination : { date:"2", _location: Locations[2] }, departure:{ date:"3", _location : Locations[1] }},
	{price:23, available:20, total:250, destination : { date:"3", _location: Locations[3] }, departure:{ date:"3", _location : Locations[1] }},
	{price:23, available:20, total:250, destination : { date:"3", _location: Locations[5] }, departure:{ date:"4", _location : Locations[3] }},
	{price:23, available:20, total:250, destination : { date:"4", _location: Locations[6] }, departure:{ date:"4", _location : Locations[4] }},
	{price:23, available:20, total:250, destination : { date:"4", _location: Locations[6] }, departure:{ date:"5", _location : Locations[2] }},
	{price:23, available:20, total:250, destination : { date:"4", _location: Locations[1] }, departure:{ date:"5", _location : Locations[1] }},
	{price:23, available:20, total:250, destination : { date:"5", _location: Locations[1] }, departure:{ date:"5", _location : Locations[1] }},
	{price:23, available:20, total:250, destination : { date:"5", _location: Locations[2] }, departure:{ date:"6", _location : Locations[0] }},
	{price:23, available:20, total:250, destination : { date:"6", _location: Locations[0] }, departure:{ date:"6", _location : Locations[0] }},
	{price:23, available:20, total:250, destination : { date:"6", _location: Locations[0] }, departure:{ date:"7", _location : Locations[2] }}
];
