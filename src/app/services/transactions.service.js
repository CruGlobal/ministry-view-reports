(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('transactions', transactionsService);

  /** @ngInject */
  function transactionsService(Restangular, _, moment){
    var factory = {
      allDates: [],
      getParsedTransactions: getParsedTransactions,

      _getTransactions: getTransactions,
      _getDateFrom: getDateFrom,
      _getDateTo: getDateTo,
      _generateDateRange: generateDateRange,
      _groupByTransactionType: groupByTransactionType
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
        factory.allDates = generateDateRange(getDateFrom(), getDateTo());
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
     *
     * Takes transactions array and performs the following operations in order:
     * - Groups by transaction type (positive or negative)
     * - Groups those by category
     * - Groups those by year/month
     * - Foreach of those, adds sum to object and lifts transactions array into sub key
     * - Add missing dates
     * - Add summed dates
     */
    function extractData(transactions) {
      _.mixin({
        groupByTransactionType: groupByTransactionType,
        groupByCategory: groupByCategory,
        groupByMonth: groupByMonth,
        addMissingDates: addMissingDates,
        addSummedDates: addSummedDates
      });

      return _(transactions)
        .groupByTransactionType()
        .mapValues(function(type) { // for both income and expenses buckets
          return _(type)
            .groupByCategory(type)
            .mapValues(function(category) { // foreach category bucket
              return _(category)
                .groupByMonth()
                .mapValues(function(accountDescGroup) { // foreach year/month bucket
                  //keep transactions in new sub object and add sums
                  return {
                    sum: reduceAmounts(accountDescGroup),
                    transactions: accountDescGroup
                  };
                })
                .addMissingDates()
                .value();
            })
            .value();
        })
        .addSummedDates()
        .value();
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
     * Group by account category
     * Results in:
     * {
         *   "Inc Transfers": [<transactions objects>],
         *   "Gift Aid": [<transactions objects>],
         *   <otheCategoryName>: [<transactions objects>],
         *   ...
         * }
     */
    function groupByCategory(type) {
      return _(type)
        .groupBy(function (transaction) {
          return transaction.gl_account_description;
        })
        .value();
    }

    /**
     * Group by year and month
     * Results in:
     * {
     *   2014-09: [<transactions objects>],
     *   2014-10: [<transactions objects>],
     *   ...
     * }
     */
    function groupByMonth(category) {
      return _(category)
        .groupBy(function (transaction) {
          //create key by combining year and month with a dash in between
          return transaction.fiscal_year + '-' + _.padLeft(transaction.fiscal_period, 2, '0');
        })
        .value();
    }

    /**
     * Takes all transaction amounts in each year/month group and returns the sum
     */
    function reduceAmounts(accountDescGroup){
      return _(accountDescGroup)
        .reduce(function(total, transaction){
          return total + Math.abs(transaction.amount);
        }, 0);
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
      // Get all date keys from allDates
      var dateKeys = _.pluck(factory.allDates, 'code');
      // Generate array of zeros for to set the values of empty dates to
      var zeros = _.map(factory.allDates, _.constant({sum: 0}));
      //pluck code out of allDates to get an array of date codes and then zip them to get an object where the keys are the date codes
      return _.assign(_.zipObject(dateKeys, zeros), val);
    }

    function addSummedDates(types){
      _.forEach(types, function(categories, type){
        types[type + 'Total'] = sumDates(categories);
      });
      return types;
    }

    function sumDates(categories) {
      //TODO: deal with month that has no transactions
      return _.transform(categories, function (acc, category) {
        _.forEach(category, function (dateObj, date) {
          if (dateObj) {
            if (acc[date] === undefined) {
              acc[date] = 0;
            }
            acc[date] += dateObj.sum;
          }
        });
      });
    }

    /**** DATE HELPER FUNCTIONS ****/

    /** Get current date in format YYYY-MM-DD where DD is the last day of the month */
    function getDateTo(){
      return moment().format('YYYY-MM') + '-' + moment().daysInMonth();
    }

    /** Get the month that is 12 months before current date in format YYYY-MM-DD where DD is the first day of the month */
    function getDateFrom(){
      return moment().subtract(12, 'months').format('YYYY-MM') + '-01';
    }

    /** Get array of months between dateFrom and dateTo */
    function generateDateRange(startDate, endDate){
      startDate = moment(startDate, "YYYY-MM-DD");
      endDate = moment(endDate, "YYYY-MM-DD");
      var range = moment.range(startDate, endDate);
      var allDates = [];
      range.by('months', function(moment){
        allDates.push({
          code: moment.format('YYYY-MM'),
          friendly: moment.format('MMM YY')
        });
      }, true);
      return allDates;
    }
  }
})();
