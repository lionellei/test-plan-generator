// ********* Main testplanPage Template *************
Template.testplanPage.helpers({
    "log": function() {
        console.log(this);    
    },
    
    "testgroups": function() {
        return Testgroups.find({chipName:this.chipName, revision:this.revision});
    },

    "testgroupButtonClass": function() {
        if (this.revision == 0) {
            return "btn-success";
        } else {
            return "btn-default";
        }
    },

    "padsListButtonClass": function() {
        if (this.revision == 0) {
            return "btn-primary";
        } else {
            return "btn-default";
        }
    },

    "regTableButtonClass": function() {
        if (this.revision == 0) {
            return "btn-primary";
        } else {
            return "btn-default";
        }
    },

    "isVersionZero": function() {
        return (this.revision == 0);
    },

    "revisions": function () {
        return Testplans.find({chipName: this.chipName}).fetch();
    },

    // **** These are within the #each loop, so the "this" context is different.
    "isThisVersionSelected": function () {
        // this in this context is the testplan iteration
        // console.log(Template.parentData(1));
        return (this.revision == Template.parentData(1).revision);
    },

    "displayRevision": function () {
        // console.log(this);
        if (this.revision == 0) {
            return "Working Copy (Rev 0)";
        } else {
            return "Rev "+this.revision;
        }
    }

    /* // Text styling seems to have no effect in <select> tag <options>
    "revTextClass": function () {
        console.log(this);
        if (this.revision == 0) {
            return "text-success";
        } else {
            if (this.revision == latestRevisionForTestplan(this)) {
                return "text-primary bold";
            } else {
                return "text-muted";
            }
        }
    } */
    // **** //////////////////////////////////////////////////////////////
});

var latestRevisionForTestplan = function (testplan) {
    return Testplans.findOne({chipName:testplan.chipName, revision:0}).latest_revision;
};

Template.testplanPage.events({
    "click .export-testplan-button": function (event, template) {
        var zip = new ZipZap(); // provided by the udondan:ZipZap package
        
        var testgroups = Testgroups.find({testplanId:this._id}).fetch();
        
        for (var i=0; i<testgroups.length; i++) {
            var data =exportTestgroup(testgroups[i]);
            // add to zip file
            zip.file(testgroups[i].name+".csv", data);
        }
        
        // Save to file on client
        zip.saveAs(this.chipName+"_testplan_rev"+this.revision+".zip");
    },

    "change #testplan-revision-select": function (event, template) {
        var destination = {
            chipName: this.chipName,
            revision: Number(event.currentTarget.selectedOptions[0].id)
        };
        Router.go('testplanPage', destination);
        //console.log(event.currentTarget.selectedOptions[0].id);
    }
});


// ********* Partials ******************
Template.newTestGroupForm.helpers({
    "log": function() {
        console.log(this);    
    },
    
   "hiddenOrShow": function () {
       // Use .prob('checked') instead of .checked for the jquery selector
       /*
       if ($('.select-custom-test').prop('checked')) {
           return "show";
       } else {
           return "hidden";
       }*/

       // Or this way:
       // return $('.select-custom-test').prop('checked')? "show" : "hidden";

       // TODO: Why the two ways above is not reactive? Resort to this hacky way below:
       return Session.get('showCustomTestNameInput')? "show" : "hidden";
   },

   "customTestChecked": function () {
       return Session.get('showCustomTestNameInput');
   }
});

Template.newTestGroupForm.events({
   // Use the change event instead of click because this checkbox could change programatically
   // i.e., checking any of the template checkbox will unchecked this checkbox.
   "change .select-custom-test": function() {
       // Toggle the 'showCustomTestNameInput' key:
       Session.set('showCustomTestNameInput', !Session.get('showCustomTestNameInput'));
       
       // Deselect other testplan templates when custom test is selected.
       if (Session.get('showCustomTestNameInput')) {
           $('#select-continuity-template').prop('checked', false);
           $('#select-leakage-template').prop('checked', false);
       }
   },
   
   "change .select-template": function() {
       // either one of the template checkbox is changed will trigger this event.
       // and if any of them is "checked" then deselect the custom test through Session['showCustomTestNameInput']
       if ($('#select-continuity-template').prop('checked') ||
           $('#select-leakage-template')) {
               Session.set('showCustomTestNameInput', false);
           }
   },
   
   "click #create-test-group-submit": function (event, template) {
       if ($('.select-custom-test').prop('checked')) {
           // Do something to create teh custom test group
           createCustomTests(this, template.find(".custom-test-name").value);
       } else {
           if (Pads.find({chipName: this.chipName}).fetch().length==0) {
               alert("Please import Pads List before creating tests from template.");
           } else {
               if ($('#select-continuity-template').prop('checked')) {
                   generateBasicTests(this, "Continuity");
               }
               
               if ($('#select-leakage-template').prop('checked')) {
                   generateBasicTests(this, "Leakage");
               }               
           }

       }
       
       $('.add-test-group-modal').modal('hide');
   }
});

