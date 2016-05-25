//my module
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);


// ROUTES!!
weatherApp.config(function ($routeProvider) {

    $routeProvider

    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })

    .when('/forecast', {
        templateUrl: 'pages/forecast.html',
        controller: 'forecastController'
    })

    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.html',
        controller: 'forecastController'
    })

});

//SERVICES !!

weatherApp.service('cityService', function() {

  this.city = "New York, NY";

});

weatherApp.service('weatherService', ['$resource', function($resource) {

  this.GetWeather = function(city, days) {

      var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?&APPID=b1a31714c82a61faa044b09c37017422", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});

      return weatherAPI.get({ q: city, cnt: days });
    };

  }]);


//CONTROLLERS!
weatherApp.controller('homeController', ['$scope','$location','cityService', function($scope, $location, cityService) {

  $scope.city = cityService.city;

  $scope.$watch('city', function() { //to share data information across pages
    cityService.city = $scope.city;
  });

  $scope.submit = function() {
      $location.path("/forecast");
  };

}]);

weatherApp.controller('forecastController', ['$scope', '$routeParams', 'cityService', 'weatherService', function($scope, $routeParams, cityService, weatherService) {

  $scope.city = cityService.city;

  $scope.days = $routeParams.days || '2';

  $scope.weatherResult = weatherService.GetWeather($scope.city, $scope.days);

    $scope.convertToFahrenheit = function(degK) {
      return Math.round((1.8 * (degK - 273)) + 32);
    }

    $scope.convertToDate = function(dt) {
      return new Date(dt * 1000);
    }

}]);

//DIRECTIVES!
weatherApp.directive("weatherReport", function() {
  return {
    restrict: 'E',
    templateUrl: 'directives/weatherReport.html',
    replace: true,
    scope: {
        weatherDay: "=", //two way binding passing an object
        convertToStandard: "&", //passing a function so use '&'
        convertToDate: "&",
        dateFormat: "@" //passing a string
    }
  }
})
