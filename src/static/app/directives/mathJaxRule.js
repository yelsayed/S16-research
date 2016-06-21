(function() {
    "use strict";
    /*jshint multistr: true */
    angular.module('derivationEditor')
        .directive("mathjaxRule", function() {
            return {
                restrict: "E",
                transclude: true,
                templateUrl: '/static/includes/mathjax-rule.html'
            };
        });
})();
