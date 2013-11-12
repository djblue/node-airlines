var app = angular.module('app', []);

function Cntrl($scope){
	//get locations scope
	$scope.locations = Locations;
	$scope.flights = Flights;

	//departure
	$scope.dep = $scope.$;
	
	//destination
	$scope.des = $scope.$; 

	$scope.$watch('dep', function() {
       //console.log($scope.flights);
 	});
}

app.filter("uniqueDates", function(){
    return function(input){
	   	var sDates = [];
		var found = false;

		for(var i in input){
			found = false;
			for(var j in sDates){
				if(input[i].departure.date == sDates[j].departure.date)
					found = true;
		}
		if(found == false)
			sDates.push(input[i]);
		}

 	   	return sDates;
    }
})

app.filter("uniqueDes", function(){
    return function(input){
	   	var uDes = [];
		var found = false;

		for(var i in input){
			found = false;
			for(var j in uDes){
				if(input[i].destination._location.city == uDes[j].destination._location.city)
					found = true;
		}
		if(found == false)
			uDes.push(input[i]);
		}

 	   	return uDes;
    }
})
/*
for array data sources:
    label for value in array
    select as label for value in array
    label group by group for value in array
    select as label group by group for value in array track by trackexpr
for object data sources:
    label for (key , value) in object
    select as label for (key , value) in object
    label group by group for (key, value) in object
    select as label group by group for (key, value) in object
*/




