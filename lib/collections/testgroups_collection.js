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
    revision: {
        type: Number,
        label: "Revision",
        defaultValue: 0
    }
}));