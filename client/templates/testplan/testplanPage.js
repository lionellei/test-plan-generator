// ********* Main testplanPage Template *************
Template.testplanPage.helpers({
    "testgroups": function() {
        return Testgroups.find({chipName:this.chipName});
    } 
});


// ********* Partials ******************
Template.newTestGroupForm.helpers({
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
   
   "click #create-test-group-submit": function () {
       if ($('.select-custom-test').prop('checked')) {
           // Do something to create teh custom test group
           console.log('Create custom test');
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

/// *************** The heavey duty stuffs below ********************************
var getTestGroupByName = function(testGroupName, chipName, testplanId) {
    var testgroup = Testgroups.findOne({name:testGroupName, testplanId:testplanId});
    if (!testgroup) { // No testgroup in this testplan that has the given name
        // create it
        testgroup = {
          name: testGroupName,
          chipName: chipName,
          testplanId: testplanId
        };
        testgroup._id = Testgroups.insert(testgroup);
    }
    return testgroup;
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
        var basicTest = getTestGroupByName(testName, testplanObj.chipName, testplanObj._id);
        
        // Generate the setup
        var supplyPads = Pads.find({chipName:testplanObj.chipName, type:"SUPPLY"}).fetch();
        // Although we are using a mongo collection to store the setups instead of embedding
        // it in testgroup, still need the array in memory for faster checking if a setup for
        // a certain pad has already existed, instead of quering the collection every iteration.
        var setups = Testsetups.find({testgroup_id:basicTest._id}).fetch();
        
        // Get the config settings to populate this test:
        var configs = testGroupTemplateConfigs[testName];
        
        for (var i = 0; i < supplyPads.length; i++) {
            pad = supplyPads[i];

            if (setups.length == 0 | setups.filter(function(item){return (item.pad==pad.name);}).length == 0) {
                // if that setup is not already in the array.
                // Need to check this because the same pads may be listed multiple times in the pads list.
                var setup = {
                    "testgroup_name": basicTest.name,
                    "testgroup_id": basicTest._id,
                    "chipName": testplanObj.chipName,
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


/////////////////// Configuration for test templates //////////////////
var testGroupTemplateConfigs = {
    Leakage: {
        // Setups for the supply pins:
        setups: {
            source_type: "V",
            source_value: "0",
            source_unit: "V"
        },
        
        // e.g. a source section and a sink section for continuity
        testSections: [
            {   // Continuity Source
                source_type: "V",
                source_value: "-0.2",
                source_unit: "V",
                compliance_type: "I",
                compliance_value: "-200",
                compliance_unit: "uA",
                measure_type: "I",
                measure_min: "-300",
                measure_typ: "0",
                measure_max: "20",
                measure_unit: "uA"
            },
            
            {   // Continuity Sink
                source_type: "V",
                source_value: "0.2",
                source_unit: "V",
                compliance_type: "I",
                compliance_value: "200",
                compliance_unit: "uA",
                measure_type: "I",
                measure_min: "-20",
                measure_typ: "0",
                measure_max: "300",
                measure_unit: "uA"
            }
        ]
    },
    
    Continuity: {
                // Setups for the supply pins:
        setups: {
            source_type: "V",
            source_value: "0",
            source_unit: "V"
        },
        
        // e.g. a source section and a sink section for continuity
        testSections: [
            {   // Continuity Source
                source_type: "I",
                source_value: "100",
                source_unit: "uA",
                compliance_type: "V",
                compliance_value: "2",
                compliance_unit: "V",
                measure_type: "V",
                measure_min: "0.35",
                measure_typ: "0.6",
                measure_max: "0.97",
                measure_unit: "V"
            },
            
            {   // Continuity Sink
                source_type: "I",
                source_value: "-100",
                source_unit: "uA",
                compliance_type: "V",
                compliance_value: "-2",
                compliance_unit: "V",
                measure_type: "V",
                measure_min: "-0.85",
                measure_typ: "-0.71",
                measure_max: "-0.35",
                measure_unit: "V"
            }
        ]
    }
};   