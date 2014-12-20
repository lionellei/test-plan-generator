Template.admin.helpers({
    "log": function () {
        console.log(this);
    },
    
    "users": function() {
        return Meteor.users.find().fetch();
    },
    
    "toggleVerifyButtonStyle": function (verified) {
        if (verified) {
            return 'btn-success';
        } else {
            return 'btn-danger';
        }
    },
    
    "toggleVerifyButtonText": function (verified) {
        if (verified) {
            return 'Verified';
        } else {
            return 'Unverified';
        }
    }
});

Template.admin.events({
    "click .admin-toggle-verify-button": function (event, template) {
        var thisUser = Meteor.users.findOne({emails: {$elemMatch:{address:event.currentTarget.id}}});
        var verified = !thisUser.emails[0].verified;
        Meteor.users.update(
            { _id:thisUser._id },
            { $set: 
                {
                    'emails.0.verified': verified
                }
            }
        );
    }
});