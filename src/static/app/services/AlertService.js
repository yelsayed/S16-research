(function() {
    "use strict";

    angular.module('derivationEditor')
        .service('AlertService', function() {
            var srvc = this;

            srvc.customAlert = function(string) {
                angular.element(document.querySelector("body")).append('<div class="custom-alert">' + string + '</div>');
                setTimeout(function() {
                    angular.element(document.querySelector(".custom-alert")).remove();
                }, 3000);
            };
        });
})();
