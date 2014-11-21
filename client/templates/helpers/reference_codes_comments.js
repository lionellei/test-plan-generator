// Generate a unique ID for arbitrary object, such as those embedded in a mongo document:
// "_id": new Meteor.Collection.ObjectID()._str // Generate a unique ID so it could be updated in template

// Filtering array
/*
homes.filter(function (el) {
  return el.price <= 1000 &&
         el.sqft >= 500 &&
         el.num_of_beds >=2 &&
         el.num_of_baths >= 2.5;
});
*/

/*
var generateContinuityTests = function(testplanObj) { 
    // chipObj has the following data:
    // Object { _id: "MQ9qAHguc24ip3gw5", chipName: "qTIAX1B" }
    
    var pads = Pads.find({chipName:testplanObj.chipName}).fetch();
    if (pads.length > 0) { //check if there is Pads list first!!
        console.log("Generating continuity test for "+testplanObj.chipName);
        
        // First create or retrieve the testgroup with the given name
        // this is of type "Testgroups"
        var continuityTest = getTestGroupByName("Continuity", testplanObj.chipName, testplanObj._id);
        
        // Generate the setup
        var supplyPads = Pads.find({chipName:testplanObj.chipName, type:"SUPPLY"}).fetch();
        // Although we are using a mongo collection to store the setups instead of embedding
        // it in testgroup, still need the array in memory for faster checking if a setup for
        // a certain pad has already existed, instead of quering the collection every iteration.
        var setups = Testsetups.find({testgroup_id:continuityTest._id}).fetch(); 
        
        for (var i = 0; i < supplyPads.length; i++) {
            pad = supplyPads[i];

            if (setups.length == 0 | setups.filter(function(item){return (item.pad==pad.name);}).length == 0) {
                // if that setup is not already in the array.
                // Need to check this because the same pads may be listed multiple times in the pads list.
                var setup = {
                    "testgroup_name": continuityTest.name,
                    "testgroup_id": continuityTest._id,
                    "chipName": testplanObj.chipName,
                    "pad": pad.name,
                    "source_type": "V",
                    "source_value": "0",
                    "source_unit": "V"
                };
                setups.push(setup); // Save in the memory for fast checking for duplicate pad setups.
                
                // Insert into collection:
                Testsetups.insert(setup);
            }
        }
        Testgroups.update(continuityTest._id, {$set: {setups:setups}});
       
        // Loops through all the pads
        for (var i = 0; i < pads.length; i++) {
            // Only create the test_item for the pad if there is none already.
            // Pads list sometimes will have same pads appear more than once.
            pad = pads[i];
            if (!!!Testitems.findOne({pad:pad.name, testgroupId:continuityTest._id})) {
                // Create one testitem for source (+ current) test and one for sink (- current)
                var source_test = {
                    "testgroupId": continuityTest._id, // Assign the testgroupId to identify this test item belongs to this test group. 
                    "testgroupName": "Continuity", // Assign because router use testplans/:chipName/:testName to local this.
                    "chipName": testplanObj.chipName, // Assign because router use testplans/:chipName/:testName to local this.
                    "pad": pad.name,
                    "source_type": "I",
                    "source_value": "100",
                    "source_unit": "uA",
                    "compliance_type": "V",
                    "compliance_value": "2",
                    "compliance_unit": "V",
                    "measure_type": "V",
                    "measure_min": "0.35",
                    "measure_typ": "0.6",
                    "measure_max": "0.97",
                    "measure_unit": "V"
                };
                Testitems.insert(source_test);
                
                var sink_test = source_test;
                sink_test["source_value"] = "-100";
                sink_test["compliance_value"] = "-2";
                sink_test["measure_min"] = "-0.85";
                sink_test["measure_typ"] = "-0.71";
                sink_test["measure_max"] = "-0.35";
                Testitems.insert(sink_test);
            }
        }
    }
};

// Leakage Test.
var generateLeakageTests = function(testplanObj) { 
    // chipObj has the following data:
    // Object { _id: "MQ9qAHguc24ip3gw5", chipName: "qTIAX1B" }
    
    var pads = Pads.find({chipName:testplanObj.chipName}).fetch();
    if (pads.length > 0) { //check if there is Pads list first!!
        console.log("Generating Leakage test for "+testplanObj.chipName);
        
        // First create or retrieve the testgroup with the given name
        // this is of type "Testgroups"
        var leakageTest = getTestGroupByName("Leakage", testplanObj.chipName, testplanObj._id);
        
        // Generate the setup
        var supplyPads = Pads.find({chipName:testplanObj.chipName, type:"SUPPLY"}).fetch();
        
        // Although we are using a mongo collection to store the setups instead of embedding
        // it in testgroup, still need the array in memory for faster checking if a setup for
        // a certain pad has already existed, instead of quering the collection every iteration.
        var setups = Testsetups.find({testgroup_id:leakageTest._id}).fetch(); 

        for (var i = 0; i < supplyPads.length; i++) {
            pad = supplyPads[i];

            if (setups.length == 0 | setups.filter(function(item){return (item.pad==pad.name);}).length == 0) {
                // if that setup is not already in the array.
                // Need to check this because the same pads may be listed multiple times in the pads list.
                var setup = {
                    "testgroup_name": leakageTest.name,
                    "testgroup_id": leakageTest._id,
                    "chipName": testplanObj.chipName,
                    "pad": pad.name,
                    "source_type": "V",
                    "source_value": "0",
                    "source_unit": "V"
                };
                setups.push(setup); // Save in the memory for fast checking for duplicate pad setups.
                
                // Insert into collection:
                Testsetups.insert(setup);
            }
        }
        Testgroups.update(leakageTest._id, {$set: {setups:setups}});
       
        // Loops through all the pads
        for (var i = 0; i < pads.length; i++) {
            // Only create the test_item for the pad if there is none already.
            // Pads list sometimes will have same pads appear more than once.
            pad = pads[i];
            if (!!!Testitems.findOne({pad:pad.name, testgroupId:leakageTest._id})) {
                // Create one testitem for source (+ current) test and one for sink (- current)
                var source_test = {
                    "testgroupId": leakageTest._id, // Assign the testgroupId to identify this test item belongs to this test group. 
                    "testgroupName": "Leakage", // Assign because router use testplans/:chipName/:testName to local this.
                    "chipName": testplanObj.chipName, // Assign because router use testplans/:chipName/:testName to local this.
                    "pad": pad.name,
                    "source_type": "V",
                    "source_value": "-0.2",
                    "source_unit": "V",
                    "compliance_type": "I",
                    "compliance_value": "-200",
                    "compliance_unit": "uA",
                    "measure_type": "I",
                    "measure_min": "-300",
                    "measure_typ": "0",
                    "measure_max": "20",
                    "measure_unit": "uA"
                };
                Testitems.insert(source_test);
                
                var sink_test = source_test;
                sink_test["source_value"] = "0.2";
                sink_test["compliance_value"] = "200";
                sink_test["measure_min"] = "-20";
                sink_test["measure_max"] = "300";
                Testitems.insert(sink_test);
            }
        }
    }
};
*/