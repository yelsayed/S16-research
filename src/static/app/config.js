(function() {
    "use strict";

    angular.module('derivationEditor', ['ngRoute'])
        .config(function($routeProvider) {
            // configure routes
            $routeProvider
                .when('/home', {
                    templateUrl: '/static/includes/judgement.html',
                    controller: 'judgementController',
                    controllerAs: 'jc',
                })
                .when('/editor/:propstring', {
                    templateUrl: '/static/includes/derivation.html',
                    controller: 'editorController',
                    controllerAs: 'ec',
                })
                .otherwise({ redirectTo: '/home' });
        })
        .run(function() {
            MathJax.Hub.Config({
                mml2jax: {
                    preview: "mathml",
                    useMathMLspacing: true
                }
            });
            setTimeout(function() {
                console.log("Started");
                var $this = document.createElement('mfrac');
                $this.innerHTML = '<mrow id="children' + parseInt(1) + '" class="conclusion">\
                                <mrow>\
                                    <mi>b</mi>\
                                </mrow>\
                            </mrow>\
                            <mrow class="assumption">\
                                <mo>' + "\u22A2" + '</mo>\
                                <mrow class="goal clickable">\
                                    <mi>' + "\u22A2" + '</mi>\
                                </mrow>\
                            </mrow>';
                $("#mathml-derivation").append($this);
                console.log($this);
                MathJax.Hub.Typeset("mathml-derivation");
            }, 1000);
        });
})();
