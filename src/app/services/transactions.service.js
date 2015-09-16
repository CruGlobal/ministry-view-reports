(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('transactions', transactionsService);

  /** @ngInject */
  function transactionsService(Restangular, _, moment, $log){
    var factory = {
      allDates: [],
      startingBalance: 0,
      getParsedTransactions: getParsedTransactions,

      _getTransactions: getTransactions,
      _extractData: extractData,
      _groupByTransactionType: groupByTransactionType,
      _groupByCategory: groupByCategory,
      _groupByMonth: groupByMonth,
      _reduceAmounts: reduceAmounts,
      _addMissingDates: addMissingDates,
      _insertSummedDates: insertSummedDates,
      _sumDates: sumDates,
      _getDateFrom: getDateFrom,
      _getDateTo: getDateTo,
      _generateDateRange: generateDateRange
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
      // Using factory._getDateFrom() instead of getDateFrom() so it can be overwritten in testing. Same with getDateTo()
      factory.allDates = generateDateRange(factory._getDateFrom(), factory._getDateTo());
      return getTransactions(portal_uri, profile_code, account).then(function(transactions){
        return extractData(transactions, factory.startingBalance);
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
      // Using factory._getDateFrom() instead of getDateFrom() so it can be overwritten in testing. Same with getDateTo()
      return Restangular.one('transactions').get({
        portal_uri: portal_uri,
        profile_code: profile_code,
        account: account,
        date_from: factory._getDateFrom(),
        date_to: factory._getDateTo()
      }).then(function(transactionsObj){
        if(transactionsObj){
          factory.startingBalance = sumStartingBalances(transactionsObj.financial_accounts.financial_account);
          if(transactionsObj.financial_transactions){
            return transactionsObj.financial_transactions.financial_transaction;
          }else {
            $log.error('transactions.financial_transactions key is not defined: ' + JSON.stringify(transactionsObj));
          }
          $log.error('Transactions object is not defined: ' + JSON.stringify(transactionsObj));
        }
      });
    }

    /**
     * Combine starting balances
     * TODO: test
     * @param {array} accounts
     * @returns {Number}
     */
    function sumStartingBalances(accounts){
      return _.reduce(accounts, function(acc, account){
        return acc + Number(account.beginning_balance);
      }, 0);
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
    function extractData(transactions, startingBalance) {
      //add processing functions as lodash mixins so they can be used in the lodash chain
      _.mixin({
        groupByTransactionType: groupByTransactionType,
        groupByCategory: groupByCategory,
        groupByMonth: groupByMonth,
        addMissingDates: addMissingDates,
        sortKeysBy: sortKeysBy,
        insertSummedDates: insertSummedDates,
        insertBalances: insertBalances
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
                .addMissingDates(factory.allDates)
                .value();
            })
            .sortKeysBy()
            .value();
        })
        .insertSummedDates()
        .insertBalances(startingBalance)
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
        return transaction.gl_account_is_income ? 'income' : 'expenses';
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
          return total + Number(transaction.amount);
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
    function addMissingDates(val, allDates){
      // Pluck all date codes from allDates - returns an array like ["2014-09", "2014-10", ...]
      var dateKeys = _.pluck(allDates, 'code');
      // Generate array of zeros for to set the values of empty dates to
      var zeros = _.map(allDates, _.constant({sum: 0}));
      //pluck code out of allDates to get an array of date codes and then zip them to get an object where the keys are the date codes
      return _.assign(_.zipObject(dateKeys, zeros), val);
    }

    /**
     * Adds incomeTotal and expensesTotal to the main object
     * @param {object} types
     * @returns {object}
     */
    function insertSummedDates(types){
      _.forEach(types, function(categories, type){
        types[type + 'Total'] = sumDates(categories);
      });
      return types;
    }

    /**
     * Compute sums for each year/month group
     * Returns an object with year/month groups as keys and sums as values
     * @param {object} categories
     * @returns {object}
     */
    function sumDates(categories) {
      return _.transform(categories, function (acc, category) {
        _.forEach(category, function (dateObj, date) { //go through each category. dateObj is the object under each date (the key) and looks like {sum: 10: transactions: [...]}
          if (acc[date] === undefined) { //if the bucket corresponding to the date var hasn't been created yet
            acc[date] = 0; //initialize date bucket
          }
          acc[date] += dateObj.sum;
        });
      });
    }

    /**
     * Generates balances from starting balance and incomeTotal and expensesTotal arrays
     * TODO: test
     * @param {object} types
     * @returns {object}
     */
    function insertBalances(types, startingBalance){
      console.log(types)
      types.balances = _(_.zip(_.values(types.incomeTotal), _.values(types.expensesTotal)))
        .reduce(function (acc, totals, index) {
          var lastBalance;
           if(index === 0){
             lastBalance = acc;
             acc = [];
           }else{
             lastBalance = acc[index - 1];
           }
           acc[index] = lastBalance + totals[0] + totals[1];
          return acc;
         }, startingBalance);
      return types;
    }

    /**
     * Sort object by key
     * TODO: test
     * From https://gist.github.com/colingourlay/82506396503c05e2bb94
     * @param obj
     * @param comparator
     * @returns {*}
     */
    function sortKeysBy(obj, comparator) {
      var keys = _.sortBy(_.keys(obj), function (key) {
        return comparator ? comparator(obj[key], key) : key;
      });

      return _.object(keys, _.map(keys, function (key) {
        return obj[key];
      }));
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
