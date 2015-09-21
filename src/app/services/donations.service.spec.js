(function () {
  'use strict';

  describe('service donations', function () {
    var $httpBackend, Restangular, donations, dateRange, sampleData, processedSampleData;

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
              {code: '2014-06'},
              {code: '2014-07'},
              {code: '2014-08'}
            ]
          };
        });
      });
      sampleData = [
        {
          "donor_name": "Donor 1",
          "gift_date": "2014-06-23T00:00:00.000+00:00",
          "amount": "2.0000",
        },
        {
          "donor_name": "Donor 1",
          "gift_date": "2014-07-23T00:00:00.000+00:00",
          "amount": "3.0000",
        },
        {
          "donor_name": "Donor 2",
          "gift_date": "2014-07-01T00:00:00.000+00:00",
          "amount": "25.0000"
        },
        {
          "donor_name": "Donor 2",
          "gift_date": "2014-07-01T00:00:00.000+00:00",
          "amount": "6.2500"
        }
      ];
      processedSampleData = {
        "donations": {
          "Donor 1": {
            "2014-06": {
              "sum": 2,
              "transactions": [
                {
                  "donor_name": "Donor 1",
                  "gift_date": "2014-06-23T00:00:00.000+00:00",
                  "amount": "2.0000",
                }
              ]
            },
            "2014-07": {
              "sum": 3,
              "transactions": [
                {
                  "donor_name": "Donor 1",
                  "gift_date": "2014-07-23T00:00:00.000+00:00",
                  "amount": "3.0000",
                }
              ]
            },
            "2014-08": {
              "sum": 0
            }
          },
          "Donor 2": {
            "2014-06": {
              "sum": 0
            },
            "2014-07": {
              "sum": 31.25,
              "transactions": [
                {
                  "donor_name": "Donor 2",
                  "gift_date": "2014-07-01T00:00:00.000+00:00",
                  "amount": "25.0000"
                },
                {
                  "donor_name": "Donor 2",
                  "gift_date": "2014-07-01T00:00:00.000+00:00",
                  "amount": "6.2500"
                }
              ]
            },
            "2014-08": {
              "sum": 0
            }
          }
        },
        donationsTotal: [2, 34.25, 0]
      };

      inject(function (_$httpBackend_, _Restangular_,  _donations_, _dateRange_) {
        $httpBackend = _$httpBackend_;
        Restangular = _Restangular_;
        donations = _donations_;
        dateRange = _dateRange_;
      });
    });

    it('should be registered', function () {
      expect(donations).not.toEqual(null);
    });

    describe('getParsedDonations function', function () {
      it('should be run everything', function () {
        $httpBackend.expectGET('/ministry_view/donations?date_from=' + dateRange.getDateFrom() + '&date_to=' + dateRange.getDateTo() + '').respond(200, sampleData);
        donations.getParsedDonations().then(function (data) {
          expect(data).toEqual(processedSampleData);
        });
        $httpBackend.flush();
      });
    });

    describe('getDonations function', function () {
      it('should request donations from the server', function () {
        // for dates rely on overwritten _getDateTo and _getDateFrom above
        $httpBackend.expectGET('/ministry_view/donations?date_from=' + dateRange.getDateFrom() + '&date_to=' + dateRange.getDateTo() + '').respond(200, sampleData);
        donations._getDonations().then(function (data) {
          expect(Restangular.stripRestangular(data)).toEqual(sampleData);
        });
        $httpBackend.flush();
      });
    });

    describe('extractData function', function () {
      it('should process input data and extract everything needed', function () {

        expect(donations._extractData(sampleData, 'donor_name', 'gift_date')).toEqual(processedSampleData);
      });
    });

  });
})();

