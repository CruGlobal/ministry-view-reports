(function() {
  'use strict';

  describe('service transactions', function() {
    var $httpBackend, transactions;

    beforeEach(module('ministryViewReports'));
    beforeEach(inject(function(_$httpBackend_, _transactions_) {
      $httpBackend = _$httpBackend_;
      transactions = _transactions_;
    }));

    it('should be registered', function() {
      expect(transactions).not.toEqual(null);
    });

    describe('getTransactions function', function() {
      it('should exist', function() {
        expect(transactions._getTransactions).not.toEqual(undefined);
      });

      it('should request transactions from the server', function() {
        $httpBackend.expectGET('/json/ministry_view/transactions.json?date_from=' + transactions._getDateFrom() + '&date_to=' + transactions._getDateTo() + '').respond(200, {
          "financial_transactions": {
            "financial_transaction": [
              {
                "amount": "40.0000",
                "fiscal_year": "2014",
                "fiscal_period": "9",
                "gl_account_description": "Inc Transfers"
              }
            ]
          }
        });
        transactions._getTransactions().then(function(data){
          expect(data).toEqual([
            {
              "amount": "40.0000",
              "fiscal_year": "2014",
              "fiscal_period": "9",
              "gl_account_description": "Inc Transfers"
            }
          ]);
        });
        $httpBackend.flush();
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

    describe('groupByTransactionType function', function(){
      it('should return an object income and expense arrays split by the sign on the amount', function(){
        expect(transactions._groupByTransactionType([{amount: 10}, {amount: -5}, {amount: 20}, {amount: -30}])).toEqual({
          income: [{amount: 10}, {amount: 20}],
          expenses: [{amount: -5}, {amount: -30}]
        });
      });
      //TODO: what if amount is 0?
    })


  });
})();
