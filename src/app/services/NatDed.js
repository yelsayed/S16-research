(function() {
    "use strict";

    angular.module('derivationEditor')
        .service('NatDed', function(Prop, AlertService) {
            var srvc = this;

            srvc.derivation = {};

            srvc.currentID = 0;

            srvc.getInitProp = function(prop) {
                srvc.derivation = {
                    "theorem": {
                        "judgement": prop,
                        "context": []
                    },
                    "branchid": srvc.currentID,
                    "applied": false,
                    "parentid": -1,
                    children: []
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


            srvc.ImpIntro = function(currid) {
                
                var obj = setUpRule(currid);

                if (obj.currentJudg().prop !== "Imp") {
                	AlertService.customAlert("Cannot apply Imp Intro rule, please choose something else");
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
                    "parentid": currid,
                    children: []
                };

                // Clone the list using slice
                nextLevel.theorem.context = obj.currentCont.slice(0);

                // Pushing the first continuation to the context
                nextLevel.theorem.context.push(obj.currentJudg().cont[0]);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel, currid);

                return srvc.derivation;
            };

            srvc.AndIntro = function(currid) {
                
                var obj = setUpRule(currid);

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
                    "parentid": currid,
                    children: []
                };

                var nextLevel2 = {
                    "theorem": {
                        "judgement": obj.currentJudg().cont[1],
                        "context": []
                    },
                    "branchid": newID(),
                    "applied": false,
                    "parentid": currid,
                    children: []
                };

                // Clone the list using slice
                nextLevel1.theorem.context = obj.currentCont.slice(0);
                nextLevel2.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel1, currid);
                pushBranch(srvc.derivation, nextLevel2, currid);

                return srvc.derivation;
            };

            srvc.OrIntro1 = function(currid) {
                
                var obj = setUpRule(currid);

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
                    "parentid": currid,
                    children: []
                };

                // Clone the list using slice
                nextLevel.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel, currid);

                return srvc.derivation;
            };

            srvc.OrIntro2 = function(currid) {
                
                var obj = setUpRule(currid);

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
                    "parentid": currid,
                    children: []
                };

                // Clone the list using slice
                nextLevel.theorem.context = obj.currentCont.slice(0);

                // Pushing the new branch to our derivation
                pushBranch(srvc.derivation, nextLevel, currid);

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

        });
})();
