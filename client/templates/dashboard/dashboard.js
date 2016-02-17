// Main Template ///////
///////////// This is for Account verification, it should be in the template that '/' routes to.
Template.dashboard.created = function() {
    if (Accounts._verifyEmailToken) {
        Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
            if (err != null) {
                if (err.message = 'Verify email link expired [403]') {
                    console.log('Sorry this verification link has expired.')
                }
            } else {
                console.log('Thank you! Your email address has been confirmed.')
            }
        });
    }
};


//////////// Partials /////////////////
Template.newTestPlanForm.helpers({
    "chipNameFormError": function () {
        if (Session.get('chipNameFormError')) {
            return Session.get('chipNameFormError');
        } else {
            return "";
        }
    }    
});

AutoForm.hooks({
    chipNameForm: {
        before: {
            insert: function(doc, template) {
                console.log("before insert");
                console.log(doc);
                var testplans = Testplans.find().fetch();
                // Using underscore.js _.uniq function. It's quadratic time, not efficient for large array.
                // TODO: improve above mentioned efficiency.
                var lowerCaseChipNames = _.uniq(testplans.map(function(testplan){
                    return testplan.chipName;
                })).map(function (name) {
                    return name.toLowerCase();
                });
                
                if (!Meteor.user()) {
                    alert('You must log in first!');
                    return false;
                }
                
                if (!doc.chipName) {
                    // Empty string
                    Session.set('chipNameFormError', "Chip Name is required!");
                    return false;
                }
                else if (lowerCaseChipNames.indexOf(doc.chipName.toLowerCase()) > -1) {
                    // Duplicate chipName.
                    Session.set('chipNameFormError', "Test plans for this chip has already been created!");
                    return false;
                } 
                else if (doc.chipName.length > 10) {
                    Session.set('chipNameFormError', "Chip Name must be 10 characters or less");
                    return false;
                }
                else if (doc.chipName.indexOf('!')<=0) {
                    // '!' not allowed in chip name, otherwise the reveal panel won't revweal
                    Session.set('chipNameFormError', "! is not allowed in the chip name");
                    return false;
                }
                else {
                    Session.set('chipNameFormError', "");
                    return doc;
                }
                
                return false;
            }
        },
        
        after: { // Doesn't got called.
            insert: function (error, result, template) {
                // Dismiss the modal.
                $('.chip-name-modal').modal('hide');
    
                //result is the _id of the generated document.
                var testplan = Testplans.findOne(result);
                Router.go('testplanPage', testplan);
            }
        }
    }
});

