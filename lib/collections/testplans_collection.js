Testplans = new Mongo.Collection('testplans');
Testplans.attachSchema(new SimpleSchema({
    chipName: {
        type: String,
        label: "Chip Name",
        max: 10,
        unique: true
    }, 
    
    revision: {
        type: Number,
        label: "Revision",
        defaultValue: 0,
        min: 0
    }
}));