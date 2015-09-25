(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('donations', donationsService);

  /** @ngInject */
  function donationsService(Restangular, _, dateRange, transactionsDataManipulation){
    var factory = {
      getParsedDonations: getParsedDonations,

      _getDonations: getDonations,
      _extractData: extractData
    };
    return factory;

    function getParsedDonations(portal_uri, profile_code, account){
      return getDonations(portal_uri, profile_code, account).then(function(donations){
        return extractData(donations, 'donor_name', 'gift_date');
      });
    }

    function getDonations(portal_uri, profile_code, account){
      return Restangular.one('donations').get({
        portal_uri: portal_uri,
        profile_code: profile_code,
        account: account,
        date_from: dateRange.getDateFrom(),
        date_to: dateRange.getDateTo()
      });
    }

    function extractData(donations){
      //add processing functions as lodash mixins so they can be used in the lodash chain
      _.mixin({
        mainDataProcessing: transactionsDataManipulation.extractData
      });

      return _(donations)
        .thru(function(donations){
          return {donations: donations};
        })
        .mainDataProcessing('donor_name', 'gift_date', 'donor_code')
        .value();
    }

  }
})();
