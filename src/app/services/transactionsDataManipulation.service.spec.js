(function () {
  'use strict';

  describe('service transactionsDataManipulation', function () {
    var transactionsDataManipulation, dateRange, sampleStartingBalance, sampleData, processedSampleData;

    beforeEach(module('ministryViewReports'));
    beforeEach(function(){

      module(function($provide) {
        $provide.factory('dateRange', function(){
          return {
            getDateFrom: function () {
              return '2014-08-01';
            },
            getDateTo: function () {
              return '2014-10-31';
            },
            allDates: [
              {code: '2014-08', friendly: 'Aug 14'},
              {code: '2014-09', friendly: 'Sep 14'},
              {code: '2014-10', friendly: 'Oct 14'}
            ]
          };
        });
      });
      sampleStartingBalance = 20038.74;
      sampleData = {
        income: [
          {
            "amount": "939.5100",
            "description": "US / J Vellacott TRM 1409",
            "transaction_date": "2014-08-22T00:00:00.000+00:00",
            "gl_account_description": "Int'l Income"
          },
          {
            "amount": "35.4300",
            "description": "Jung / Vellacotts TRM 1409",
            "transaction_date": "2014-08-23T00:00:00.000+00:00",
            "gl_account_description": "Europe Income"
          },
          {
            "amount": "40.0000",
            "description": "Atkins / Vellacott Atkins A&A Staff Transfers",
            "transaction_date": "2014-09-23T00:00:00.000+00:00",
            "gl_account_description": "Inc Transfers"
          },
          {
            "amount": "64.0300",
            "description": "Other Income",
            "transaction_date": "2014-09-23T00:00:00.000+00:00",
            "gl_account_description": "Gift Aid"
          },
          {
            "amount": "25.1200",
            "description": "2nd Other income",
            "transaction_date": "2014-10-23T00:00:00.000+00:00",
            "gl_account_description": "Gift Aid"
          }
        ]
      };
      processedSampleData = {
        "income": {
          "Europe Income": {
            "2014-08": {
              "sum": 35.43,
              "transactions": [{
                "amount": "35.4300",
                "description": "Jung / Vellacotts TRM 1409",
                "transaction_date": "2014-08-23T00:00:00.000+00:00",
                "gl_account_description": "Europe Income"
              }]
            },
            "2014-09": {"sum": 0},
            "2014-10": {"sum": 0}
          },
          "Gift Aid": {
            "2014-08": {sum: 0},
            "2014-09": {
              "sum": 64.03,
              transactions: [{
                "amount": "64.0300",
                "description": "Other Income",
                "transaction_date": "2014-09-23T00:00:00.000+00:00",
                "gl_account_description": "Gift Aid"
              }]
            },
            "2014-10": {
              sum: 25.12,
              transactions: [
                {
                  "amount": "25.1200",
                  "description": "2nd Other income",
                  "transaction_date": "2014-10-23T00:00:00.000+00:00",
                  "gl_account_description": "Gift Aid"
                }
              ]
            }
          },
          "Inc Transfers": {
            "2014-08": {"sum": 0},
            "2014-09": {
              sum: 40,
              transactions: [{
                "amount": "40.0000",
                "description": "Atkins / Vellacott Atkins A&A Staff Transfers",
                "transaction_date": "2014-09-23T00:00:00.000+00:00",
                "gl_account_description": "Inc Transfers"
              }]
            },
            "2014-10": {
              "sum": 0
            }
          },
          "Int'l Income": {
            "2014-08": {
              "sum": 939.51,
              transactions: [{
                "amount": "939.5100",
                "description": "US / J Vellacott TRM 1409",
                "transaction_date": "2014-08-22T00:00:00.000+00:00",
                "gl_account_description": "Int'l Income"
              }]
            },
            "2014-09": {sum: 0},
            "2014-10": {"sum": 0}
          }
        },
        "incomeTotal": [974.9399999999999, 104.03, 25.12]
      };

      inject(function (_transactionsDataManipulation_, _dateRange_) {
        transactionsDataManipulation = _transactionsDataManipulation_;
        dateRange = _dateRange_;
      });
    });

    it('should be registered', function () {
      expect(transactionsDataManipulation).not.toEqual(null);
    });

    describe('extractData function', function () {
      it('should process input data and extract everything needed', function () {

        expect(transactionsDataManipulation.extractData(sampleData, 'gl_account_description', 'transaction_date')).toEqual(processedSampleData);
      });
    });

    describe('groupByCategory function', function () {
      it('should return arrays which are buckets for each category', function () {
        expect(transactionsDataManipulation._groupByCategory([
          {gl_account_description: '1st', amount: 10},
          {gl_account_description: '2nd', amount: 5},
          {gl_account_description: '1st', amount: 7},
          {gl_account_description: '3rd', amount: 20},
          {gl_account_description: '2nd', amount: 15}
        ], 'gl_account_description')).toEqual({
          '1st': [{gl_account_description: '1st', amount: 10}, {gl_account_description: '1st', amount: 7}],
          '2nd': [{gl_account_description: '2nd', amount: 5}, {gl_account_description: '2nd', amount: 15}],
          '3rd': [{gl_account_description: '3rd', amount: 20}]
        });
      });
    });

    describe('groupByMonth function', function () {
      it('should return arrays which are buckets for each year/month group', function () {
        expect(transactionsDataManipulation._groupByMonth([
          {gl_account_description: '1st', amount: 10, transaction_date: "2014-12-23T00:00:00.000+00:00"},
          {gl_account_description: '1st', amount: 5, transaction_date: "2014-12-31T00:00:00.000+00:00"},
          {gl_account_description: '1st', amount: 7, transaction_date: "2015-01-02T00:00:00.000+00:00"},
          {gl_account_description: '1st', amount: 20, transaction_date: "2015-01-31T00:00:00.000+00:00"},
          {gl_account_description: '1st', amount: 15, transaction_date: "2015-02-23T00:00:00.000+00:00"}
        ], 'transaction_date')).toEqual({
          '2014-12': [{gl_account_description: '1st', amount: 10, transaction_date: "2014-12-23T00:00:00.000+00:00"},
            {gl_account_description: '1st', amount: 5, transaction_date: "2014-12-31T00:00:00.000+00:00"}],
          '2015-01': [{gl_account_description: '1st', amount: 7, transaction_date: "2015-01-02T00:00:00.000+00:00"},
            {gl_account_description: '1st', amount: 20, transaction_date: "2015-01-31T00:00:00.000+00:00"}],
          '2015-02': [{gl_account_description: '1st', amount: 15, transaction_date: "2015-02-23T00:00:00.000+00:00"}]
        });
      });
    });

    describe('reduceAmounts function', function () {
      it('should sum all amounts in array', function () {
        expect(transactionsDataManipulation._reduceAmounts([
          {gl_account_description: '1st', amount: 10, "fiscal_year": "2014", "fiscal_period": "12"},
          {gl_account_description: '1st', amount: 5, "fiscal_year": "2014", "fiscal_period": "12"},
          {gl_account_description: '1st', amount: 7, "fiscal_year": "2015", "fiscal_period": "1"},
          {gl_account_description: '1st', amount: 20, "fiscal_year": "2015", "fiscal_period": "1"},
          {gl_account_description: '1st', amount: 15, "fiscal_year": "2015", "fiscal_period": "2"}
        ])).toEqual(10 + 5 + 7 + 20 + 15);
      });
    });

    describe('addMissingDates function', function () {
      var allDates;
      beforeEach(function () {
        allDates = [{code: '2015-01'}, {code: '2015-02'}, {code: '2015-03'}, {code: '2015-04'}, {code: '2015-05'}];
      });
      it('should add dates that are not already in object', function () {
        expect(transactionsDataManipulation._addMissingDates({
          "2015-01": {"sum": 85, transactions: {}},
          "2015-03": {"sum": 92, transactions: {}}
        }, allDates)).toEqual({
          "2015-01": {"sum": 85, transactions: {}},
          "2015-02": {"sum": 0},
          "2015-03": {"sum": 92, transactions: {}},
          "2015-04": {"sum": 0},
          "2015-05": {"sum": 0}
        });
      });
    });

    describe('insertSummedDates and sumDates functions', function () {
      var incomeTestData, incomeTotal;
      beforeEach(function () {
        incomeTestData = {
          "Inc Transfers": {
            "2014-09": {sum: 12},
            "2014-10": {sum: 35},
            "2014-11": {sum: 87}
          },
          "Gift Aid": {
            "2014-09": {sum: 15},
            "2014-10": {sum: 65},
            "2014-11": {sum: 73}
          },
          "Local Income": {
            "2014-09": {sum: 51},
            "2014-10": {sum: 42},
            "2014-11": {sum: 36}
          }
        };
        incomeTotal = [
          12 + 15 + 51,
          35 + 65 + 42,
          87 + 73 + 36
        ];
      });
      it('sumDates should return an array of sums for each month across categories', function () {
        expect(transactionsDataManipulation._sumDates(incomeTestData)).toEqual(incomeTotal);
      });

      it('insertSummedDates should be insert totals into main object', function () {
        expect(transactionsDataManipulation._insertSummedDates({
          income: incomeTestData,
          expenses: incomeTestData
        })).toEqual({
          income: incomeTestData,
          expenses: incomeTestData,
          incomeTotal: incomeTotal,
          expensesTotal: incomeTotal
        });
      });
    });

    describe('sortKeysBy function', function () {
      it('should sort and object by keys', function () {
        expect(transactionsDataManipulation._sortKeysBy({d: 4, a: 1, c: 3, b: 2})).toEqual({a: 1, b: 2, c: 3, d: 4});
      });
    });

  });
})();
