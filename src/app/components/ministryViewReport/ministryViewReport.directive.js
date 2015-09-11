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
      controller: [MinistryViewReportController],
      controllerAs: 'mvr',
      scope: {
        color: '='
      },
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function MinistryViewReportController() {
      this.color = this.color || {};
      this.color.income = this.color.income || '#3366cc';
      this.color.expenses = this.color.expenses || '#dc3912';
      this.color.balance = this.color.balance || '#ff9900';

      this.dropdowns = {
        country: [
          {
            id: 'us',
            name: "United States"
          }, {
            id: 'ca',
            name: "Canada"
          }
        ],
        profile: [
          {
            id: '1',
            name: "1st"
          }, {
            id: '2',
            name: "2nd"
          }
        ],
        account: [
          {
            id: '1',
            name: "1st"
          }, {
            id: '2',
            name: "2nd"
          }
        ]
      };
      this.data = {
        months: [
          'Sep 14',
          'Oct 14',
          'Nov 14',
          'Dec 14',
          'Jan 15',
          'Feb 15',
          'Mar 15',
          'Apr 15',
          'May 15',
          'Jun 15',
          'Jul 15',
          'Aug 15',
          'Sep 15'
        ],
        income: {
          Income: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          'Europe Income': [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          'GA NMF Charge': [3, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        },
        expenses: {
          Expenses: [4, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          'Conf Attended': [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          'Employers NI': [3, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        },
        balance: {
          Balance: [5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          'Something else': [2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        }
      };

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
