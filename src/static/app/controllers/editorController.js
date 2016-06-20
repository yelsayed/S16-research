(function() {
    "use strict";

    angular.module('derivationEditor')
        .controller('editorController', function($scope, Prop, NatDed, $q, $routeParams) {
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
            $scope.der = ctrl.der;
            $scope.data = ctrl.der;
            ctrl.rules = currentCalc.getRuleList();
            ctrl.entailsSymbol = currentCalc.entailsSymbol;

            ctrl.addMath = function() {
                // var newMath = '<math><mi>n</mi></math>';
                // var math = MathJax.Hub.getAllJax("children0")[0];
                // MathJax.Hub.Queue(["Text", math, newMath]);
            };

            ctrl.verifyInput = function(j) {
                try {
                    Prop.fromString(j);
                    ctrl.invalidJud = false;
                } catch (err) {
                    ctrl.invalidJud = true;
                }
            };

            ctrl.getCurrentChildID = function() {
                return "#children" + parseInt(ctrl.currentTheoremId);
            };

            ctrl.addOne = function() {
                $scope.watchList.test++;
            };

            ctrl.applyRule = function(rule) {
                $('.context').click(function() {
                    console.log(this.id);
                });
                $('.goal').click(function() {
                    console.log(this.id);
                });
                if (rule.hasLogicVariables) {
                    ctrl.logicVariableInput = true;
                    ctrl.logicVariableList = rule.logicVariables;
                    ctrl.currentRule = rule;
                } else {
                    var d = $q.defer();
                    ctrl.der = rule.fn(ctrl.currentTheoremId, ctrl.currentPropId);
                    d.resolve(ctrl.der);
                    d.promise.then(function(result) {
                        ctrl.addMath();
                        // MathJax.Hub.Queue(["Reprocess", MathJax.Hub]);
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

            $scope.propToString = ctrl.propToString;

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

        })
        .filter('to_trusted', ['$sce', function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }]);
})();
