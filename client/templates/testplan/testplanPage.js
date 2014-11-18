// ********* Main testplanPage Template *************



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
           if ($('#select-continuity-template').prop('checked')) {
               // Do something to create continuity tests
               console.log('Create continuity test');
               generateContinuityTests(this);
           }
           
           if ($('#select-leakage-template').prop('checked')) {
               // Do something to create leakage test group
               console.log('Create leakage test');
           }
       }
       
       $('.add-test-group-modal').modal('hide');
   }
});

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

var generateContinuityTests = function(chipObj) { 
    // chipObj has the following data:
    // Object { _id: "MQ9qAHguc24ip3gw5", chipName: "qTIAX1B" }
    // TODO: Does it need to take a collection as argument?
    
    var pads = Pads.find({chipName:chipObj.chipName}).fetch();
    if (pads.length > 0) { //check if there is Pads list first!!
        console.log("Generating continuity test for "+chipObj.chipName);
        
        // First create or retrieve the testgroup with the given name
        var continuityTest = getTestGroupByName("Continuity", chipObj.chipName, chipObj._id);
        console.log(continuityTest);
        // Loops through all the pads
        /*
        for (var i = 0; i < pads.length; i++) {
            // Only create the test_item for the pad if there is none already.
            // Pads list sometimes will have same pads appear more than once.
            // TODO: In reality, should check within the same testgroup instead of the entire collection.
            pad = pads[i];
            if (!!!Testitems.findOne({pad:pad.name})) {
                var test_item = {
                    "pad": pad.name,
                    "resource": prototype_test.resource,
                    "source_type": prototype_test.source_type,
                    "source_value": prototype_test.source_value,
                    "source_unit": prototype_test.source_unit,
                    "compliance_type": prototype_test.compliance_type,
                    "compliance_value": prototype_test.compliance_value,
                    "compliance_unit": prototype_test.compliance_unit,
                    "measure_type": prototype_test.measure_type,
                    "measure_min": prototype_test.measure_min,
                    "measure_typ": prototype_test.measure_typ,
                    "measure_max": prototype_test.measure_max,
                    "measure_unit": prototype_test.measure_unit
                };
                Testitems.insert(test_item);
            }
        } */
    }
};