Testitems = new Mongo.Collection('testitems');

Meteor.methods({
    removeAllTestItems: function () {
        Testitems.remove({});
    }
});