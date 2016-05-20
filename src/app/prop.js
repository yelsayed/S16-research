(function() {
    var Atom = function(x) {
        return function() {
            this.prop = "Atom";
            this.cont = x;
            return this;
        };
    };

    var True = function() {
        return function() {
            this.prop = "True";
            this.cont = true;
            return this;
        };
    };

    var False = function() {
        return function() {
            this.prop = "False";
            this.cont = false;
            return this;
        };
    };

    var And = function(p1, p2) {
        return function() {
            this.prop = "And";
            this.cont = [p1, p2];
            return this;
        };
    };

    var Or = function(p1, p2) {
        return function() {
            this.prop = "Or";
            this.cont = [p1, p2];
            return this;
        };
    };

    var Imp = function(p1, p2) {
        return function() {
            this.prop = "Imp";
            this.cont = [p1, p2];
            return this;
        };
    };

    function toStringPrec(theorem) {
        var t = theorem();
        var cont0, cont1;

        switch (t.prop) {
            case 'Atom':
                return t.cont;
            case 'True':
                return 'T';
            case 'False':
                return 'F';
            case 'And':
                cont0 = t.cont[0];
                cont1 = t.cont[1];
                return toStringPrec(cont0) + " & " + toStringPrec(cont1);
            case 'Or':
                cont0 = t.cont[0];
                cont1 = t.cont[1];
                return toStringPrec(cont0) + " | " + toStringPrec(cont1);
            case 'Imp':
                cont0 = t.cont[0];
                cont1 = t.cont[1];
                return toStringPrec(cont0) + " ==> " + toStringPrec(cont1);
            default:
                throw "Didn't find any matching propostions";
        }
    }
})();