Template.releaseForm.helpers({  
    "nextRevNumber": function () {
        return getNextRevNumberFor(this);
    }
});

Template.releaseForm.events({
    "click #release-testplan-submit": function (event, template) {
        var nextRevNumber = getNextRevNumberFor(this);

        // Copy the testplan object:
        // var testplan_nextrev = this; // Do not do this, there is some strange binding that changing testplan_nextrev also changes "this"
        var testplan_nextrev = {
            chipName:this.chipName,
            revision:nextRevNumber,
            release_note: template.find(".release-note-textarea").value
        };
        testplan_nextrev._id = Testplans.insert(testplan_nextrev);
        
        // Copy the test groups:
        var testgroups = Testgroups.find({testplanId:this._id, revision:this.revision}).fetch();

        for (var i=0; i<testgroups.length; i++) {
            // copy the test group object:
            //var testgroup = testgroups[i]; // Don't use this, strange binding occur that testgroup[i] will change once testgroup changes.
            var testgroup = {
                name: testgroups[i].name,
                chipName: testgroups[i].chipName,
                testplanId: testplan_nextrev._id,
                revision: nextRevNumber
            };

            var new_testgroup_id = Testgroups.insert(testgroup);

            // Copy all the test notes:
            var notes = Notes.find({testgroupId:testgroups[i]._id}).fetch();
            for (var j=0; j<notes.length; j++) {
                var note = {
                    chipName: notes[j].chipName,
                    testgroupName: notes[j].testgroupName,
                    testgroupId: new_testgroup_id,
                    revision: nextRevNumber,
                    note_text: notes[j].note_text
                };
                Notes.insert(note);
            }

            // Copy all the test setups:
            var setups = Testsetups.find({testgroup_id:testgroups[i]._id}).fetch();
            for (var k=0; k<setups.length; k++) {
                var setup = {
                    "testgroup_name": setups[k].testgroup_name,
                    "testgroup_id": new_testgroup_id,
                    "chipName": setups[k].chipName,
                    "revision": nextRevNumber,
                    "pad": setups[k].pad,
                    "source_type": setups[k].source_type,
                    "source_value": setups[k].source_value,
                    "source_unit": setups[k].source_unit
                };
                Testsetups.insert(setup);
            }

            // Copy all the test items:
            var testitems = Testitems.find({testgroupId:testgroups[i]._id}).fetch();
            for (var m=0; m<testitems.length; m++) {
                var test = {
                    "testgroupId": new_testgroup_id,
                    "testgroupName": testitems[m].testgroupName, // Assign because router use testplans/:chipName/:testName to local this.
                    "chipName": testitems[m].chipName, // Assign because router use testplans/:chipName/:testName to local this.
                    "revision": nextRevNumber,
                    "pad": testitems[m].pad,
                    "source_type": testitems[m].source_type,
                    "source_value": testitems[m].source_value,
                    "source_unit": testitems[m].source_unit,
                    "compliance_type": testitems[m].compliance_type,
                    "compliance_value": testitems[m].compliance_value,
                    "compliance_unit": testitems[m].compliance_unit,
                    "measure_type": testitems[m].measure_type,
                    "measure_min": testitems[m].measure_min,
                    "measure_typ": testitems[m].measure_typ,
                    "measure_max": testitems[m].measure_max,
                    "measure_unit": testitems[m].measure_unit
                };
                Testitems.insert(test);
            }
        }
        
        // Increment the latest_revision attribute of testplan rev 0.
        Testplans.update(this._id, {$inc:{latest_revision:1}});
        
        // Hide modal
        $('.release-form-modal').modal('hide');
        
        // Route to the newly created revision.
        Router.go('testplanPage', testplan_nextrev);
    }
});

/// *************** The heavey duty stuffs below ********************************
var getNextRevNumberFor = function(dataContext){
    return dataContext.latest_revision + 1;
}

