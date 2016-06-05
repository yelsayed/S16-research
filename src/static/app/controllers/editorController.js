(function() {
    "use strict";

    angular.module('derivationEditor')
        .controller('editorController', function(Prop, NatDed, $q, $routeParams) {
            var ctrl = this;

            ctrl.currentTheoremId = 0;
            ctrl.currentPropId = -1;
            ctrl.logicVariableInput = false;
            ctrl.logicVariableList = [];
            ctrl.invalidJud = false;
            ctrl.currentRule = null;

            var propDefined = false;
            var prop = Prop.fromString($routeParams.propstring);

            // All we have to change now is this variable and we should
            // get a new calculus
            var currentCalc = NatDed;

            ctrl.der = currentCalc.getInitProp(prop);
            ctrl.rules = currentCalc.getRuleList();
            ctrl.entailsSymbol = currentCalc.entailsSymbol;

            ctrl.pullDown = function() {
                $('.pulled-down').each(function() {
                    var $this = $(this);
                    var $thisParent = $this.parent();
                    $this.css('margin-top', $thisParent.height() - $this.height());
                });
            };

            ctrl.verifyInput = function(j) {
                try {
                    console.log(j);
                    Prop.fromString(j);
                    ctrl.invalidJud = false;
                } catch (err) {
                    ctrl.invalidJud = true;
                }
            };

            ctrl.applyRule = function(rule) {
                if (rule.hasLogicVariables) {
                    ctrl.logicVariableInput = true;
                    ctrl.logicVariableList = rule.logicVariables;
                    ctrl.currentRule = rule;
                } else {
                    var d = $q.defer();
                    ctrl.der = rule.fn(ctrl.currentTheoremId, ctrl.currentPropId);
                    d.resolve(ctrl.der);
                    d.promise.then(function(result) {
                        ctrl.pullDown();
                    });
                    ctrl.currentTheoremId += 1;
                    ctrl.currentPropId = -1;
                }
            };

            ctrl.applyLogicVariableRule = function() {
                var listOfVals = [];
                $('.logic-variable-input').each(function() {
                    var val = $(this).val();
                    listOfVals.push(val);
                });

                var d = $q.defer();
                ctrl.der = ctrl.currentRule.fn(ctrl.currentTheoremId, ctrl.currentPropId, listOfVals);
                d.resolve(ctrl.der);
                d.promise.then(function(result) {
                    ctrl.pullDown();
                });
                ctrl.logicVariableInput = false;

            };

            ctrl.toString = function(i) {
                return currentCalc.toString(i);
            };

            ctrl.propToString = function(prop) {
                return Prop.toString(prop);
            };

            ctrl.setCurrentId = function(tid, pid) {
                ctrl.currentTheoremId = tid;
                ctrl.currentPropId = pid;
            };

            ctrl.getChildrenLen = function(id) {
                return currentCalc.getTheorem(id).obj.children.length;
            };

            ctrl.getTheorem = function(id) {
                return currentCalc.getTheorem(id);
            };

            ctrl.deleteBranch = function(parentid, id) {
                ctrl.der = currentCalc.deleteBranch(parentid, id);
                ctrl.currentTheoremId = parentid;
                ctrl.currentPropId = -1;
            };

        });
})();
