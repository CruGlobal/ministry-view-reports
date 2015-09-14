(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('transactions', transactionsService);

  /** @ngInject */
  function transactionsService(Restangular, _, moment){
    var factory = {
      allDates: [],
      getParsedTransactions: getParsedTransactions
    };
    return factory;

    /**
     * Gets transactions after they are mapped, grouped, and reduced
     * @param {string} portal_uri
     * @param {string} profile_code
     * @param {string} account
     * @returns {Object}
     */
    function getParsedTransactions(portal_uri, profile_code, account){
      return getTransactions(portal_uri, profile_code, account).then(function(transactions){
        generateDateRange();
        return extractData(transactions);
      });
    }

    /**
     * Get transactions from server
     * @param {string} portal_uri
     * @param {string} profile_code
     * @param {string} account
     * @returns {Object}
     */
    function getTransactions(portal_uri, profile_code, account){
      return Restangular.one('transactions.json').get({
        portal_uri: portal_uri,
        profile_code: profile_code,
        account: account,
        date_from: getDateFrom(),
        date_to: getDateTo()
      }).then(function(transactionsObj){
        return transactionsObj.financial_transactions.financial_transaction;
      });
    }

    /**
     * Runs transactions through functions to map, group, and reduce them for visualization
     * @param {Object} transactions
     * @returns {Object}
     */
    function extractData(transactions) {
      var groupedByType = groupByTransactionType(transactions);
      return groupByCategoryAndMonth(groupedByType);
    }

    /**
     * Split transactions into 2 arrays (income and expenses) depending on if the transaction was positive or negative
     * Results in:
     * {
     *   income: [<income transactions objects>],
     *   expenses: [<expenses transactions objects>]
     * }
     */
    function groupByTransactionType(transactions) {
      return _.groupBy(transactions, function (transaction) {
        return transaction.amount > 0 ? 'income' : 'expenses';
      });
    }

    /**
     * Takes groupedByType object and performs the following operations in order:
     * - Groups by category
     * - Groups by year/month
     * - Foreach of those groups, adds sum to object and adds original transactions array under another key
     * - Add missing dates
     */
    function groupByCategoryAndMonth(groupedByType){
      return _(groupedByType).mapValues(function(type) { // for both income and expenses buckets
        /**
         * Group by account category
         * Results in:
         * {
         *   "Inc Transfers": [<transactions objects>],
         *   "Gift Aid": [<transactions objects>],
         *   <otheCategoryName>: [<transactions objects>],
         *   ...
         * }
         */
        return _(type).groupBy(function (transaction) {
          return transaction.gl_account_description;
        })
        /**
         * Goes through each category and performs the following operations in order:
         * - Groups by year/month
         * - Foreach of those groups, adds sum to object and adds original transactions array under another key
         * Results in:
         * {
           *   "Inc Transfers": {
           *     2014-09: {sum: 131, transactions: [<transactions objects>]},
           *     2014-10: {sum: 131, transactions: [<transactions objects>]},
           *     ...
           *   },
           *   "Gift Aid": {
           *     2014-09: {sum: 78, transactions: [<transactions objects>]},
           *     2014-10: {sum: 78, transactions: [<transactions objects>]},
           *     ...
           *   },
           *   ...
           * }
         */
          .mapValues(function(category, key){ // foreach category bucket
            /**
             * Group by year and month
             * Results in:
             * {
             *   2014-09: [<transactions objects>],
             *   2014-10: [<transactions objects>],
             *   ...
             * }
             */
            return _(category).groupBy(function(transaction){
              //create key by combining year and month with a dash in between
              return transaction.fiscal_year + '-' + _.padLeft(transaction.fiscal_period, 2, '0');
            })
            /**
             * Takes object of transactions grouped by year/month and for each returns the sum and the original array of transactions
             * Results in:
             * {
               *   2014-09: {sum: 131, transactions: [<transactions objects>]},
               *   2014-10: {sum: 131, transactions: [<transactions objects>]},
               *   ...
               * }
             */
              .mapValues(function(accountDescGroup){ // foreach year/month bucket
                /**
                 * Takes all transaction amounts in each category and year/month group and returns the sum
                 */
                var sum = _.reduce(accountDescGroup, function(total, transaction){
                  return total + Math.abs(transaction.amount);
                }, 0);
                /**
                 * Returns object, now including sum
                 */
                return {
                  sum: sum,
                  transactions: accountDescGroup
                };
              })
              .thru(function(val){
                return addMissingDates(val);
              }).value();




            /*-var sum = _.reduce(accountDescSums, function(total, val){
             return total + val;
             });
             var split = key.split('-');
             var fullDate = moment().year(split[0]).month(split[1] - 1).format('MMM YY');*/
            /*return {
             groups: accountDescSums,
             sum: sum,
             fullDate: fullDate
             };*/
          })
          .value();
      })
        .thru(function(val){
          return addSummedDates(val)
        })
        .value();
    }

    /**
     * Add any missing dates
     * Takes:
     * {
     *   2014-09: {sum: 131, transactions: [<transactions objects>]},
     *   2014-11: {sum: 131, transactions: [<transactions objects>]},
     *   ...
     * }
     * and adds missing keys:
     * {
     *   2014-09: {sum: 131, transactions: [<transactions objects>]},
     *   2014-10: {sum: 0},
     *   2014-11: {sum: 131, transactions: [<transactions objects>]},
     *   ...
     * }
     */
    function addMissingDates(val){
      //pluck code out of allDates to get an array of date codes and then zip them to get an object where the keys are the date codes
      return _.assign(_.zipObject(_.pluck(factory.allDates, 'code')), val);
    }


    /** Get current date in format YYYY-MM-DD where DD is the last day of the month */
    function getDateTo(){
      return moment().format('YYYY-MM') + '-' + moment().daysInMonth();
    }

    /** Get the month that is 12 months before current date in format YYYY-MM-DD where DD is the first day of the month */
    function getDateFrom(){
      return moment().subtract(12, 'months').format('YYYY-MM') + '-01';
    }

    /** Get array of months between dateFrom and dateTo */
    function generateDateRange(){
      var startDate = moment(getDateFrom(), "YYYY-MM-DD");
      var endDate = moment(getDateTo(), "YYYY-MM-DD");
      var range = moment.range(startDate, endDate);
      factory.allDates = [];
      range.by('months', function(moment){
        factory.allDates.push({
          code: moment.format('YYYY-MM'),
          friendly: moment.format('MMM YY')
        });
      });
    }

    function addSummedDates(types){
      _.forEach(types, function(categories, type){
        types[type + 'Total'] = sumDates(categories);
      });
      return types;
    }
    function sumDates(categories) {
      //TODO: deal with month that has no transactions
      return _(categories).transform(function (acc, category) {
        _.forEach(category, function (dateObj, date) {
          if (dateObj) {
            if (acc[date] === undefined) {
              acc[date] = 0;
            }
            acc[date] += dateObj.sum;
          }
        });
      })
        .tap(function(val){
          console.log('here')
          console.log(val);
        }).value();
    }
  }
})();
