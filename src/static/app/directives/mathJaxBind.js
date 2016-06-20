(function() {
    "use strict";
    /*jshint multistr: true */
    angular.module('derivationEditor')
        .directive("mathjaxBind", function($compile, $q, $timeout) {
            return {
                restrict: "E",
                transclude: true,
                templateUrl: '/static/includes/mathjax-derivation.html',
                link: function($scope, $element, $attrs) {

                    var createMathHTMLr = function(branch) {
                        var headHTML = '<mstyle displaystyle="true">\
                                            <mfrac>';

                        var generateContext = function() {
                            var retStr = "<mrow id='branch" + branch.branchid + "-context'>";
                            branch.theorem.context.forEach(function(e, i) {
                                if (i !== 0) {
                                    retStr += "<mo>, </mo>";
                                }
                                retStr += "<mi></mi>";
                            });
                            retStr = "</mrow>";
                        };

                        var assumption = '';

                        var tailHTML = '</mfrac>\
                                        </mstyle>';
                    };

                    var createMathHTML = function(source) {
                        var baseHTML = '<div id="derivation">\
    <mrow ng-include="\'tree_item_renderer.html\'">\
    </mrow>\
</div><script type="text/ng-template" id="tree_item_renderer.html"><math display="block">\
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
                    <mrow id="branch{{data.branchid}}-context" class="context clickable" ng-repeat="formula in ec.getTheorem(data.branchid).obj.theorem.context track by $index" ng-class="{\'chosen-theorem\': data.branchid == ec.currentTheoremId && $index == ec.currentPropId}" ng-click="ec.setCurrentId(data.branchid, $index)">\
                        <mo ng-if="$index !== 0">, </mo>\
                        <mi>{{ec.propToString(formula)}}</mi>\
                    </mrow>\
                    <mo>{{ec.entailsSymbol}}</mo>\
                    <mrow id="branch{{data.branchid}}-goal" class="goal clickable" ng-click="ec.setCurrentId(data.branchid, -1)" ng-class="{\'chosen-theorem\': data.branchid == ec.currentTheoremId && ec.currentPropId == -1}">\
                        <mi>{{ec.propToString(ec.getTheorem(data.branchid).obj.theorem.judgement)}}</mi>\
                    </mrow>\
                </mrow>\
            </mfrac>\
        </mstyle>\
    </mrow>\
</math></script>';
                        return baseHTML;
                    };

                    $scope.$watch('der', function(newValue, oldValue) {
                        console.log(newValue);
                        if (oldValue !== newValue) {
                            var baseHTML = createMathHTML(null);
                            console.log($element[0]);
                            $element.html("");
                            $element.append(baseHTML);
                            
                            // var compile = function() {
                            //     var d = $q.defer();
                            //     var content = $compile($element.contents())($scope);
                            //     d.resolve(content);
                            //     // console.log($compile($element.contents())($scope)[0]);
                                
                            //     return d.promise;
                            // };
                            
                            var result = $compile($element.contents())($scope);

                            $timeout(function(){
                                console.log(result.html());
                                var $script = angular.element('<script type="math/mml">')
                                    .html(newValue == undefined ? "" : "<math>" + result.html() + "</math>");
                                $element.html("");
                                $element.append($script);
                                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                            }, 0);

                            // compile().then(function(result) {
                                
                                // $element.find('script').remove();
                                // var $script = angular.element('<script type="math/mml">')
                                //     .html(newValue == undefined ? "" : $element.html());
                                // $element.html("");
                                // $element.append($script);
                            // });

                            setTimeout(function() {
                                console.log('Rerendering');
                                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                            }, 3000);
                        }
                    }, true);
                }
            };
        });
})();
