(function () {
  'use strict';

  describe('service dateRange', function () {
    var dateRange;

    beforeEach(module('ministryViewReports'));
    beforeEach(inject(function (_dateRange_) {
      dateRange = _dateRange_;
    }));

    it('should be registered', function () {
      expect(dateRange).not.toEqual(null);
    });

    describe('generateDateRange function', function () {
      it('should return an array of dates in between start and end dates', function () {
        expect(dateRange._generateDateRange('2014-12-01', '2015-02-28')).toEqual([
          {code: '2014-12', friendly: 'Dec 14'},
          {code: '2015-01', friendly: 'Jan 15'},
          {code: '2015-02', friendly: 'Feb 15'}
        ]);
      });
    });

  });
})();
