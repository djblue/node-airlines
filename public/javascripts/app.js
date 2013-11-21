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
            when('/manage', {
                templateUrl: 'partials/manage.html'
            }).
            when('/user', {
                templateUrl: 'partials/user.html'
            }).
            when('/admin/add', {
                templateUrl: 'partials/add.html'
            }).
            when('/admin/view/:page', {
                templateUrl: 'partials/view.html'
            }).
            otherwise({ redirectTo: '/' });
    }]);

// Authentication service 
app.service('userService', function ($http, $rootScope) {

    var self = this;

    self.status = { logged: false };

    this.load = function () {
        // Try to get user data on service startup
        $http.get('/api/user').success(function (data) {
            if (!!data.username) {
                self.status['user'] = data;
                self.status.logged = true;
            }
        });
    };
    
    this.load();

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

app.service('locationService', function ($http) {

    var self = this;

    this.getLocations = function (call) {
        if (!!this.locations && !!this.typeahead) {
            call(this.locations, this.typeahead);
        } else {
            $http.get('/api/locations').success(function (locations) {
                self.locations = locations;
                self.typeahead = $.map(locations, function (location) {
                    return location.city + ', ' + location.state;
                });
                call(self.locations, self.typeahead);
            });
        }
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
                if (!!value && value._id == id) {
                    $scope.status.user.flights.splice(i,1);
                    return; // we are done
                }
            });
        });
    };
}

function citySearch($scope, $http, locationService, userService) {

    $scope.alerts = [];
    $scope.display = 'none';

    locationService.getLocations(function (locs, type) {
        $scope.locations = locs;
        $scope.typeahead = type;
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

            var req  = { dep: dep[0]._id, des: des[0]._id };

            if (!!$scope.datepicker && !!$scope.datepicker.date) {
                var date = $scope.datepicker.date;
                req['date'] = date.getFullYear()  + '-' +
                              (date.getMonth() + 1) + '-' +
                              (date.getDate());
            }

            if (!!$scope.price) {
                console.log('hello');
                req['cost'] = $scope.price;
            }

            $http.get('/api/flights', { params: req
            }).success(function (data) {
                if (data.length != 0) {
                    $scope.find = data; 
                    $scope.display = '';
                    $('.header').slideUp();
                } else {
                    $scope.alerts = [{
                        type: 'error',
                        title: 'Search Error',
                        content: 'Unable to find a flight.'
                    }];
                }
            });
        }
    }

    $scope.buy = function (id) {
        if (userService.status.logged == true) {
            $http.get('/api/user/flights/'+id).success(function () {
                userService.load();
                $scope.alerts = [{
                    type: 'success',
                    title: 'Success',
                    content: 'Ticket purchased successfully'
                    + ' <a href="#/user">view</a>.'
                }];
            });
        } else {
            $scope.alerts = [{
                type: 'error',
                title: 'User Error',
                content: 'Please login to purchase a ticket.'
            }];
        }
    };
}

function manageCtrl ($scope, $http, locationService, $location) {

    $scope.alerts = [];

    $scope.flight = {};

    $scope.tabs = [
        {title: 'Add', page: 'add.html'},
        //{title: 'Edit', page: 'edit.html'},
        //{title: 'Remove', page: 'remove.html'}
    ];

    locationService.getLocations(function (loc, type) {
        $scope.locations = loc;
        $scope.typeahead = type;
    });

    $scope.add = function () {
        var from = $scope.flight.departure.split(',')[0];
        var to   = $scope.flight.destination.split(',')[0];
        var dep = $.grep($scope.locations, function (e) {
            return e.city === from;
        });
        var des = $.grep($scope.locations, function (e) {
            return e.city === to;
        });

        if (dep.length === 0 || dep.length === 0 || from === to) {
            $scope.alerts = [{
                type: 'error',
                title: 'Location Error',
                content: 'There is in error with the locations.'
            }];
        } else {
            var d1 = new Date(
                $scope.flight.dep.date.toLocaleDateString()
                + ' ' + $scope.flight.dep.time);
            var d2 = new Date(
                $scope.flight.des.date.toLocaleDateString()
                + ' ' + $scope.flight.des.time);
                console.log(d1.toString());
            $http.post('/api/flights', {
                departure: {
                    date: d1,
                    location: dep[0]._id
                },
                destination: {
                    date: d2,
                    location: des[0]._id
                },
                price: $scope.flight.price,
                total: $scope.flight.total,
                available: $scope.flight.total
            }).success(function (data) {
                $location.path("/manage") 
                $scope.alerts = [{
                    type: 'success',
                    title: 'Flight Added',
                    content: 'The flight was successfully added.'
                }];
            });
        }
    };
};

function viewCtrl ($scope, $http, $route) {

    var page = Number($route.current.params.page);

    $scope.next = page + 1;
    $scope.prev = page - 1;

    $http.get('/api/flights', {params: {
        limit: 10,
        page: page
    }}).success(function (data) {
        $scope.find = data;
    });
};
