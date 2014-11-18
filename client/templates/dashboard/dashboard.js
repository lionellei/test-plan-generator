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
AutoForm.hooks({
    chipNameForm: {
        onSuccess: function(operation, result, template){
            // Dismiss the modal.
            $('.chip-name-modal').modal('hide');

            //result is the _id of the generated document.
            var testplan = {chipName: Testplans.findOne(result).chipName};
            Router.go('testplanPage', testplan);
        }
    }
});