var getTestGroupByName = function(testGroupName, chipName, testplanId, revision) {
    var testgroup = Testgroups.findOne({name:testGroupName, testplanId:testplanId});
    if (!testgroup) { // No testgroup in this testplan that has the given name
        // create it
        testgroup = {
          name: testGroupName,
          chipName: chipName,
          testplanId: testplanId,
          revision: revision
        };
        testgroup._id = Testgroups.insert(testgroup);
    }
    return testgroup;
}

var createCustomTests = function(testplanObj, testName) {
    console.log('Create custom test: '+testName);
    var customTest = getTestGroupByName(testName, testplanObj.chipName, testplanObj._id, testplanObj.revision);
}

var generateBasicTests = function(testplanObj, testName) { 
    // chipObj has the following data:
    // Object { _id: "MQ9qAHguc24ip3gw5", chipName: "qTIAX1B" }
    // TODO: Does it need to take a collection as argument?
    
    var pads = Pads.find({chipName:testplanObj.chipName}).fetch();
    if (pads.length > 0) { //check if there is Pads list first!!
        console.log("Generating "+testName+" test for "+testplanObj.chipName);
        
        // First create or retrieve the testgroup with the given name
        // this is of type "Testgroups"
        var basicTest = getTestGroupByName(testName, testplanObj.chipName, testplanObj._id, testplanObj.revision);
        
        // Generate the setup
        var supplyPads = Pads.find({chipName:testplanObj.chipName, type:"SUPPLY"}).fetch();
        // Although we are using a mongo collection to store the setups instead of embedding
        // it in testgroup, still need the array in memory for faster checking if a setup for
        // a certain pad has already existed, instead of quering the collection every iteration.
        var setups = Testsetups.find({testgroup_id:basicTest._id}).fetch();
        
        // Get the config settings to populate this test:
        var configs = testGroupTemplateConfigs[testName];
        
        // Attach the default test header configs:
        var headerConfigs = configs.headerDefaults;
        headerConfigs["testgroup_name"] = basicTest.name;
        headerConfigs["testgroup_id"] = basicTest._id;
        headerConfigs["chipName"] = testplanObj.chipName;
        headerConfigs["revision"] = testplanObj.revision;
        TestHeaderConfigs.insert(headerConfigs);
        
        for (var i = 0; i < supplyPads.length; i++) {
            pad = supplyPads[i];

            if (setups.length == 0 | setups.filter(function(item){return (item.pad==pad.name);}).length == 0) {
                // if that setup is not already in the array.
                // Need to check this because the same pads may be listed multiple times in the pads list.
                var setup = { // Make sure it matches headerConfigs.columns
                    "testgroup_name": basicTest.name,
                    "testgroup_id": basicTest._id,
                    "chipName": testplanObj.chipName,
                    "revision": testplanObj.revision,
                    "pad": pad.name,
                    "source_type": configs.setups.source_type,
                    "source_value": configs.setups.source_value,
                    "source_unit": configs.setups.source_unit
                };
                setups.push(setup); // Save in the memory for fast checking for duplicate pad setups.
                
                // Insert into collection:
                Testsetups.insert(setup);
            }
        }
        Testgroups.update(basicTest._id, {$set: {setups:setups}});
       
        // Loops through all the pads
        for (var i = 0; i < pads.length; i++) {
            // Only create the test_item for the pad if there is none already.
            // Pads list sometimes will have same pads appear more than once.
            var pad = pads[i];
            if (!!!Testitems.findOne({pad:pad.name, testgroupId:basicTest._id})) {
                var testSections = configs.testSections;
                for (var j=0; j<testSections.length; j++) {
                    var testSection = testSections[j];
                    
                    var test = {
                        "testgroupId": basicTest._id, // Assign the testgroupId to identify this test item belongs to this test group. 
                        "testgroupName": testName, // Assign because router use testplans/:chipName/:testName to local this.
                        "chipName": testplanObj.chipName, // Assign because router use testplans/:chipName/:testName to local this.
                        "revision": testplanObj.revision,
                        "pad": pad.name,
                        "source_type": testSection.source_type,
                        "source_value": testSection.source_value,
                        "source_unit": testSection.source_unit,
                        "compliance_type": testSection.compliance_type,
                        "compliance_value": testSection.compliance_value,
                        "compliance_unit": testSection.compliance_unit,
                        "measure_type": testSection.measure_type,
                        "measure_min": testSection.measure_min,
                        "measure_typ": testSection.measure_typ,
                        "measure_max": testSection.measure_max,
                        "measure_unit": testSection.measure_unit
                    };
                    Testitems.insert(test);
                }
            }
        }
    }
};