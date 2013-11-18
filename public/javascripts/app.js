var app = angular.module('app', ['$strap.directives'])
.config(['$routeProvider', 
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/search.html'
            }).
            when('/about', {
                templateUrl: 'partials/about.html'
            }).
            when('/help', {
                templateUrl: 'partials/help.html'
            }).
            when('/contact', {
                templateUrl: 'partials/contact.html'
            }).
            when('/signup', {
                templateUrl: 'partials/signup.html'
            }).
            when('/user', {
                templateUrl: 'partials/user.html'
            }).
            otherwise({ redirectTo: '/' });
    }]);

// Authentication service 
app.service('userService', function ($http, $rootScope) {

    var self = this;

    self.status = { logged: false };

    // Try to get user data on service startup
    $http.get('/api/user').success(function (data) {
        if (!!data.username) {
            self.status['user'] = data;
            self.status.logged = true;
        }
    });

    this.login = function (user, pass, call) {
        $http.post('/api/login', {
            username: user,
            password: pass 
        }).success(function (data) {
            if (!!data.username) {
                self.status['user'] = data;
                self.status.logged = true;
                call(false, data);
            }
        }).error(function () {
            call(true);
        });
    };
});

function userCtrl($scope, $http, userService){

    $scope.alerts = [];
    $scope.status = userService.status;

    $scope.login = function () {
        userService.login($scope.username, $scope.password, function (err, user) {
            if (err) {
                $scope.alerts = [{
                    type: 'error',
                    title: 'Login Error',
                    content: 'Unable to log in user.'
                }];
            } else {
                $scope.hide();
            }
        });
    };

    // allow a user to cancel a flight
    $scope.cancel = function (id) {
        $http.delete('/api/user/flights/' + id).success(function () {
            $.each($scope.status.user.flights, function (i, value) {
                console.log(value);
                if (!!value && value._id == id) {
                    $scope.status.user.flights.splice(i,1);
                    return; // we are done
                }
            });
        });
    };
}

function citySearch($scope, $http) {

    $scope.display = 'none';

    $http.get('/api/locations').success(function (locations) {
        $scope.locations = locations;
        $scope.typeahead = $.map(locations, function (location) {
            return location.city + ', ' + location.state;
        });
    });
    
    $scope.search = function () {
        var from = $scope.departure.split(',')[0];
        var to   = $scope.destination.split(',')[0];
        var dep = $.grep($scope.locations, function (e) {
            return e.city === from;
        });
        var des = $.grep($scope.locations, function (e) {
            return e.city === to;
        });

        if (dep.length === 0 || dep.length === 0 || from === to) {
            return;
        } else {
            $http.get('/api/flights', { params: { 
                dep: dep[0]._id, des: des[0]._id
            }}).success(function (data) {
                $scope.find = data; 
                $scope.display = '';
            });
        }
    }
}

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




