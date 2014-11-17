Testplans = new Mongo.Collection('testplans');
Testplans.attachSchema(new SimpleSchema({
    chipName: {
        type: String,
        label: "Chip Name",
        max: 8
    }
}));