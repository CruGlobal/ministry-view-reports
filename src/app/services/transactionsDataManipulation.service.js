(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('transactionsDataManipulation', transactionsDataManipulationService);

  /** @ngInject */
  function transactionsDataManipulationService(_, moment, dateRange){
    var factory = {
      extractData: extractData,
      _groupByCategory: groupByCategory,
      _groupByMonth: groupByMonth,
      _reduceAmounts: reduceAmounts,
      _addMissingDates: addMissingDates,
      _insertSummedDates: insertSummedDates,
      _sumDates: sumDates,
      _sortKeysBy: sortKeysBy
    };
    return factory;

    /**
     * Runs transactions through functions to map, group, and reduce them for visualization
     * @param {Object} transactions
     * @param {string} categoryProperty
     * @param {string} dateProperty
     * @param {string} secondCategoryProperty
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
    function extractData(transactions, categoryProperty, dateProperty, secondCategoryProperty) {
      //add processing functions as lodash mixins so they can be used in the lodash chain
      _.mixin({
        groupByCategory: groupByCategory,
        groupByMonth: groupByMonth,
        addMissingDates: addMissingDates,
        sortKeysBy: sortKeysBy,
        insertSummedDates: insertSummedDates
      });

      return _(transactions)
        .mapValues(function(type, typeName) { // for both income, and expenses, etc buckets
          return _(type)
            .groupByCategory(categoryProperty, secondCategoryProperty)
            .mapValues(function(category) { // foreach category bucket
              return _(category)
                .groupByMonth(dateProperty)
                .mapValues(function(accountDescGroup) { // foreach year/month bucket
                  //make expenses positive by flipping sign
                  var signModifier = typeName === 'expenses' ? -1 : 1;
                  //keep transactions in new sub object and add sums
                  return {
                    sum: signModifier * reduceAmounts(accountDescGroup),
                    transactions: accountDescGroup
                  };
                })
                .addMissingDates(dateRange.allDates)
                .value();
            })
            .sortKeysBy()
            .value();
        })
        .insertSummedDates()
        .value();
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
    function groupByCategory(type, property, secondProperty) {
      return _(type)
        .groupBy(function (transaction) {
          var secondPart = secondProperty ? '-' + transaction[secondProperty] : '';
          return transaction[property] + secondPart;
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
    function groupByMonth(category, property) {
      return _(category)
        .groupBy(function (transaction) {
          //create key by combining year and month with a dash in between
          return moment.parseZone(transaction[property]).format('YYYY-MM');
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
     * @param {Object} types
     * @returns {Object}
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
     * @param {Object} categories
     * @returns {Object}
     */
    function sumDates(categories) {
      return _(categories)
        .transform(function (acc, category) {
          _.forEach(category, function (dateObj, date) { //go through each category. dateObj is the object under each date (the key) and looks like {sum: 10: transactions: [...]}
            if (acc[date] === undefined) { //if the bucket corresponding to the date var hasn't been created yet
              acc[date] = 0; //initialize date bucket
            }
            acc[date] += dateObj.sum;
          });
        })
        .values() //drop date keys as they aren't needed
        .value();
    }

    /**
     * Sort object by key
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
  }
})();
