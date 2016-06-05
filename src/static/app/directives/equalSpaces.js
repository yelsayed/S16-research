(function () {
    "use strict";
    angular.module('derivationEditor')
        .directive('equalSpaces', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function () {
                        var length = elem.children().length;
                        // console.log(elem.children().context.children);
                        if (length > 1) {
                            for (var i = 0; i < length; i++) {
                                var d = elem.children().context.children[i];
                                if (length > 4) {
                                    d.className += " col-xs-3 center";
                                } else {
                                    var string = " col-xs-" + (12 / length) + " center";
                                    d.className += string;
                                }
                                var width = angular.element('.branch-children').css("width");
                                width = width.substring(0, width.length - 2);
                                console.log((parseInt(width) - 10) + "px");
                                angular.element('.branch-children').css("width", (parseInt(width) - 11) + "px");
                            }
                        }
                    }, 0);
                }
            };
        });
})();