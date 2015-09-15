(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('profiles', profilesService);

  /** @ngInject */
  function profilesService(Restangular){
    var factory = {};

    factory.getProfiles = function(portal_uri){
      return Restangular.all('profiles').getList({portal_uri: portal_uri});
    };

    return factory;
  }
})();
