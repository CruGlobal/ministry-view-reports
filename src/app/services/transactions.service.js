(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('transactions', transactionsService);

  /** @ngInject */
  function transactionsService(Restangular){
    var factory = {};

    factory.getTransactions = function(portal_uri, profile_code, account){
      var date_to = '';
      var date_from = '';
      return Restangular.one('transactions.json').get({
        portal_uri: portal_uri,
        profile_code: profile_code,
        account: account,
        date_from: date_from,
        date_to: date_to
      });
    };

    return factory;
  }
})();
