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
                    templateUrl: '/static/includes/editor.html',
                    controller: 'editorController',
                    controllerAs: 'ec',
                })
                .otherwise({ redirectTo: '/home' });
        })
        .run(function() {
            MathJax.Hub.Config({
                // skipStartupTypeset: true,
                messageStyle: "none",
                mml2jax: {
                    preview: "mathml",
                    useMathMLspacing: true
                }
            });
            MathJax.Hub.Configured();

        });
})();
