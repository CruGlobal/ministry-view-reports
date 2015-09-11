(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('countries', ["$http",
      function ($http){
        var factory = {};

        factory.getCountries = function(){
          return $http.get('json/ministry_view/countries.json').then(function(response){
            return response.data;
          });
        };

        return factory;
      }
    ]);
})();
