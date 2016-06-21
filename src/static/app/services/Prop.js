(function() {
    "use strict";

    angular.module('derivationEditor')
        .service('Prop', function() {

            var and_prec = 9;
            var or_prec = 8;
            var imp_prec = 7;

            this.Atom = function(x) {
                return function() {
                    return {
                        "prop": "Atom",
                        "string": x,
                        "formulaID": 0
                    };
                };
            };

            this.True = function() {
                return function() {
                    return {
                        "prop": "True",
                        "string": "T",
                        "unicode": "\u22A4",
                        "cont": true,
                        "formulaID": 1
                    };
                };
            };

            this.False = function() {
                return function() {
                    return {
                        "prop": "False",
                        "string": "F",
                        "unicode": "\u22A5",
                        "cont": false,
                        "formulaID": 2
                    };
                };
            };

            this.And = function(p1, p2) {
                return function() {
                    return {
                        "prop": "And",
                        "string": "&",
                        "unicode": "\u2227",
                        "cont": [p1, p2],
                        "formulaID": 3
                    };
                };
            };

            this.Or = function(p1, p2) {
                return function() {
                    return {
                        "prop": "Or",
                        "string": "|",
                        "unicode": "\u2228",
                        "cont": [p1, p2],
                        "formulaID": 4
                    };
                };
            };

            this.Imp = function(p1, p2) {
                return function() {
                    return {
                        "prop": "Imp",
                        "string": "==>",
                        "unicode": "\u2283",
                        "cont": [p1, p2],
                        "formulaID": 5
                    };
                };
            };

            var showParen = function(bool, string) {
                return bool ? '(' + string + ')' : string;
            };

            this.fromString = function(string) {

                string = string.replace(/ /g, '');

                var ands = this.And()().string;
                var ors = this.Or()().string;
                var imps = this.Imp()().string;
                var ts = this.True()().string;
                var fs = this.False()().string;

                var andInd = string.indexOf(ands);
                var orInd = string.indexOf(ors);
                var impInd = string.indexOf(imps);
                var tInd = string.indexOf(ts);
                var fInd = string.indexOf(fs);

                var l1, l2, a1, a2;

                if (impInd === 0 || andInd === 0 || orInd === 0) {
                    throw "Rules are the first thing in the judgement";
                }


                if (impInd >= 0) {
                    l1 = string.substring(0, impInd);
                    l2 = string.substring(impInd + 3, string.length);
                    return this.Imp(this.fromString(l1), this.fromString(l2));
                }

                if (orInd >= 0) {
                    l1 = string.substring(0, orInd);
                    l2 = string.substring(orInd + 1, string.length);
                    return this.Or(this.fromString(l1), this.fromString(l2));
                }

                if (andInd >= 0) {
                    l1 = string.substring(0, andInd);
                    l2 = string.substring(andInd + 1, string.length);
                    return this.And(this.fromString(l1), this.fromString(l2));
                }

                // Atom, True and False case. Shouldn't be more than one character long
                if (string.length > 1) {
                    throw "Atoms shouldn't be more than one character";
                }

                // True case, should be one character string
                if (tInd >= 0) {
                    return this.True();
                }

                // False case, should be one character string
                if (fInd >= 0) {
                    return this.False();
                }

                // Atom case, there's nothing else, and the string isn't bad so 
                // it must be an Atom
                return this.Atom(string);

            };

            var toStringPrec = function(p, prop) {
                
                if (typeof prop === 'string') {
                    return prop;
                }

                var t = prop();
                var cont0, cont1;
                var paren;

                switch (t.prop) {
                    case 'Atom':
                        return t.string;
                    case 'True':
                        return t.unicode;
                    case 'False':
                        return t.unicode;
                    case 'And':
                        cont0 = t.cont[0];
                        cont1 = t.cont[1];
                        paren = p > and_prec;
                        return showParen(paren, toStringPrec(and_prec + 1, cont0) +
                            " " + t.unicode + " " + toStringPrec(and_prec + 1, cont1));
                    case 'Or':
                        cont0 = t.cont[0];
                        cont1 = t.cont[1];
                        paren = p > or_prec;
                        return showParen(paren, toStringPrec(or_prec + 2, cont0) +
                            " " + t.unicode + " " + toStringPrec(or_prec + 2, cont1));
                    case 'Imp':
                        cont0 = t.cont[0];
                        cont1 = t.cont[1];
                        paren = p > imp_prec;
                        return showParen(paren, toStringPrec(imp_prec + 3, cont0) +
                            " " + t.unicode + " " + toStringPrec(imp_prec + 3, cont1));
                    default:
                        console.error("Didn't find any matching propostions");
                }
            };

            this.toString = function(prop) {
                return toStringPrec(0, prop);
            };

        });
})();
