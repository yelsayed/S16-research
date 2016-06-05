(function() {
    "use strict";

    angular.module('derivationEditor')
        .controller('judgementController', function(Prop, $location) {
            var ctrl = this;
            ctrl.invalidJud = false;
            ctrl.judgement = "";

            ctrl.verifyInput = function() {
                try {
                    Prop.fromString(ctrl.judgement);
                    ctrl.invalidJud = false;
                } catch (err) {
                    ctrl.invalidJud = true;
                }
            };

            ctrl.sendJudge = function() {
                $location.path('/editor/' + ctrl.judgement);
            };

        });
})();
