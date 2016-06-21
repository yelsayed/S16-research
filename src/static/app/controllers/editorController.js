(function() {
    "use strict";

    angular.module('derivationEditor')
        .controller('editorController', function($scope, Prop, NatDed, $q, $routeParams, MathMLService) {
            var ctrl = this;

            $scope.currentTheoremID = 0;
            $scope.currentPropId = -1;
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

            $scope.idCallback =
                function() {
                    $('.context').click(function() {
                        var $this = $(this);
                        var currentID = this.id;

                        var match = currentID.match(/\d+/g);

                        $scope.currentTheoremID = parseInt(match[0], 10);
                        $scope.currentPropId = parseInt(match[1], 10);

                        $('.chosen-theorem').removeClass('chosen-theorem');
                        $this.addClass('chosen-theorem');
                    });
                    $('.goal').click(function() {
                        var $this = $(this);
                        var currentID = this.id;

                        var match = currentID.match(/\d+/g);

                        $scope.currentTheoremID = parseInt(match[0], 10);
                        $scope.currentPropId = -1;

                        $('.chosen-theorem').removeClass('chosen-theorem');
                        $this.addClass('chosen-theorem');
                    });
                    $("#branch" + $scope.currentTheoremID + "-goal").addClass('chosen-theorem');
                };

            ctrl.loadMath = function() {
                MathMLService.reRenderMathJax($scope.idCallback);
            };

            MathMLService.reRenderMathJax($scope.idCallback);


            ctrl.verifyInput = function(j) {
                try {
                    Prop.fromString(j);
                    ctrl.invalidJud = false;
                } catch (err) {
                    ctrl.invalidJud = true;
                }
            };

            ctrl.getCurrentChildID = function() {
                return "#children" + parseInt($scope.currentTheoremID);
            };

            ctrl.addOne = function() {
                $scope.watchList.test++;
            };

            ctrl.applyRule = function(rule) {
                if (rule.logicVariables.length !== 0) {
                    ctrl.logicVariableInput = true;
                    ctrl.logicVariableList = rule.logicVariables;
                    ctrl.currentRule = rule;
                } else {
                    ctrl.der = currentCalc.applyRule(rule,
                                $scope.currentTheoremID, $scope.currentPropId, []);
                    $scope.currentTheoremID += 1;
                    $scope.currentPropId = -1;
                }
            };

            ctrl.applyLogicVariableRule = function() {
                var listOfVals = [];
                $('.logic-variable-input').each(function() {
                    var val = $(this).val();
                    listOfVals.push(val);
                });
                ctrl.der = ctrl.currentRule.fn($scope.currentTheoremID, $scope.currentPropId, listOfVals);
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
                console.log('lets see');
                $scope.currentTheoremID = tid;
                $scope.currentPropId = pid;
            };

            ctrl.getChildrenLen = function(id) {
                return currentCalc.getTheorem(id).obj.children.length;
            };

            ctrl.getTheorem = function(id) {
                return currentCalc.getTheorem(id);
            };

            ctrl.deleteBranch = function(parentid, id) {
                ctrl.der = currentCalc.deleteBranch(parentid, id);
                $scope.currentTheoremID = parentid;
                $scope.currentPropId = -1;
            };

        })
        .filter('to_trusted', ['$sce', function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }]);
})();
