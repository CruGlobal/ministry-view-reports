(function () {
  'use strict';

  describe('service transactions', function () {
    var $httpBackend, transactions, dateRange, sampleStartingBalance, sampleData, processedSampleData;

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
        "financial_accounts": {
          "financial_account": [
            {
              "beginning_balance": "20038.7400"
            },
            {
              "beginning_balance": "0.0000"
            }
          ]
        },
        "financial_transactions": {
          "financial_transaction": [
            {
              "amount": "939.5100",
              "description": "US / J Vellacott TRM 1409",
              "transaction_date": "2014-09-23T00:00:00.000+00:00",
              "gl_account_description": "Int'l Income",
              "gl_account_is_income": true
            },
            {
              "amount": "35.4300",
              "description": "Jung / Vellacotts TRM 1409",
              "transaction_date": "2014-09-23T00:00:00.000+00:00",
              "gl_account_description": "Europe Income",
              "gl_account_is_income": true
            },
            {
              "amount": "40.0000",
              "description": "Atkins / Vellacott Atkins A&A Staff Transfers",
              "transaction_date": "2014-10-01T00:00:00.000+00:00",
              "gl_account_description": "Inc Transfers",
              "gl_account_is_income": true
            },
            {
              "amount": "-64.0300",
              "description": "Employers NIC on BASIC for Vellacott Jonathan - Pe",
              "transaction_date": "2014-10-31T00:00:00.000+00:00",
              "gl_account_description": "Employers NI",
              "gl_account_is_income": false
            },
            {
              "amount": "-25.1200",
              "description": "Employers NIC on BASIC for Vellacott Chontelle L -",
              "transaction_date": "2014-10-23T00:00:00.000+00:00",
              "gl_account_description": "Employers NI",
              "gl_account_is_income": false
            }
          ]
        }
      };
      processedSampleData = {
        "income": {
          "Europe Income": {
            "2014-08": {"sum": 0},
            "2014-09": {
              "sum": 35.43,
              "transactions": [{
                "amount": "35.4300",
                "description": "Jung / Vellacotts TRM 1409",
                "transaction_date": "2014-09-23T00:00:00.000+00:00",
                "gl_account_description": "Europe Income",
                "gl_account_is_income": true
              }]
            },
            "2014-10": {"sum": 0}
          },
          "Inc Transfers": {
            "2014-08": {"sum": 0},
            "2014-09": {"sum": 0},
            "2014-10": {
              "sum": 40,
              "transactions": [{
                "amount": "40.0000",
                "description": "Atkins / Vellacott Atkins A&A Staff Transfers",
                "transaction_date": "2014-10-01T00:00:00.000+00:00",
                "gl_account_description": "Inc Transfers",
                "gl_account_is_income": true
              }]
            }
          },
          "Int'l Income": {
            "2014-08": {"sum": 0},
            "2014-09": {
              "sum": 939.51,
              "transactions": [{
                "amount": "939.5100",
                "description": "US / J Vellacott TRM 1409",
                "transaction_date": "2014-09-23T00:00:00.000+00:00",
                "gl_account_description": "Int'l Income",
                "gl_account_is_income": true
              }]
            },
            "2014-10": {"sum": 0}
          }
        },
        "expenses": {
          "Employers NI": {
            "2014-08": {"sum": 0},
            "2014-09": {"sum": 0},
            "2014-10": {
              "sum": 89.15,
              "transactions": [
                {
                  "amount": "-64.0300",
                  "description": "Employers NIC on BASIC for Vellacott Jonathan - Pe",
                  "transaction_date": "2014-10-31T00:00:00.000+00:00",
                  "gl_account_description": "Employers NI",
                  "gl_account_is_income": false
                },
                {
                  "amount": "-25.1200",
                  "description": "Employers NIC on BASIC for Vellacott Chontelle L -",
                  "transaction_date": "2014-10-23T00:00:00.000+00:00",
                  "gl_account_description": "Employers NI",
                  "gl_account_is_income": false
                }
              ]
            }
          }
        },
        "incomeTotal": [0, 974.9399999999999, 40],
        "expensesTotal": [0, 0, 89.15],
        "balances": [20038.74, 21013.68, 20964.53]
      };

      inject(function (_$httpBackend_, _transactions_, _dateRange_) {
        $httpBackend = _$httpBackend_;
        transactions = _transactions_;
        dateRange = _dateRange_;
      });
    });

    it('should be registered', function () {
      expect(transactions).not.toEqual(null);
    });

    describe('getParsedTransactions function', function () {
      it('should be run everything', function () {
        $httpBackend.expectGET('/ministry_view/transactions?date_from=' + dateRange.getDateFrom() + '&date_to=' + dateRange.getDateTo() + '').respond(200, sampleData);
        transactions.getParsedTransactions().then(function (data) {
          expect(data).toEqual(processedSampleData);
        });
        $httpBackend.flush();
      });
    });

    describe('getTransactions function', function () {
      it('should request transactions from the server', function () {
        // for dates rely on overwritten _getDateTo and _getDateFrom above
        $httpBackend.expectGET('/ministry_view/transactions?date_from=' + dateRange.getDateFrom() + '&date_to=' + dateRange.getDateTo() + '').respond(200, sampleData);
        transactions._getTransactions().then(function (data) {
          expect(data).toEqual(sampleData.financial_transactions.financial_transaction);
        });
        $httpBackend.flush();
      });
    });

    describe('sumStartingBalances function', function () {
      it('should add up starting balances from all accounts chosen', function () {
        expect(transactions._sumStartingBalances([{beginning_balance: "10"}, {beginning_balance: "20"}])).toEqual(30);
      });
      it('should handle a single object', function () {
        expect(transactions._sumStartingBalances({beginning_balance: "10"})).toEqual(10);
      });
    });

    describe('extractData function', function () {
      it('should process input data and extract everything needed', function () {

        expect(transactions._extractData(sampleData.financial_transactions.financial_transaction, sampleStartingBalance)).toEqual(processedSampleData);
      });
    });

    describe('groupByTransactionType function', function () {
      it('should return an object containing income and expense arrays split by gl_account_is_income', function () {
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

    describe('insertBalances function', function () {
      it('should compute balances over each month and add the array to the main object', function () {
        expect(transactions._insertBalances({
          "incomeTotal": {"2014-08": 0, "2014-09": 974.9399999999999, "2014-10": 40, "2014-11": 0},
          "expensesTotal": {"2014-08": 0, "2014-09": 582.18, "2014-10": 934.15, "2014-11": 0}
        }, sampleStartingBalance)).toEqual({
          "incomeTotal": {"2014-08": 0, "2014-09": 974.9399999999999, "2014-10": 40, "2014-11": 0},
          "expensesTotal": {"2014-08": 0, "2014-09": 582.18, "2014-10": 934.15, "2014-11": 0},
          "balances": [20038.74, 20431.5, 19537.35, 19537.35]
        });
      });
    });

  });
})();

