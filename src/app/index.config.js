(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .config(config);

  /** @ngInject */
  function config($logProvider, RestangularProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    RestangularProvider.setBaseUrl('/ministry_view');
  }

})();
