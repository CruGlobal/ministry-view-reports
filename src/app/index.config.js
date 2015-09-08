(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
