(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('profiles', profilesService);

  /** @ngInject */
  function profilesService(Restangular, _){
    var factory = {
      getProfiles: getProfiles,

      _wrapAccountsInArray: wrapAccountsInArray
    };

    return factory;

    function getProfiles(portal_uri){
      return Restangular.all('profiles').getList({portal_uri: portal_uri})
        .then(function(profiles){
          return wrapAccountsInArray(profiles);
        });
    }

    function wrapAccountsInArray(profiles){
      return _(profiles)
        .map(function(profile){
          var accounts = profile.financial_accounts.financial_account_info;
          //turn accounts into an array if it is just a single object
          profile.financial_accounts.financial_account_info = _.isArray(accounts) ? accounts : [accounts];
          return profile;
        })
        .value();
    }
  }
})();
