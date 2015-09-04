(function() {
  'use strict';

  angular
    .module('globalStaffAccountReport')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
