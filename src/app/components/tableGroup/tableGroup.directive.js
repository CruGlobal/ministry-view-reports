(function() {
  'use strict';

  angular
    .module('globalStaffAccountReport')
    .directive('tableGroup', menu);

  /** @ngInject */
  function menu() {
    var directive = {
      restrict: 'A',
      templateUrl: '/app/components/tableGroup/tableGroup.html',
      controller: ['$attrs', '$scope', TableGroupController],
      controllerAs: 'group',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TableGroupController($attrs, $scope) {
      this.name = $scope.$eval($attrs.name);
      this.data = $scope.$eval($attrs.data);
    }
  }

})();
