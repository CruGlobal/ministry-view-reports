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
        color: '='
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function MinistryViewReportController(countries, profiles, transactions) {
      var vm = this;
      vm.transactions = transactions;
      vm.color = vm.color || {};
      vm.color.income = vm.color.income || '#3366cc';
      vm.color.expenses = vm.color.expenses || '#dc3912';
      vm.color.balance = vm.color.balance || '#ff9900';

      vm.updateProfiles = updateProfiles;
      vm.updateTransactions = updateTransactions;

      activate();

      function activate() {
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
        vm.data = null;
        transactions.getParsedTransactions(vm.country, vm.profile, vm.account).then(function (loadedTransactions) {
          vm.data = loadedTransactions;
        });
      }

      //TODO: Remove these objects once loaded from json api
      this.chartObject = {
        "type": "LineChart",
        "displayed": true,
        "data": {
          "cols": [
            {
              "label": "Month",
              "type": "string"
            },
            {
              "label": "Income",
              "type": "number"
            },
            {
              "label": "Expenses",
              "type": "number"
            },
            {
              "label": "Balance",
              "type": "number"
            },
          ],
          "rows": [
            {
              "c": [
                {
                  "v": "Sep 14"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Oct 14"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Nov 14"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Dec 14"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Jan 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Feb 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Mar 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Apr 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "May 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Jun 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Jul 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Aug 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },
            {
              "c": [
                {
                  "v": "Sep 15"
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                },
                {
                  "v": 20000 * Math.random(),
                }
              ]
            },


          ]
        },
        "options": {
          height: 400,
          legend: {position: 'top'},
          pointSize: 6,
          vAxis: {
            gridlines: {
              count: 10
            }
          },
          series: {
            0: {
              color: this.color.income
            },
            1: {
              color: this.color.expenses
            },
            2: {
              color: this.color.balance
            }
          }
        }
      };
    }
  }
})();
