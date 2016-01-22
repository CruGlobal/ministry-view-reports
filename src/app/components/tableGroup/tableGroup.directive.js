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
        expand: '=?',
        type: '@',
        isCollapsed: '=?'
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function TableGroupController($modal) {
      var vm = this;
      vm.isCollapsed = true;
      vm.expand = vm.expand === false ? vm.expand : true; //Default to true unless it is already set to false
      vm.type = vm.type || 'transactions'; //Default to transaction unless it is already set
      vm.showMonthTransactions = showMonthTransactions;

      function showMonthTransactions(transactions, date, category) {
        $modal.open({
          animation: true,
          templateUrl: '/app/components/tableGroup/monthTransactions.modal.html',
          controller: MonthTransactionsController,
          controllerAs: 'monthTransactions',
          bindToController: true,
          resolve: {
            transactions: function(){
              return transactions;
            },
            date: function(){
              return date;
            },
            category: function(){
              return category;
            },
            type: function(){
              return vm.type;
            }
          }
        });

        function MonthTransactionsController(transactions, date, category, type, moment){
          var vm = this;
          vm.transactions = transactions;
          vm.date = moment(date, 'YYYY-MM').format('x');
          vm.category = category;
          vm.type = type;
        }
      }
    }
  }
})();
