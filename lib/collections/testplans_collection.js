Testplans = new Mongo.Collection('testplans');
Testplans.attachSchema(new SimpleSchema({
    chipName: {
        type: String,
        label: "Chip Name",
        max: 10,
        //unique: true //TODO: this prevent released testplan creation, figure out a way to check duplicate chip name only when creating test plan.
    }, 
    
    revision: {
        type: Number,
        label: "Revision",
        defaultValue: 0,
        min: 0
    },
    
    // This attribute is only managed by version 0 of the test plan.
    latest_revision: {
        type: Number,
        label: "Latest Revision",
        min: 0,
        defaultValue: 0,
        optional: true 
    },
    
    // This attribute is only available on any version number > 0
    release_note: {
        type: String,
        optional: true
    }
}));

Testplans.allow({
    insert: function(userId, doc) {
        return !!userId; // alllowed when user logged in. TODO: should allow only when user email is verified.
    } 
});
