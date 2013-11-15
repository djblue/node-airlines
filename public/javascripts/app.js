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

app.service('userService', function ($http, $rootScope) {

    this.user = {};

    // try to get user info
    $http.get('/api/user').success(function (data) {
        if (!!data.username) {
            this.user = data;
            this.logged = true;
            $rootScope.$broadcast( 'userService.logged', this.user );
        }
    });

    this.login = function (user, pass, call) {
        $http.post('/api/login', {
            username: user,
            password: pass 
        }).success(function (data) {
            if (!!data.username) {
                this.user = data;
                this.logged = true;
                call();
                $rootScope.$broadcast( 'userService.logged', this.user );
            }
        }).error(function () {
            call(true);
        });
    };
});

// Authentication controller
function userCtrl($scope, $http, userService){

    $scope.alerts = [];

    $scope.login = function () {
        userService.login($scope.user, $scope.pass, function (err) {
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

    $scope.$on('userService.logged', function (event, user) {
        $scope.logged = true;
        $scope.user = user;
    });
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




