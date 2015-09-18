(function() {
  'use strict';

  describe('service visualization', function() {
    var visualization;

    beforeEach(module('ministryViewReports'));
    beforeEach(inject(function(_visualization_) {
      visualization = _visualization_;
    }));

    it('should be registered', function() {
      expect(visualization).not.toEqual(null);
    });

    describe('mapTransactionData function', function(){
      var sampleAllDates, sampleData, processedSampleData;
      beforeEach(function () {
        sampleAllDates = [
          {code: '2014-08', friendly: 'Aug 14'},
          {code: '2014-09', friendly: 'Sep 14'},
          {code: '2014-10', friendly: 'Oct 14'}
        ];
        sampleData = {
          "incomeTotal": [
            100,
            50,
            1
          ],
          "expensesTotal": [
            200,
            60,
            2
          ],
          "balances": [
            300,
            70,
            3
          ]
        };
        processedSampleData = [
          {
            c: [
              {
                v: new Date('Fri Aug 01 2014 00:00:00 GMT-0400 (EDT)')
              },
              {
                v: '100.00'
              },
              {
                v: '200.00'
              },
              {
                v: '300.00'
              },
              {
                v: null
              }
            ]
          },
          {
            c: [
              {
                v: new Date('Mon Sep 01 2014 00:00:00 GMT-0400 (EDT)')
              },
              {
                v: '50.00'
              },
              {
                v: '60.00'
              },
              {
                v: '70.00'
              },
              {
                v: null
              }
            ]
          },
          {
            c: [
              {
                v: new Date('Wed Oct 01 2014 00:00:00 GMT-0400 (EDT)')
              },
              {
                v: '1.00'
              },
              {
                v: '2.00'
              },
              {
                v: '3.00'
              },
              {
                v: null
              }
            ]
          }
        ];
      });
      it('should map data into the Google DataTable literal string format', function(){
        expect(visualization._mapTransactionData(sampleAllDates, sampleData)).toEqual(processedSampleData);
      });
    });

    describe('insertAvgIncome function', function(){
      it('should insert average income into data object', function(){
        var incomeData = [0, 1, 2, 3, 4, 5 , 6, 7, 8, 9, 10, 11, 12];
        expect(visualization._insertAvgIncome({incomeTotal: incomeData}))
          .toEqual({incomeTotal: incomeData, avgIncome: [null, null, null, null, null, null, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, null]});
      });
    });

    describe('calculateAvgIncome function', function(){
      it('should calculate average income over last 6 months skipping the current month', function(){
        var incomeData = [0, 1, 2, 3, 4, 5 , 6, 7, 8, 9, 10, 11, 12];
        expect(visualization._calculateAvgIncome(incomeData))
          .toEqual(8.5);
      });
    });

  });
})();
