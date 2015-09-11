(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('profiles', ["Restangular",
      function (Restangular){
        var factory = {};

        factory.getProfiles = function(portal_uri){
          return Restangular.all('profiles.json').getList({portal_uri: portal_uri});
        };

        return factory;
      }
    ]);
})();
