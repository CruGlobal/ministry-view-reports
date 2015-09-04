(function() {
  'use strict';

  angular
    .module('globalStaffAccountReport')
    .controller('MainController', [MainController]);

  /** @ngInject */
  function MainController() {
    this.dropdowns = {
      country: [
        {
          id: 'us',
          name: "United States"
        }, {
          id: 'ca',
          name: "Canada"
        }
      ],
      profile: [
        {
          id: '1',
          name: "1st"
        }, {
          id: '2',
          name: "2nd"
        }
      ],
      account: [
        {
          id: '1',
          name: "1st"
        }, {
          id: '2',
          name: "2nd"
        }
      ]
    };
    this.data = {
      months: [
        'Sep 14',
        'Oct 14',
        'Nov 14',
        'Dec 14',
        'Jan 15',
        'Feb 15',
        'Mar 15',
        'Apr 15',
        'May 15',
        'Jun 15',
        'Jul 15',
        'Aug 15',
        'Sep 15'
      ],
      income: {
        totals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      },
      expenses: {
        totals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      },
      balance: {
        totals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      }
    };

  }
})();
