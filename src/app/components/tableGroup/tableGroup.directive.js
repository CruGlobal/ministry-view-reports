(function() {
  'use strict';

  angular
    .module('ministryViewReports')
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
