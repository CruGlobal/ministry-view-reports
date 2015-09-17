(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .directive('ministryViewReport', ministryViewReport);

  /** @ngInject */
  function ministryViewReport() {
    var directive = {
      restrict: 'E',
      templateUrl: '/app/components/ministryViewReport/ministryViewReport.html',
      controller: MinistryViewReportController,
      controllerAs: 'mvr',
      scope: {
        colors: '='
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function MinistryViewReportController(countries, profiles, transactions, visualization, _, $log) {
      var vm = this;
      vm.transactions = transactions;
      vm.colors = vm.colors || {};
      vm.colors.income = vm.colors.income || '#3366cc';
      vm.colors.expenses = vm.colors.expenses || '#dc3912';
      vm.colors.balance = vm.colors.balance || '#ff9900';

      vm.updateProfiles = updateProfiles;
      vm.updateTransactions = updateTransactions;

      activate();

      function activate() {
        setEmptyData();
        countries.getCountries().then(function (loadedCountries) {
          vm.countries = loadedCountries;
          vm.country = vm.countries[0].portal_uri; //Default to first country
          updateProfiles(); //Load profiles with first country
        });
      }

      function updateProfiles(){
        profiles.getProfiles(vm.country).then(function (loadedProfiles) {
          vm.profiles = loadedProfiles;
          vm.profile = null; //Default to profile where code is null
          vm.account = null; //Default to all accounts
          updateTransactions();
        });
      }

      function updateTransactions(){
        setEmptyData();
        transactions.getParsedTransactions(vm.country, vm.profile, vm.account).then(function (loadedTransactions) {
            vm.data = loadedTransactions;
            vm.chartObject = visualization.getChartObject(transactions.allDates, vm.data, vm.colors);
          },
          function (reason) {
            $log.error(reason);
          });
      }

      function setEmptyData(){
        var zeroArray = _.fill(new Array(13), 0);
        vm.data = {
          incomeTotal: zeroArray,
          expensesTotal: zeroArray,
          balances: zeroArray
        };
        vm.chartObject = visualization.getChartObject(transactions.allDates, vm.data, vm.colors);
      }
    }
  }
})();
