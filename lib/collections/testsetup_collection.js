Testsetups = new Mongo.Collection('testsetups');
Testsetups.attachSchema(new SimpleSchema({
    // Parent information:
    testgroup_name: {
        type: String
    },
    testgroup_id: {
        type: String
    },
    chipName: {
        type: String,
        label: "Chip Name",
        max: 20
    },
    
    // Test Setups:
    pad: {
        type: String,
        label: "Pad",
        max: 100
    },
    source_type: {
        type: String,
        label: "Source Type",
        max: 100
    },
    source_value: { // the _id of the testplan object 
        type: String,
        label: "Source Value",
        max: 1000
    },
    source_unit: {
        type: String,
        label: "Source Unit",
        max: 20
    }

}));