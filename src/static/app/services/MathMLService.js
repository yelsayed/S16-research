(function(){
	"use strict";

	angular.module('derivationEditor')
		.service('MathMLService', function() {
			var srvc = this;

			srvc.reRenderMathJax = function(callback, element) {
                var typeset = element ? ["Typeset", MathJax.Hub, element] : ["Typeset", MathJax.Hub];
                MathJax.Hub.Queue(typeset, [callback]);
            };

		});
})();