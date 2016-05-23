(function() {
    "use strict";

    angular.module('derivationEditor')
        .controller('editorController', function(Prop, NatDed, $q) {
            var ctrl = this;

            ctrl.currentTheoremId = 0;

            var prop1 =
                Prop.Imp(
                    Prop.And(Prop.Or(Prop.Atom('B'), Prop.Atom('D')), Prop.Atom('C')),
                    Prop.And(Prop.Or(Prop.Atom('B'), Prop.Atom('D')), Prop.Atom('C'))
                );

            ctrl.der = NatDed.derivation;

            ctrl.der = NatDed.getInitProp(prop1);

            ctrl.ImpIntro = function() {
                ctrl.der = NatDed.ImpIntro(ctrl.currentTheoremId);
            };

            ctrl.AndIntro = function() {
                ctrl.der = NatDed.AndIntro(ctrl.currentTheoremId);
            };

            ctrl.OrIntro1 = function() {
                var d = $q.defer();
                ctrl.der = NatDed.OrIntro1(ctrl.currentTheoremId);
                d.resolve(ctrl.der);
                d.promise.then(function(result) {
                    $('.pulled-down').each(function() {
                        var $this = $(this);
                        console.log($this.parent().height());
                        console.log($this.height());
                        $this.css('margin-top', $this.parent().height() - $this.height());
                    });
                });
            };

            ctrl.OrIntro2 = function() {
                ctrl.der = NatDed.OrIntro2(ctrl.currentTheoremId);
            };

            ctrl.toString = function(i) {
                return NatDed.toString(i);
            };

            ctrl.setCurrentId = function(id) {
                ctrl.currentTheoremId = id;
            };

            ctrl.getChildrenLen = function(id) {
                return NatDed.getTheorem(id).obj.children.length;
            };

        });
})();
