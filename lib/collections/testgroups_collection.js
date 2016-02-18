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
    },
    is_custom: {
        type: Boolean,
        label: "Is a custom test?",
        defaultValue: true
    },
    setups: {
        type:[Object],
        label: "Setups"
    }
}));

Testgroups.allow({
    insert: function (userId, document) {
        return !!userId;
    },

    remove: function (userId, document) {
        return !!userId;
    },

    update: function (userId, doc, fieldNames, modifier) {
        return !!userId;
    }
});