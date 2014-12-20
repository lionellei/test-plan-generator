Meteor.users.allow({
    "update": function () {
        // TODO: in the future, this should be more dynamic and check if the user().isAdmin attribute is true or false.
        if (Meteor.user() && Meteor.user().emails[0].address == "lionel.li@finisar.com") {
            return true;
        } else {
            return false;
        }
    } 
});