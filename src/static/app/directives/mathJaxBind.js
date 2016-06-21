(function() {
    "use strict";
    /*jshint multistr: true */
    angular.module('derivationEditor')
        .directive("mathjaxBind", function($compile, $q, $timeout, MathMLService) {
            return {
                restrict: "AE",
                transclude: true,
                templateUrl: '/static/includes/mathjax-derivation.html',
                link: function($scope, $element, $attrs) {

                    var createMathHTML = function() {
                        var baseHTML = '<div id="derivation">\
                                            <mrow ng-include="\'tree_item_renderer.html\'">\
                                            </mrow>\
                                        </div><script type="text/ng-template" id="tree_item_renderer.html">\
                                            <mrow class="beginning">\
                                                <mstyle displaystyle="true">\
                                                    <mfrac>\
                                                        <mrow>\
                                                            <mrow ng-repeat="data in data.children track by $index">\
                                                                <mrow ng-include="\'tree_item_renderer.html\'"></mrow>\
                                                                <mspace width="1em" ng-if="$index !== (data.length-1)"></mspace>\
                                                            </mrow>\
                                                        </mrow>\
                                                        <mrow id="branch{{data.branchid}}" class="assumption">\
                                                            <mrow class="context clickable" ng-repeat="formula in ec.getTheorem(data.branchid).obj.theorem.context track by $index" id="branch{{data.branchid}}-context-{{$index}}">\
                                                                <mo ng-if="$index !== 0">, </mo>\
                                                                <mi>{{ec.propToString(formula)}}</mi>\
                                                            </mrow>\
                                                            <mo>{{ec.entailsSymbol}}</mo>\
                                                            <mrow id="branch{{data.branchid}}-goal" class="goal clickable">\
                                                                <mi>{{ec.propToString(ec.getTheorem(data.branchid).obj.theorem.judgement)}}</mi>\
                                                            </mrow>\
                                                        </mrow>\
                                                    </mfrac>\
                                                </mstyle>\
                                            </mrow>\
                                        </script>';
                        return baseHTML;
                    };

                    $scope.$watch('der', function(newValue, oldValue) {
                        if (oldValue !== newValue) {
                            var baseHTML = createMathHTML();

                            var newElem = angular.element('<div>');
                            newElem.html(baseHTML);

                            var result = $compile(newElem.contents())($scope);

                            $timeout(function() {
                                $element.html("<math display='block'>" + result.html() + "</math>");
                                MathMLService.reRenderMathJax($scope.idCallback, $element[0]);
                            }, 0);
                            $timeout(function() {

                            }, 0);
                        }
                    }, true);
                }
            };
        });
})();
