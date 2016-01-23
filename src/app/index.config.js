(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .config(config);

  /** @ngInject */
  function config($logProvider, RestangularProvider, casAuthApiProvider) {
    var settings = window.MinistryViewApp.config;
    // Enable log
    $logProvider.debugEnabled(true);

    RestangularProvider.setBaseUrl(settings.api.ministryView);

    casAuthApiProvider
        .setRequireAccessToken( true )
        .setCacheAccessToken( true )
        .setErrorCallback( settings.errorCallback )
        .setAuthenticationApiBaseUrl( settings.api.casAuthApi )
        .setTicketUrl(settings.api.refresh);
  }

})();
