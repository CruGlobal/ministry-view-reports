(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('visualization', visualizationService);

  /** @ngInject */
  function visualizationService(_){
    var factory = {
      getChartObject: getChartObject,

      _mapTransactionData: mapTransactionData
    };
    return factory;

    /**
     * Get final chart object containing processed data and chart options
     * @param {Array} dates
     * @param {Object} data
     * @param {Object} colors
     * @returns {Object}
     */
    function getChartObject(dates, data, colors) {
      return {
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
            }
          ],
          "rows": mapTransactionData(dates, data),
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
              color: colors.income
            },
            1: {
              color: colors.expenses
            },
            2: {
              color: colors.balance
            }
          }
        }

      };
    }

    /**
     * Map transaction data into a Google DataTable literal string
     * @param {Array} dates
     * @param {Object} data
     * @returns {Array}
     */
    function mapTransactionData(dates, data){
      return _([_.pluck(dates, 'friendly'), data.incomeTotal, data.expensesTotal, data.balances])
        .unzip()
        .map(function(col){
          return {
            "c": _(col)
              .map(function(value){
                return {
                  "v": _.isNumber(value) ? Math.abs(value) : value
                };
              })
              .value()
          };
        })
        .value();
    }
  }
})();
