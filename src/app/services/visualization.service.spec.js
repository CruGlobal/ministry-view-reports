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
                v: 'Aug 14'
              },
              {
                v: 100
              },
              {
                v: 200
              },
              {
                v: 300
              }
            ]
          },
          {
            c: [
              {
                v: 'Sep 14'
              },
              {
                v: 50
              },
              {
                v: 60
              },
              {
                v: 70
              }
            ]
          },
          {
            c: [
              {
                v: 'Oct 14'
              },
              {
                v: 1
              },
              {
                v: 2
              },
              {
                v: 3
              }
            ]
          }
        ];
      });
      it('should map data into the Google DataTable literal string format', function(){
        expect(visualization._mapTransactionData(sampleAllDates, sampleData)).toEqual(processedSampleData);
      });
    });

  });
})();
