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
    function MinistryViewReportController(dateRange, countries, profiles, transactions, donations, visualization, _, $log) {
      var vm = this;
      vm.transactions = transactions;
      vm.colors = vm.colors || {};
      vm.colors.income = vm.colors.income || '#3366cc';
      vm.colors.expenses = vm.colors.expenses || '#dc3912';
      vm.colors.balance = vm.colors.balance || '#ff9900';
      vm.colors.donations = vm.colors.donations || '#8DC5FF';

      vm.updateProfiles = updateProfiles;
      vm.updateTransactionsAndDonations = updateTransactionsAndDonations;

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
          updateTransactionsAndDonations();
        });
      }

      function updateTransactionsAndDonations(){
        setEmptyData();
        transactions.getParsedTransactions(vm.country, vm.profile, vm.account).then(function (loadedTransactions) {
            vm.data = loadedTransactions;
            vm.chartObject = visualization.getChartObject(dateRange.allDates, vm.data, vm.colors);
          },
          function (reason) {
            $log.error(reason);
          });
        donations.getParsedDonations(vm.country, vm.profile, vm.account).then(function (loadedDonations) {
            vm.donations = loadedDonations;
            // console.log('LoadedDonationTransactions:', vm.donations);
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
        vm.donations = {
          donationsTotal: zeroArray
        };
        vm.chartObject = visualization.getChartObject(dateRange.allDates, vm.data, vm.colors);
      }
    }
  }
})();
