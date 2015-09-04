(function() {
  'use strict';

  angular
    .module('globalStaffAccountReport')
    .directive('tableGroup', tableGroup);

  /** @ngInject */
  function tableGroup() {
    var directive = {
      restrict: 'A',
      templateUrl: '/app/components/tableGroup/tableGroup.html',
      controller: [TableGroupController],
      controllerAs: 'group',
      scope: {
        data: '='
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TableGroupController() {

    }
  }

})();
