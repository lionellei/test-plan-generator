Testgroups = new Mongo.Collection('testgroups');
Testgroups.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Test Name",
        max: 100
    },
    chipName: {
        type: String,
        label: "Chip Name",
        max: 100
    },
    testplanId: { // the _id of the testplan object 
        type: String,
        label: "Test Plan ID",
        max: 1000
    },
    setups: {
        type: [Object], // In the format of Pad, source_type, source_value, source_unit
        minCount: 0
    }, 
    "setups.$.pad": {
        type: String
    },
    "setups.$.source_type": {
        type: String
    },
    "setups.$.source_value": {
        type: String
    },
    "setups.$.source_unit": {
        type: String
    }
}));