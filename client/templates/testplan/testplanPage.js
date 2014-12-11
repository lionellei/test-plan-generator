// ********* Main testplanPage Template *************
Template.testplanPage.helpers({
    "log": function() {
        console.log(this);  
        console.log(Router._currentRoute.getName());
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
    
    "statusButtonClass": function(collection) {
        if (this.revision == 0) {
            var stuffs;
            if (collection == "Pads") {
                stuffs = Pads.find({chipName:this.chipName}).fetch();
            } 
            else if (collection == "Registers") {
                stuffs = Registers.find({chipName:this.chipName}).fetch();
            }
            if (stuffs && stuffs.length > 0) {
                return "btn-success";
            } else {
                return "btn-primary";
            }
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
    },
    
    "statusIcon": function (collection) {
        var stuffs;
        if (collection == "Pads") {
            stuffs = Pads.find({chipName:this.chipName}).fetch();
        } 
        else if (collection == "Registers") {
            stuffs = Registers.find({chipName:this.chipName}).fetch();
        }
        
        if (stuffs && stuffs.length > 0) {
            return "glyphicon-check";
        } else {
            return "glyphicon-unchecked";
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


Template.testplanPage.events({
    "click .export-testplan-button": function (event, template) {
        var zip = new ZipZap(); // provided by the udondan:ZipZap package
        
        // Export Pin List:
        var pin_list = exportPinList(event, template, this);
        zip.file("Pin List.csv", pin_list);
        
        // Export Reg Table:
        var reg_table = exportRegTable(event, template, this);
        zip.file("Reg Table.csv", reg_table);
        
        // Export Revision Logs:
        var rev_log = exportRevLog(event, template, this);
        zip.file("Rev Log.csv", rev_log);
        
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
        console.log(this);
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

        var baseNumber = 4000; //1000 reserved for continuity, 2000 reserved for leakage, 3000 reserved for active leakage 
                                // Need to increment this baseNumber based on testgroup.
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
            
            // Copy the test header configs and registers
            var testHeaderConfigs = TestHeaderConfigs.findOne({testgroup_id:testgroups[i]._id});

            // change the "order" column "show" to false so that the order column is not shown in released test groups.
            var modifiedColumns = testHeaderConfigs.columns;
            var orderColumn = testHeaderConfigs.columns.filter(function(element) {
                return element.name == "order";
            })[0];
            var columnIndex = testHeaderConfigs.columns.indexOf(orderColumn);
            if (columnIndex !== -1) {
                // toggle the "show" value.
                orderColumn.show = false;
                modifiedColumns[columnIndex] = orderColumn;
            }

            var newTestHeaderConfigs = {
                columns: modifiedColumns,
                chipName:testHeaderConfigs.chipName,
                testgroup_id: new_testgroup_id,
                testgroup_name: testgroup.name,
                revision: nextRevNumber
            };
            if (testHeaderConfigs.registers) {
                newTestHeaderConfigs["registers"] = testHeaderConfigs.registers;
            }
            TestHeaderConfigs.insert(newTestHeaderConfigs);

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
                    "register": setups[k].register,
                    "source_type": setups[k].source_type,
                    "source_value": setups[k].source_value,
                    "source_unit": setups[k].source_unit
                };
                Testsetups.insert(setup);
            }

            // Copy all the test items:
            var testitems = Testitems.find({testgroupId:testgroups[i]._id}, {sort: {order:1}}).fetch();
            var testNumber;
            if (testgroup.name == "Continuity") {
                testNumber = 1000+1;
            }
            else if (testgroup.name == "Leakage") {
                testNumber = 2000+1;
            }
            else if (testgroup.name == "Active Leakage") {
                testNumber = 3000+1;
            }
            else {
                testNumber = baseNumber+1;
            }
            for (var m=0; m<testitems.length; m++) {
                var test = {
                    "test_number": testNumber,
                    "testgroupId": new_testgroup_id,
                    "testgroupName": testitems[m].testgroupName, // Assign because router use testplans/:chipName/:testName to local this.
                    "chipName": testitems[m].chipName, // Assign because router use testplans/:chipName/:testName to local this.
                    "revision": nextRevNumber
                };
                
                for (var n=0; n<newTestHeaderConfigs.columns.length; n++) {
                    var key = newTestHeaderConfigs.columns[n].name;
                    test[key] = testitems[m][key];
                }
                
                if (newTestHeaderConfigs.registers) {
                    for (var n=0; n<newTestHeaderConfigs.registers.length; n++) {
                        var key = newTestHeaderConfigs.registers[n].name;
                        test[key] = testitems[m][key];
                    }
                }
                
                Testitems.insert(test);
                testNumber++;
            }
            
            if (testgroup.name != "Continuity" && testgroup.name != "Leakage" && testgroup.name != "Active Leakage") {
                // if test group is not one of the above, increment the base number
                baseNumber = roundUp(testNumber);
            }
        } // End of testgroups loop
        

        
        // Increment the latest_revision attribute of testplan rev 0.
        Testplans.update(this._id, {$inc:{latest_revision:1}});
        
        // Hide modal
        $('.release-form-modal').modal('hide');
        
        // Route to the newly created revision.
        Router.go('testplanPage', testplan_nextrev);
    }
});

/// *************** The heavey duty stuffs below ********************************
var exportPinList = function(event, template, testplanObj) {
    var pads = Pads.find({chipName: testplanObj.chipName}).fetch();
    var row = testplanObj.chipName+" Pin List \n";
    row = row + "Pad #, Name, Type\n";
    for (var i=0; i<pads.length; i++) {
        row = row + pads[i].number + ',' + pads[i].name + ',' + pads[i].type + '\n'; 
    }
    return row;
};

var exportRegTable = function(event, template, testplanObj) {
    var registers = Registers.find({chipName: testplanObj.chipName}).fetch();
    var row = testplanObj.chipName+" Analog Control Table \n";
    row = row + "Analog Register, Size, Description\n";
    for (var i=0; i<registers.length; i++) {
        row = row + registers[i].control_name + ',' + registers[i].size + ',' + registers[i].description + '\n'; 
    }
    return row;
};

var exportRevLog = function(event, template, testplanObj) {
    var testplans = Testplans.find({chipName: testplanObj.chipName}, {sort: {revision: 1}}).fetch();
    var row = testplanObj.chipName+" Test Plan Rev Logs \n";
    row = row + "Revision, Note\n";
    for (var i=0; i<testplans.length; i++) {
        if (testplans[i].revision > 0) {
            row = row + testplans[i].revision + ',' + testplans[i].release_note + '\n'; 
        }
    }
    return row;
};

var latestRevisionForTestplan = function (testplan) {
    return Testplans.findOne({chipName:testplan.chipName, revision:0}).latest_revision;
};

var roundUp = function (value) {
    return (~~((value + 99) / 100) * 100);
};

var getNextRevNumberFor = function(dataContext){
    return dataContext.latest_revision + 1;
};

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
    
    // Attach the default test header configs:
    var headerConfigs = testHeaderDefaults;
    headerConfigs["testgroup_name"] = testName;
    headerConfigs["testgroup_id"] = customTest._id;
    headerConfigs["chipName"] = testplanObj.chipName;
    headerConfigs["revision"] = testplanObj.revision;
    TestHeaderConfigs.insert(headerConfigs);
};

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
        var order = 0;
        for (var i = 0; i < pads.length; i++) {
            // Only create the test_item for the pad if there is none already.
            // Pads list sometimes will have same pads appear more than once.
            var pad = pads[i];
            if (!!!Testitems.findOne({pad:pad.name, testgroupId:basicTest._id})) {
                var testSections = configs.testSections;
                for (var j=0; j<testSections.length; j++) {
                    var testSection = testSections[j];
                    
                    var test = {
                        "order":(order*testSections.length+j+1),
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
                order ++;
            }
        }
    }
};