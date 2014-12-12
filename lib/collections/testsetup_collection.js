Testsetups = new Mongo.Collection('testsetups');

Testsetups.allow({
    insert: function (userId, document) {
        return !!userId;
    },

    remove: function (userId, document) {
        return !!userId;
    }
});

// Althernatively, could call these Meteor methods from client.
Meteor.methods({
    "testsetupsUpdate": function (id, document) {
        if (Meteor.user()) {
            return Testsetups.update(id, document);
        } else {
            return new Meteor.Error("logged-out", "The user must be logged in to update test setup");
        }
    }
});


/* // Somehow cause update in editable_cell not working when schema is attached.
.attachSchema(new SimpleSchema({
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

})); */