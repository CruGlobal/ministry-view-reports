(function() {
  'use strict';

  describe('path', function(){
    var $rootScope, $location, $state, $stateParams, $templateCache, global;

    function mockTemplate(templateRoute, tmpl) {
      $templateCache.put(templateRoute, tmpl || templateRoute);
    }

    function goTo(url) {
      $location.url(url);
      $rootScope.$digest();
    }

    beforeEach(function() {
      module('ministryViewReports');

      inject(function (_$rootScope_, _$location_, _$state_, _$stateParams_, _$templateCache_, _global_) {
        $rootScope = _$rootScope_;
        $location = _$location_;
        $state = _$state_;
        $stateParams = _$stateParams_;
        $templateCache = _$templateCache_;
        global = _global_;
      });
      mockTemplate('/app/components/main/main.html');
    });


    describe('when empty', function () {
      beforeEach(function(){
        goTo('');
      });
      it('should go to the main state', function () {
        expect($state.current.name).toEqual('main');
      });
    });
    describe('/', function () {
      beforeEach(function(){
        goTo('/');
      });
      it('should go to the main state', function () {
        expect($state.current.name).toEqual('main');
      });
    });
  });
})();
