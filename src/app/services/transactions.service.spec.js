(function() {
  'use strict';

  describe('service transactions', function() {
    var $httpBackend, transactions, sampleAllDates, sampleData, processedSampleData;

    beforeEach(module('ministryViewReports'));
    beforeEach(inject(function(_$httpBackend_, _transactions_) {
      $httpBackend = _$httpBackend_;
      transactions = _transactions_;
      transactions._getDateTo = function(){
        return '2014-11-30';
      };
      transactions._getDateFrom = function(){
        return '2014-08-01';
      };
      sampleAllDates = [
        {code: '2014-08', friendly: 'Aug 14'},
        {code: '2014-09', friendly: 'Sep 14'},
        {code: '2014-10', friendly: 'Oct 14'},
        {code: '2014-11', friendly: 'Nov 14'}
      ];
      sampleData = {
        "financial_transactions": {
          "financial_transaction": [
            {
              "code":"2050317",
              "transaction_date":"2014-09-30T00:00:00.000+00:00",
              "amount":"939.5100",
              "description":"US / J Vellacott TRM 1409",
              "reference":null,
              "fiscal_year":"2014",
              "fiscal_period":"9",
              "financial_account_code":"VJ11",
              "gl_account_code":"5099",
              "gl_account_description":"Int'l Income",
              "gl_account_category":null,
              "gl_account_is_income":true,
              "properties":null
            },
            {
              "code":"2050349",
              "transaction_date":"2014-09-30T00:00:00.000+00:00",
              "amount":"35.4300",
              "description":"Jung / Vellacotts TRM 1409",
              "reference":null,
              "fiscal_year":"2014",
              "fiscal_period":"9",
              "financial_account_code":"VJ11",
              "gl_account_code":"5091",
              "gl_account_description":"Europe Income",
              "gl_account_category":null,
              "gl_account_is_income":true,
              "properties":null
            },
            {
              "code":"2075290",
              "transaction_date":"2014-09-30T00:00:00.000+00:00",
              "amount":"-582.1800",
              "description":" Remove negative balance from expense account",
              "reference":null,
              "fiscal_year":"2014",
              "fiscal_period":"9",
              "financial_account_code":"VJ11",
              "gl_account_code":"9011",
              "gl_account_description":"Intra A/C Exp T/f",
              "gl_account_category":null,
              "gl_account_is_income":false,
              "properties":null
            },
            {
              "code":"2086711",
              "transaction_date":"2014-10-01T00:00:00.000+00:00",
              "amount":"40.0000",
              "description":"Atkins / Vellacott Atkins A&A Staff Transfers",
              "reference":null,
              "fiscal_year":"2014",
              "fiscal_period":"10",
              "financial_account_code":"VJ11",
              "gl_account_code":"8010",
              "gl_account_description":"Inc Transfers",
              "gl_account_category":null,
              "gl_account_is_income":true,
              "properties":null
            },
            {
              "code":"2087216",
              "transaction_date":"2014-10-24T00:00:00.000+00:00",
              "amount":"-64.0300",
              "description":"Employers NIC on BASIC for Vellacott Jonathan - Pe",
              "reference":null,
              "fiscal_year":"2014",
              "fiscal_period":"10",
              "financial_account_code":"VJ11",
              "gl_account_code":"7017",
              "gl_account_description":"Employers NI",
              "gl_account_category":null,
              "gl_account_is_income":false,
              "properties":null
            },
            {
              "code":"2087217",
              "transaction_date":"2014-10-24T00:00:00.000+00:00",
              "amount":"-25.1200",
              "description":"Employers NIC on BASIC for Vellacott Chontelle L -",
              "reference":null,
              "fiscal_year":"2014",
              "fiscal_period":"10",
              "financial_account_code":"VJ11",
              "gl_account_code":"7017",
              "gl_account_description":"Employers NI",
              "gl_account_category":null,
              "gl_account_is_income":false,
              "properties":null
            },
            {
              "code":"2087107",
              "transaction_date":"2014-10-24T00:00:00.000+00:00",
              "amount":"-845.0000",
              "description":"BASIC for Vellacott Chontelle L - Period 7 Payroll",
              "reference":null,
              "fiscal_year":"2014",
              "fiscal_period":"10",
              "financial_account_code":"VJ11",
              "gl_account_code":"7010",
              "gl_account_description":"Salary",
              "gl_account_category":null,
              "gl_account_is_income":false,
              "properties":null
            }
          ]
        }
      };
      processedSampleData = {
        "income": {
          "Europe Income": {
            "2014-08": {
              "sum": 0
            },
            "2014-09": {
              "sum": 35.43,
              "transactions": [
                {
                  "code": "2050349",
                  "transaction_date": "2014-09-30T00:00:00.000+00:00",
                  "amount": "35.4300",
                  "description": "Jung / Vellacotts TRM 1409",
                  "reference": null,
                  "fiscal_year": "2014",
                  "fiscal_period": "9",
                  "financial_account_code": "VJ11",
                  "gl_account_code": "5091",
                  "gl_account_description": "Europe Income",
                  "gl_account_category": null,
                  "gl_account_is_income": true,
                  "properties": null
                }
              ]
            },
            "2014-10": {
              "sum": 0
            },
            "2014-11": {
              "sum": 0
            }
          },
          "Inc Transfers": {
            "2014-08": {
              "sum": 0
            },
            "2014-09": {
              "sum": 0
            },
            "2014-10": {
              "sum": 40,
              "transactions": [
                {
                  "code": "2086711",
                  "transaction_date": "2014-10-01T00:00:00.000+00:00",
                  "amount": "40.0000",
                  "description": "Atkins / Vellacott Atkins A&A Staff Transfers",
                  "reference": null,
                  "fiscal_year": "2014",
                  "fiscal_period": "10",
                  "financial_account_code": "VJ11",
                  "gl_account_code": "8010",
                  "gl_account_description": "Inc Transfers",
                  "gl_account_category": null,
                  "gl_account_is_income": true,
                  "properties": null
                }
              ]
            },
            "2014-11": {
              "sum": 0
            }
          },
          "Int'l Income": {
            "2014-08": {
              "sum": 0
            },
            "2014-09": {
              "sum": 939.51,
              "transactions": [
                {
                  "code": "2050317",
                  "transaction_date": "2014-09-30T00:00:00.000+00:00",
                  "amount": "939.5100",
                  "description": "US / J Vellacott TRM 1409",
                  "reference": null,
                  "fiscal_year": "2014",
                  "fiscal_period": "9",
                  "financial_account_code": "VJ11",
                  "gl_account_code": "5099",
                  "gl_account_description": "Int'l Income",
                  "gl_account_category": null,
                  "gl_account_is_income": true,
                  "properties": null
                }
              ]
            },
            "2014-10": {
              "sum": 0
            },
            "2014-11": {
              "sum": 0
            }
          }
        },
        "expenses": {
          "Employers NI": {
            "2014-08": {
              "sum": 0
            },
            "2014-09": {
              "sum": 0
            },
            "2014-10": {
              "sum": -89.15,
              "transactions": [
                {
                  "code": "2087216",
                  "transaction_date": "2014-10-24T00:00:00.000+00:00",
                  "amount": "-64.0300",
                  "description": "Employers NIC on BASIC for Vellacott Jonathan - Pe",
                  "reference": null,
                  "fiscal_year": "2014",
                  "fiscal_period": "10",
                  "financial_account_code": "VJ11",
                  "gl_account_code": "7017",
                  "gl_account_description": "Employers NI",
                  "gl_account_category": null,
                  "gl_account_is_income": false,
                  "properties": null
                },
                {
                  "code": "2087217",
                  "transaction_date": "2014-10-24T00:00:00.000+00:00",
                  "amount": "-25.1200",
                  "description": "Employers NIC on BASIC for Vellacott Chontelle L -",
                  "reference": null,
                  "fiscal_year": "2014",
                  "fiscal_period": "10",
                  "financial_account_code": "VJ11",
                  "gl_account_code": "7017",
                  "gl_account_description": "Employers NI",
                  "gl_account_category": null,
                  "gl_account_is_income": false,
                  "properties": null
                }
              ]
            },
            "2014-11": {
              "sum": 0
            }
          },
          "Intra A/C Exp T/f": {
            "2014-08": {
              "sum": 0
            },
            "2014-09": {
              "sum": -582.18,
              "transactions": [
                {
                  "code": "2075290",
                  "transaction_date": "2014-09-30T00:00:00.000+00:00",
                  "amount": "-582.1800",
                  "description": " Remove negative balance from expense account",
                  "reference": null,
                  "fiscal_year": "2014",
                  "fiscal_period": "9",
                  "financial_account_code": "VJ11",
                  "gl_account_code": "9011",
                  "gl_account_description": "Intra A/C Exp T/f",
                  "gl_account_category": null,
                  "gl_account_is_income": false,
                  "properties": null
                }
              ]
            },
            "2014-10": {
              "sum": 0
            },
            "2014-11": {
              "sum": 0
            }
          },
          "Salary": {
            "2014-08": {
              "sum": 0
            },
            "2014-09": {
              "sum": 0
            },
            "2014-10": {
              "sum": -845,
              "transactions": [
                {
                  "code": "2087107",
                  "transaction_date": "2014-10-24T00:00:00.000+00:00",
                  "amount": "-845.0000",
                  "description": "BASIC for Vellacott Chontelle L - Period 7 Payroll",
                  "reference": null,
                  "fiscal_year": "2014",
                  "fiscal_period": "10",
                  "financial_account_code": "VJ11",
                  "gl_account_code": "7010",
                  "gl_account_description": "Salary",
                  "gl_account_category": null,
                  "gl_account_is_income": false,
                  "properties": null
                }
              ]
            },
            "2014-11": {
              "sum": 0
            }
          }
        },
        "incomeTotal": {
          "2014-08": 0,
          "2014-09": 974.9399999999999,
          "2014-10": 40,
          "2014-11": 0
        },
        "expensesTotal": {
          "2014-08": 0,
          "2014-09": -582.18,
          "2014-10": -934.15,
          "2014-11": 0
        }
      };
    }));

    it('should be registered', function() {
      expect(transactions).not.toEqual(null);
    });

    describe('getParsedTransactions function', function(){
      it('should be run everything', function(){
        // for dates rely on overwritten _getDateTo and _getDateFrom above
        $httpBackend.expectGET('/ministry_view/transactions?date_from=' + transactions._getDateFrom() + '&date_to=' + transactions._getDateTo() + '').respond(200, sampleData);
        transactions.getParsedTransactions().then(function(data){
          expect(data).toEqual(processedSampleData);
        });
        $httpBackend.flush();
      });
    });

    describe('getTransactions function', function() {
      it('should request transactions from the server', function() {
        // for dates rely on overwritten _getDateTo and _getDateFrom above
        $httpBackend.expectGET('/ministry_view/transactions?date_from=' + transactions._getDateFrom() + '&date_to=' + transactions._getDateTo() + '').respond(200, sampleData);
        transactions._getTransactions().then(function(data){
          expect(data).toEqual(sampleData.financial_transactions.financial_transaction);
        });
        $httpBackend.flush();
      });
    });

    describe('extractData function', function(){
      it('should process input data and extract everything needed', function(){
        transactions.allDates = sampleAllDates;
        expect(transactions._extractData(sampleData.financial_transactions.financial_transaction)).toEqual(processedSampleData);
      });
    });

    describe('groupByTransactionType function', function(){
      it('should return an object containing income and expense arrays split by gl_account_is_income', function(){
        expect(transactions._groupByTransactionType([
          {amount: 10, gl_account_is_income: true},
          {amount: -5, gl_account_is_income: true},
          {amount: 20, gl_account_is_income: false},
          {amount: -30, gl_account_is_income: false}
        ])).toEqual({
          income: [{amount: 10, gl_account_is_income: true}, {amount: -5, gl_account_is_income: true}],
          expenses: [{amount: 20, gl_account_is_income: false}, {amount: -30, gl_account_is_income: false}]
        });
      });
    });

    describe('groupByCategory function', function(){
      it('should return arrays which are buckets for each category', function(){
        expect(transactions._groupByCategory([
          {gl_account_description: '1st', amount: 10},
          {gl_account_description: '2nd', amount: 5},
          {gl_account_description: '1st', amount: 7},
          {gl_account_description: '3rd', amount: 20},
          {gl_account_description: '2nd', amount: 15}
        ])).toEqual({
          '1st': [{gl_account_description: '1st', amount: 10}, {gl_account_description: '1st', amount: 7}],
          '2nd': [{gl_account_description: '2nd', amount: 5}, {gl_account_description: '2nd', amount: 15}],
          '3rd': [{gl_account_description: '3rd', amount: 20}]
        });
      });
    });

    describe('groupByMonth function', function(){
      it('should return arrays which are buckets for each year/month group', function(){
        expect(transactions._groupByMonth([
          {gl_account_description: '1st', amount: 10, "fiscal_year": "2014", "fiscal_period": "12"},
          {gl_account_description: '1st', amount: 5, "fiscal_year": "2014", "fiscal_period": "12"},
          {gl_account_description: '1st', amount: 7, "fiscal_year": "2015", "fiscal_period": "1"},
          {gl_account_description: '1st', amount: 20, "fiscal_year": "2015", "fiscal_period": "1"},
          {gl_account_description: '1st', amount: 15, "fiscal_year": "2015", "fiscal_period": "2"}
        ])).toEqual({
          '2014-12': [{gl_account_description: '1st', amount: 10, "fiscal_year": "2014", "fiscal_period": "12"},
            {gl_account_description: '1st', amount: 5, "fiscal_year": "2014", "fiscal_period": "12"}],
          '2015-01': [{gl_account_description: '1st', amount: 7, "fiscal_year": "2015", "fiscal_period": "1"},
            {gl_account_description: '1st', amount: 20, "fiscal_year": "2015", "fiscal_period": "1"}],
          '2015-02': [{gl_account_description: '1st', amount: 15, "fiscal_year": "2015", "fiscal_period": "2"}]
        });
      });
    });

    describe('reduceAmounts function', function(){
      it('should sum all amounts in array', function(){
        expect(transactions._reduceAmounts([
          {gl_account_description: '1st', amount: 10, "fiscal_year": "2014", "fiscal_period": "12"},
          {gl_account_description: '1st', amount: 5, "fiscal_year": "2014", "fiscal_period": "12"},
          {gl_account_description: '1st', amount: 7, "fiscal_year": "2015", "fiscal_period": "1"},
          {gl_account_description: '1st', amount: 20, "fiscal_year": "2015", "fiscal_period": "1"},
          {gl_account_description: '1st', amount: 15, "fiscal_year": "2015", "fiscal_period": "2"}
        ])).toEqual(10 + 5 + 7 + 20 + 15);
      });
    });

    describe('addMissingDates function', function(){
      var allDates;
      beforeEach(function(){
        allDates = transactions._generateDateRange('2015-01-01', '2015-05-30');
      });
      it('should add dates that are not already in object', function(){
        expect(transactions._addMissingDates({
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

    describe('insertSummedDates and sumDates functions', function(){
      var incomeTestData, incomeTotal;
      beforeEach(function(){
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
        incomeTotal = {
          "2014-09": 12 + 15 + 51,
          "2014-10": 35 + 65 + 42,
          "2014-11": 87 + 73 + 36
        };
      });
      it('sumDates should return an array of sums for each month across categories', function(){
        expect(transactions._sumDates(incomeTestData)).toEqual(incomeTotal);
      });

      it('insertSummedDates should be insert totals into main object', function(){
        expect(transactions._insertSummedDates({
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

    describe('generateDateRange function', function(){
      it('should return an array of dates in between start and end dates', function(){
        expect(transactions._generateDateRange('2014-12-01', '2015-02-28')).toEqual([
          {code: '2014-12', friendly: 'Dec 14'},
          {code: '2015-01', friendly: 'Jan 15'},
          {code: '2015-02', friendly: 'Feb 15'}
        ]);
      });
    });


  });
})();
