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
      controller: TableGroupController,
      controllerAs: 'group',
      scope: {
        name: '@',
        data: '=',
        totals: '=',
        color: '=',
        expand: '='
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TableGroupController() {
      var vm = this;
      vm.isCollapsed = true;
      vm.expand = vm.expand === false ? vm.expand : true; //Default to true unless it is already set to false
    }
  }
})();
