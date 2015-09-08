(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
