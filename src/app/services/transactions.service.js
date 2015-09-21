(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('transactions', transactionsService);

  /** @ngInject */
  function transactionsService(Restangular, _, $q, dateRange, transactionDataManipulation){
    var factory = {
      startingBalance: 0,
      getParsedTransactions: getParsedTransactions,

      _getTransactions: getTransactions,
      _sumStartingBalances: sumStartingBalances,
      _extractData: extractData,
      _groupByTransactionType: groupByTransactionType,
      _insertBalances: insertBalances,
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
      return Restangular.one('transactions').get({
        portal_uri: portal_uri,
        profile_code: profile_code,
        account: account,
        date_from: dateRange.getDateFrom(),
        date_to: dateRange.getDateTo()
      }).then(function(transactionsObj){
        if(transactionsObj) {
          factory.startingBalance = sumStartingBalances(transactionsObj.financial_accounts.financial_account);
          if (transactionsObj.financial_transactions) {
            return transactionsObj.financial_transactions.financial_transaction;
          } else {
            return $q.reject('transactions.financial_transactions key is not defined: ' + JSON.stringify(transactionsObj));
          }
        }else{
          return $q.reject('Transactions object is not defined: ' + JSON.stringify(transactionsObj));
        }
      });
    }

    /**
     * Combine starting balances
     * @param {Array} accounts
     * @returns {Number}
     */
    function sumStartingBalances(accounts){
      accounts = _.isArray(accounts) ? accounts : [accounts]; //if not array, wrap in array
      return _.reduce(accounts, function(acc, account){
        return acc + Number(account.beginning_balance);
      }, 0);
    }

    /**
     * Runs transactions through functions to map, group, and reduce them for visualization
     * @param {Object} transactions
     * @param {number} startingBalance
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
        mainDataProcessing: transactionDataManipulation.extractData,
        insertBalances: insertBalances
      });

      return _(transactions)
        .groupByTransactionType()
        .mainDataProcessing('gl_account_description', 'transaction_date')
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
     * Generates balances from starting balance and incomeTotal and expensesTotal arrays
     * @param {Object} types
     * @returns {Object}
     */
    function insertBalances(types, startingBalance){
      types.balances = _(_.zip(_.values(types.incomeTotal), _.values(types.expensesTotal)))
        .reduce(function (acc, totals, index) {
          var lastBalance;
          if(index === 0){
            lastBalance = acc;
            acc = [];
          }else{
            lastBalance = acc[index - 1];
          }
          acc[index] = lastBalance + totals[0] - totals[1]; //income minus expenses since expenses have been made positive
          return acc;
        }, startingBalance);
      return types;
    }
  }
})();
