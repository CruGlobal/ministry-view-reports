(function() {
  'use strict';

  angular
    .module('globalStaffAccountReport')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
