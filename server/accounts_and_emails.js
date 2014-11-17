
// Reference for setting up mail
// https://gentlenode.com/journal/meteor-20-verify-an-email-with-meteor-accounts/42
// (server-side)
Meteor.startup(function() {
    // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
    Accounts.emailTemplates.from = 'Lionel Li <lionel.li@finisar.com>';

    // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
    Accounts.emailTemplates.siteName = 'Test Plan Like A Boss';

    // A Function that takes a user object and returns a String for the subject line of the email.
    Accounts.emailTemplates.verifyEmail.subject = function(user) {
        return 'Confirm Your Email Address';
    };

    // A Function that takes a user object and a url, and returns the body text for the email.
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
    Accounts.emailTemplates.verifyEmail.text = function(user, url) {
        return 'click on the following link to verify your email address: ' + url;
    };
});

Accounts.onCreateUser(function(options, user) {
    user.profile = {};

    // we wait for Meteor to create the user before sending an email
    Meteor.setTimeout(function() {
        console.log("Sending email");
        Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);

    return user;
});

// (server-side) called whenever a login is attempted
// Prevent user from logging in if email not verified.
Accounts.validateLoginAttempt(function(attempt){
    if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
        console.log('email not verified');

        return true; // TODO: change to false in production, so the login is aborted when email not verified.
    }
    return true;
});