(function() {
  'use strict';

  describe('service profiles', function() {
    var profiles;

    beforeEach(module('ministryViewReports'));
    beforeEach(inject(function(_profiles_) {
      profiles = _profiles_;
    }));

    it('should be registered', function() {
      expect(profiles).not.toEqual(null);
    });

    describe('wrapAccountsInArray function', function(){
      it('should wrap a single object in an array', function(){
        var sampleData = [
          {
            financial_accounts: {
              financial_account_info: {}
            }
          }
        ];
        var processedSampleData = [
          {
            financial_accounts: {
              financial_account_info: [{}]
            }
          }
        ];
        expect(profiles._wrapAccountsInArray(sampleData)).toEqual(processedSampleData);
      });

      it('should not wrap an array in an array', function(){
        var sampleData = [
          {
            financial_accounts: {
              financial_account_info: []
            }
          }
        ];
        expect(profiles._wrapAccountsInArray(sampleData)).toEqual(sampleData);
      });

      it('should handle multiple profiles', function(){
        var sampleData = [
          {
            financial_accounts: {
              financial_account_info: []
            }
          },
          {
            financial_accounts: {
              financial_account_info: {}
            }
          }
        ];
        var processedSampleData = [
          {
            financial_accounts: {
              financial_account_info: []
            }
          },
          {
            financial_accounts: {
              financial_account_info: [{}]
            }
          }
        ];
        expect(profiles._wrapAccountsInArray(sampleData)).toEqual(processedSampleData);
      });
    });

  });
})();
