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


            srvc.ImpIntro = function(currtid, currpid) {

                var obj = setUpRule(currtid);

                if (obj.currentJudg().prop !== "Imp") {
                    AlertService.customAlert("Cannot apply Imp Intro rule, please choose something else");
                    throw "Cannot apply rule, user has been alerted";
                }

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = false;
                }

                var nextLevel = {
                    "theorem": {
                        "judgement": obj.currentJudg().cont[1],
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                // Clone the list using slice
                nextLevel.theorem.context = obj.currentCont.slice(0);

                // Pushing the first continuation to the context
                nextLevel.theorem.context.push(obj.currentJudg().cont[0]);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel, currtid);

                return srvc.derivation;
            };

            srvc.AndIntro = function(currtid, currpid) {

                var obj = setUpRule(currtid);

                if (obj.currentJudg().prop !== "And") {
                    AlertService.customAlert("Cannot apply And Intro rule, please choose something else");
                    throw "Cannot apply rule, user has been alerted";
                }

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = true;
                }

                var nextLevel1 = {
                    "theorem": {
                        "judgement": obj.currentJudg().cont[0],
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                var nextLevel2 = {
                    "theorem": {
                        "judgement": obj.currentJudg().cont[1],
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                // Clone the list using slice
                nextLevel1.theorem.context = obj.currentCont.slice(0);
                nextLevel2.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel1, currtid);
                pushBranch(srvc.derivation, nextLevel2, currtid);

                return srvc.derivation;
            };

            srvc.OrIntro1 = function(currtid, currpid) {

                var obj = setUpRule(currtid);

                if (obj.currentJudg().prop !== "Or") {
                    AlertService.customAlert("Cannot apply Or Intro rule 1, please choose something else");
                    throw "Cannot apply rule, user has been alerted";
                }

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = true;
                }

                var nextLevel = {
                    "theorem": {
                        "judgement": obj.currentJudg().cont[0],
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                // Clone the list using slice
                nextLevel.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel, currtid);

                return srvc.derivation;
            };

            srvc.OrIntro2 = function(currtid, currpid) {

                var obj = setUpRule(currtid);

                if (obj.currentJudg().prop !== "Or") {
                    AlertService.customAlert("Cannot apply Or Intro rule 2, please choose something else");
                    throw "Cannot apply rule, user has been alerted";
                }

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = true;
                }

                var nextLevel = {
                    "theorem": {
                        "judgement": obj.currentJudg().cont[1],
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                // Clone the list using slice
                nextLevel.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel, currtid);

                return srvc.derivation;
            };

            var logicVarsFromString = function(logicVars) {
                var logicPropList = [];

                logicVars.forEach(function(d) {
                    var p = Prop.fromString(d);
                    logicPropList.push(p);
                });

                return logicPropList;
            };

            srvc.AndElim1 = function(currtid, currpid, logicVars) {
                var logicList = logicVarsFromString(logicVars);

                var obj = setUpRule(currtid);

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = true;
                }

                // Get the 'B' logic variable
                var b = logicList[0];

                var nextLevel = {
                    "theorem": {
                        "judgement": Prop.And(obj.currentJudg, b),
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                // Clone the list using slice
                nextLevel.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel, currtid);

                return srvc.derivation;
            };

            srvc.AndElim2 = function(currtid, currpid, logicVars) {
                var logicList = logicVarsFromString(logicVars);

                var obj = setUpRule(currtid);

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = true;
                }

                // Get the 'a' logic variable
                var a = logicList[0];

                var nextLevel = {
                    "theorem": {
                        "judgement": Prop.And(a, obj.currentJudg),
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                // Clone the list using slice
                nextLevel.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel, currtid);

                return srvc.derivation;
            };

            srvc.ImpElim = function(currtid, currpid, logicVars) {
                var logicList = logicVarsFromString(logicVars);

                var obj = setUpRule(currtid);

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = true;
                }

                // Get the 'a' logic variable
                var a = logicList[0];

                var nextLevel1 = {
                    "theorem": {
                        "judgement": Prop.Imp(a, obj.currentJudg),
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                var nextLevel2 = {
                    "theorem": {
                        "judgement": a,
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                // Clone the list using slice
                nextLevel1.theorem.context = obj.currentCont.slice(0);
                nextLevel2.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel1, currtid);
                pushBranch(srvc.derivation, nextLevel2, currtid);

                return srvc.derivation;
            };

            srvc.OrElim = function(currtid, currpid, logicVars) {
                var logicList = logicVarsFromString(logicVars);

                var obj = setUpRule(currtid);

                if (obj.currentTheorem.applied) {
                    AlertService.customAlert("Theorem already has rule applied to it");
                    throw "Theorem already has rule applied to it, user has been alerted";
                } else {
                    obj.currentTheorem.applied = true;
                }

                // Get the 'a' logic variable
                var a = logicList[0];
                var b = logicList[1];

                var nextLevel1 = {
                    "theorem": {
                        "judgement": Prop.Or(a, b),
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                var nextLevel2 = {
                    "theorem": {
                        "judgement": obj.currentJudg,
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                var nextLevel3 = {
                    "theorem": {
                        "judgement": obj.currentJudg,
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currtid,
                    "children": []
                };

                // Clone the list using slice
                nextLevel1.theorem.context = obj.currentCont.slice(0);
                nextLevel2.theorem.context = obj.currentCont.slice(0);
                nextLevel3.theorem.context = obj.currentCont.slice(0);

                nextLevel2.theorem.context.push(a);
                nextLevel3.theorem.context.push(b);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel1, currtid);
                pushBranch(srvc.derivation, nextLevel2, currtid);
                pushBranch(srvc.derivation, nextLevel3, currtid);

                return srvc.derivation;
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
                srvc.rules = [{
                    "name": "And Introduction",
                    "formulaID": 3,
                    "hasLogicVariables": false,
                    "logicVariables": [],
                    "imgSrc": "/static/images/and-intro.png",
                    "fn": srvc.AndIntro,
                }, {
                    "name": "And Elimination 1",
                    "formulaID": 3,
                    "hasLogicVariables": true,
                    "logicVariables": ['B'],
                    "imgSrc": "/static/images/and-elem1.png",
                    "fn": srvc.AndElim1,
                }, {
                    "name": "And Elimination 2",
                    "formulaID": 3,
                    "hasLogicVariables": true,
                    "logicVariables": ['A'],
                    "imgSrc": "/static/images/and-elem2.png",
                    "fn": srvc.AndElim2,
                }, {
                    "name": "Imp Introduction",
                    "formulaID": 5,
                    "hasLogicVariables": false,
                    "logicVariables": [],
                    "imgSrc": "/static/images/imp-intro.png",
                    "fn": srvc.ImpIntro,
                }, {
                    "name": "Imp Elimination",
                    "formulaID": 5,
                    "hasLogicVariables": true,
                    "logicVariables": ['A'],
                    "imgSrc": "/static/images/imp-elem.png",
                    "fn": srvc.ImpElim,
                }, {
                    "name": "Or Introduction 1",
                    "formulaID": 4,
                    "hasLogicVariables": false,
                    "logicVariables": [],
                    "imgSrc": "/static/images/or-intro1.png",
                    "fn": srvc.OrIntro1,
                }, {
                    "name": "Or Introduction 2",
                    "formulaID": 4,
                    "hasLogicVariables": false,
                    "logicVariables": [],
                    "imgSrc": "/static/images/or-intro2.png",
                    "fn": srvc.OrIntro2,
                }, {
                    "name": "Or Elimination",
                    "formulaID": 4,
                    "hasLogicVariables": true,
                    "logicVariables": ['A', 'B'],
                    "imgSrc": "/static/images/or-elem.png",
                    "fn": srvc.OrElim,
                }, ];
                return srvc.rules;
            };

        });
})();
