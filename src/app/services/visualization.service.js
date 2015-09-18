(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('visualization', visualizationService);

  /** @ngInject */
  function visualizationService(_, moment){
    var factory = {
      getChartObject: getChartObject,

      _mapTransactionData: mapTransactionData,
      _insertAvgIncome: insertAvgIncome,
      _calculateAvgIncome: calculateAvgIncome
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
      data = insertAvgIncome(data);
      return {
        "type": "LineChart",
        "displayed": true,
        "data": {
          "cols": [
            {
              "label": "Month",
              "type": "date"
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
            {
              "label": "Avg. Income",
              "type": "number"
            },
            {
              "label": "Avg. Income Annotation",
              "type": "string",
              "p":{"role":"annotation"}
            }
          ],
          "rows": mapTransactionData(dates, data),
        },
        "options": {
          height: 400,
          legend: {position: 'top'},
          pointSize: 6,
          hAxis: {
            gridlines: {
              count: 13,
              color: '#F7F7F7'
            },
            format: 'MMM yy'
          },
          vAxis: {
            gridlines: {
              count: 10,
              color: '#888888'
            }
          },
          series: {
            0: {
              color: colors.income,
              lineWidth: 3
            },
            1: {
              color: colors.expenses,
              lineWidth: 3
            },
            2: {
              color: colors.balance,
              lineWidth: 3
            },
            3: {
              color: '#555',
              visibleInLegend: false,
              lineWidth: 2,
              lineDashStyle: [10,7],
              pointsVisible: false,
              enableInteractivity: false
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
      return _([_.pluck(dates, 'friendly'), data.incomeTotal, data.expensesTotal, data.balances, data.avgIncome])
        .unzip()
        .map(function(col, index){
          return {
            "c": _(col)
              .map(function(value){
                return {
                  "v": _.isNumber(value) ? value.toFixed(2) : moment(value, 'MMM YY').toDate() //format as number with 2 decimal places or js date object
                };
              })
              .push({v: index === 11 ? 'Avg. Income: $' + col[4].toFixed(2) : null}) //add annotation to last avgIncome data point
              .value()
          };
        })
        .value();
    }

    /**
     * Insert average income into data object
     * @param {Object} data
     * @returns {Object}
     */
    function insertAvgIncome(data){
      data.avgIncome = _(new Array(13))
        .fill(null)
        .fill(calculateAvgIncome(data.incomeTotal), 6, 12)
        .value();
      return data;
    }

    /**
     * Calculate average income over last 6 months skipping the current month
     * @param {Array} income
     * @returns {Number}
     */
    function calculateAvgIncome(income){
      return _(income)
          .slice(6,12) // only look at last 6 months excluding current month (last month in array)
          .reduce(function(acc, value){
            return acc + value;
          }) / 6;
    }
  }
})();
