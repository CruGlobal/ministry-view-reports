(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .factory('dateRange', dateRangeService);

  /** @ngInject */
  function dateRangeService(moment){
    var factory = {
      allDates: [],

      getDateFrom: getDateFrom,
      getDateTo: getDateTo,
      _generateDateRange: generateDateRange
    };

    activate();

    return factory;

    function activate(){
      factory.allDates = generateDateRange(getDateFrom(), getDateTo());
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
