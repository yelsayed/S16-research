(function() {
    "use strict";

    angular.module('derivationEditor')
        .service('NatDed', function(Prop, AlertService) {
            var srvc = this;

            srvc.derivation = {};

            srvc.currentID = 0;

            srvc.rules = [];

            srvc.entailsSymbol = "\u22A2";

            srvc.getInitProp = function(prop) {
                srvc.derivation = {
                    "theorem": {
                        "judgement": prop,
                        "context": [Prop.Atom('a')]
                    },
                    "branchid": srvc.currentID,
                    "applied": false,
                    "parentid": -1,
                    "children": []
                };

                return srvc.derivation;
            };

            var newID = function() {
                srvc.currentID++;
                return srvc.currentID;
            };

            var pushBranch = function(source, branch, id) {
                if (source.branchid === id) {
                    source.children.push(branch);
                } else if (source.children) {
                    source.children.forEach(function(d) {
                        var ret = pushBranch(d, branch, id);
                    });
                } else {}
            };

            var setUpRule = function(currid) {
                var currentTheorem;

                var temp = srvc.getTheorem(currid);

                if (!temp.some) {
                    console.error("Couldn't find the branch that was requested");
                    return;
                } else {
                    currentTheorem = srvc.getTheorem(currid).obj;
                }

                var currentJudg = currentTheorem.theorem.judgement;
                var currentCont = currentTheorem.theorem.context;

                return {
                    'currentTheorem': currentTheorem,
                    'currentJudg': currentJudg,
                    'currentCont': currentCont,
                };
            };

            var getTheoremr = function(branch, id) {
                if (branch.branchid === id) {
                    return { "some": true, "obj": branch };
                } else if (branch.children) {
                    var countFail = 0;
                    var objFound = {};
                    branch.children.forEach(function(d) {
                        var ret = getTheoremr(d, id);
                        if (ret.some === true) {
                            objFound = ret.obj;
                        } else {
                            countFail++;
                        }
                    });

                    if (countFail == branch.children.length) {
                        return { "some": false, "obj": null };
                    } else {
                        return { "some": true, "obj": objFound };
                    }
                } else {
                    return { "some": false, "obj": null };
                }
            };


            srvc.getTheorem = function(id) {
                return getTheoremr(srvc.derivation, id);
            };

            var deleteBranch = function(source, parentid, id) {
                if (source.branchid === parentid) {
                    source.applied = false;
                    source.children.forEach(function(d, i) {
                        source.children.splice(i, 1);
                    });
                } else if (source.children) {
                    source.children.forEach(function(d) {
                        deleteBranch(d, parentid, id);
                    });
                } else {}
            };

            // Should delete the child from the parent and set the parent
            // to have his applied to be false
            srvc.deleteBranch = function(parentid, id) {
                srvc.currentID = parentid;
                deleteBranch(srvc.derivation, parentid, id);
                return srvc.derivation;
            };

            srvc.applyRule = function(rule, currtid, currpid, logicVars) {
                var logicList = logicVarsFromString(logicVars);

                // Object retrieval
                var obj = setUpRule(currtid);
                var nextLevel = {};

                var newAssumptionList, newConcList;

                // Error Checking and input verification
                if (rule.verify && obj.currentJudg().prop !== rule.prop) {
                    AlertService.customAlert("Cannot apply Or Intro rule 2, please choose something else");
                    throw "Cannot apply rule, user has been alerted";
                }

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = true;
                }

                // This is to replace all occurances of strings with
                // appropriate continuations
                if (typeof rule.assumption.goal === "function") {
                    var varGoalList = [];
                    newAssumptionList = rule.assumption.goal().cont.map(function(d, index) {
                        var o = {};
                        o.string = d;
                        o.cont = obj.currentJudg().cont[index];
                        varGoalList.push(o);
                        console.log(varGoalList);
                        return obj.currentJudg().cont[index];
                    });

                    newConcList = rule.conclusion.map(function(d) {

                        var newD = {
                            context: [],
                            goal: ""
                        };

                        console.log(d);
                        
                        // Replace variables in context
                        d.context.map(function(c) {
                            var newC = {};
                            varGoalList.forEach(function(d2) {
                                if (c === d2.string) {
                                    newD.context.push(d2.cont);
                                }
                            });
                        });

                        // Replace variables in goal
                        if (typeof d.goal === "function") {
                            // I should create a function that replaces
                            // all occurances of the varlist with the continuation
                        } else if (typeof d.goal === "string") {
                            varGoalList.forEach(function(d2) {
                                if (d.goal === d2.string) {
                                    newD.goal = d2.cont;
                                }
                            });
                        }
                        return newD;
                    });
                } else if (typeof rule.assumption.goal == "string") {
                    // This is simpler than the previous one but very similar
                }

                // Next step is to push them all into the
                // derivation object
                newConcList.forEach(function(d) {
                    var nextLevel = {
                        "theorem": {
                            "judgement": d.goal,
                            "context": []
                        },
                        "branchid": newID(),
                        "applied": false,
                        "parentid": currtid,
                        "children": []
                    };

                    nextLevel.theorem.context = obj.currentCont.slice(0);

                    d.context.forEach(function(c) {
                        nextLevel.theorem.context.push(c);
                    });

                    pushBranch(srvc.derivation, nextLevel, currtid);
                });

            };

            var logicVarsFromString = function(logicVars) {
                var logicPropList = [];

                logicVars.forEach(function(d) {
                    var p = Prop.fromString(d);
                    logicPropList.push(p);
                });

                return logicPropList;
            };

            var AndIntro = function() {
                return {
                    "name": "And Introduction",
                    "latexName": "\u2227I",
                    "prop": "And",
                    "logicVariables": [],
                    "verify": true,
                    "assumption": {
                        "context": [],
                        "goal": Prop.And("A", "B")
                    },
                    "conclusion": [{
                        "context": [],
                        "goal": "A"
                    }, {
                        "context": [],
                        "goal": "B"
                    }],
                    "imgSrc": "/static/images/and-intro.png"
                };
            };

            var ImpIntro = function() {
                return {
                    "name": "Imp Introduction",
                    "latexName": "\u2283I",
                    "prop": "Imp",
                    "logicVariables": [],
                    "verify": true,
                    "assumption": {
                        "context": [],
                        "goal": Prop.Imp("A", "B")
                    },
                    "conclusion": [{
                        "context": ["A"],
                        "goal": "B"
                    }],
                    "imgSrc": "/static/images/imp-intro.png",
                };
            };

            var OrIntro1 = function() {
                return {
                    "name": "Or Introduction 1",
                    "latexName": "\u2228I1",
                    "prop": "Or",
                    "logicVariables": [],
                    "verify": true,
                    "assumption": {
                        "context": [],
                        "goal": Prop.Or("A", "B")
                    },
                    "conclusion": [{
                        "context": [],
                        "goal": "A"
                    }],
                    "imgSrc": "/static/images/or-intro1.png",
                };
            };

            var OrIntro2 = function() {
                return {
                    "name": "Or Introduction 2",
                    "latexName": "\u2228I2",
                    "prop": "Or",
                    "logicVariables": [],
                    "verify": true,
                    "assumption": {
                        "context": [],
                        "goal": Prop.Or("A", "B")
                    },
                    "conclusion": [{
                        "context": [],
                        "goal": "B"
                    }],
                    "imgSrc": "/static/images/or-intro2.png",
                };
            };

            var AndElim1 = function() {
                return {
                    "name": "And Elimination 1",
                    "latexName": "\u2227E1",
                    "prop": "And",
                    "logicVariables": ['B'],
                    "verify": false,
                    "assumption": {
                        "context": [],
                        "goal": "A"
                    },
                    "conclusion": [{
                        "context": [],
                        "goal": Prop.And("A", "B")
                    }],
                    "imgSrc": "/static/images/and-elem1.png",
                };
            };

            var AndElim2 = function() {
                return {
                    "name": "And Elimination 2",
                    "latexName": "\u2227E2",
                    "prop": "And",
                    "logicVariables": ['A'],
                    "verify": false,
                    "assumption": {
                        "context": [],
                        "goal": "B"
                    },
                    "conclusion": [{
                        "context": [],
                        "goal": Prop.And("A", "B")
                    }],
                    "imgSrc": "/static/images/and-elem2.png",
                };
            };

            var ImpElim = function() {
                return {
                    "name": "Imp Elimination",
                    "latexName": "\u2283E",
                    "prop": "Imp",
                    "logicVariables": ['A'],
                    "verify": false,
                    "assumption": {
                        "context": [],
                        "goal": "B"
                    },
                    "conclusion": [{
                        "context": [],
                        "goal": Prop.Imp("A", "B")
                    },{
                        "context": [],
                        "goal": "A"
                    }],
                    "imgSrc": "/static/images/imp-elem.png",
                };
            };

            var OrElim = function() {
                return {
                    "name": "Or Elimination",
                    "latexName": "\u2228E",
                    "prop": "Or",
                    "logicVariables": ['A', 'B'],
                    "verify": false,
                    "assumption": {
                        "context": [],
                        "goal": "C"
                    },
                    "conclusion": [{
                        "context": [],
                        "goal": Prop.Or("A", "B")
                    }, {
                        "context": ['A'],
                        "goal": "C"
                    }, {
                        "context": ['B'],
                        "goal": "C"
                    }],
                    "imgSrc": "/static/images/or-elem.png",
                };
            };

            srvc.toString = function(currid) {
                var currentTheorem;

                var retString = ".";

                var temp = srvc.getTheorem(currid);

                if (!temp.some) {
                    console.error("Couldn't find the branch that was requested");
                    return;
                } else {
                    currentTheorem = srvc.getTheorem(currid).obj;
                }

                currentTheorem.theorem.context.forEach(function(d) {
                    retString = retString + ", " + Prop.toString(d);
                });

                retString = retString + " -> " +
                    Prop.toString(currentTheorem.theorem.judgement);

                return retString;
            };

            // The following is an example of what this calculus should
            // return to the front end controller, basically a list of all
            // the rules that this guy has. These rules should correspond
            // to some formula in Prop.js service.
            srvc.getRuleList = function() {
                srvc.rules = 
                [
                    AndIntro(),
                    ImpIntro(),
                    OrIntro1(),
                    OrIntro2(),
                    AndElim1(),
                    AndElim2(),
                    ImpElim(),
                    OrElim()
                ];
                return srvc.rules;
            };

        });
})();
