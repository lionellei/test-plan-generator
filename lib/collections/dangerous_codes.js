//TODO: All the codes here need to be removed in production!!
Meteor.methods({
    removeAllTestItems: function () {
        Testitems.remove({});
    }
});

