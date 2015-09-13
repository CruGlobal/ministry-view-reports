(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('countries', countryService);

  /** @ngInject */
  function countryService(Restangular){
    var factory = {};

    factory.getCountries = function(){
      return Restangular.all('countries.json').getList();
    };

    return factory;
  }
})();
