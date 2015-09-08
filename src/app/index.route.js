(function() {
  'use strict';

  angular
    .module('ministryViewReports')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: '/app/components/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true).hashPrefix('!');
  }

})();
