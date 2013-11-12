function myFunction(){
	alert("Destination should not be the as Departure");
}

function FromCntrl($scope){
	$scope.locations = [
		{name: "Phoenix", 	state:"AZ"},
		{name: "Tucson", 	state:"AZ"},
		{name: "Mesa", 		state:"AZ"},
		{name: "Chandler", 	state:"AZ"},
		{name: "Glendale", 	state:"AZ"},

		{name: "Los Angeles", 	state:"CA"},
		{name: "San Diego", 	state:"CA"},
		{name: "San Jose", 		state:"CA"},
		{name: "San Francisco", state:"CA"},
		{name: "Fresno", 		state:"CA"}
	];
	$scope.loc = $scope.locations[0];
}

function ToCntrl($scope){
	$scope.locations = [
		{name: "Phoenix", 	state:"AZ"},
		{name: "Tucson", 	state:"AZ"},
		{name: "Mesa", 		state:"AZ"},
		{name: "Chandler", 	state:"AZ"},
		{name: "Glendale", 	state:"AZ"},

		{name: "Los Angeles", 	state:"CA"},
		{name: "San Diego", 	state:"CA"},
		{name: "San Jose", 		state:"CA"},
		{name: "San Francisco", state:"CA"},
		{name: "Fresno", 		state:"CA"}
	];
	$scope.loc = $scope.locations[1];
}