(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .run(runBlock);

  /** @ngInject */
  function runBlock(casAuthApi) {
    var settings = window.MinistryViewApp.config;
    // Register managed API with casAuthApi
    casAuthApi.addManagedApi( settings.api.ministryView );
  }

})();
