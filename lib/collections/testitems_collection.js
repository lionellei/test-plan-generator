Testitems = new Mongo.Collection('testitems');

Testitems.allow({
    insert: function (userId, document) {
        return !!userId;
    },

    remove: function (userId, document) {
        return !!userId;
    }
});

// Althernatively, could call these Meteor methods from client.
Meteor.methods({
    "testitemsUpdate": function (id, document) {
        if (Meteor.user()) {
            return Testitems.update(id, document);
        } else {
            return new Meteor.Error("logged-out", "The user must be logged in to update test item");
        }
    }
});