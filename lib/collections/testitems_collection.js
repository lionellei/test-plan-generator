Testitems = new Mongo.Collection('testitems');

//TODO: Need to replace this nuclear method with something more precise.
Meteor.methods({
    removeAllTestItems: function () {
        Testitems.remove({});
    }
});