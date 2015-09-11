(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('countries', ["Restangular",
      function (Restangular){
        var factory = {};

        factory.getCountries = function(){
          return Restangular.all('countries.json').getList();
        };

        return factory;
      }
    ]);
})();
