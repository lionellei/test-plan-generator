// Register helpers that could be used in all templates
Template.registerHelper("currentUserEmail", function () {
    return Meteor.user().emails[0].address;
});

Template.registerHelper("emailStatusClass", function () {
    if (Meteor.user() && Meteor.user().emails[0]) {
        if (Meteor.user().emails[0].verified) {
            return "glyphicon glyphicon-ok text-success";
        } else {
            return "label label-danger";
        }
    } else {
        return "";
    }
});

Template.registerHelper("emailStatusText", function() {
    if (Meteor.user() && Meteor.user().emails[0]) {
        if (Meteor.user().emails[0].verified) {
            return "";
        } else {
            return "unverified";
        }
    } else {
        return "";
    }
});

Template.registerHelper("emailStatusInfo", function() {
    if (Meteor.user() && Meteor.user().emails[0]) {
        if (Meteor.user().emails[0].verified) {
            return "";
        } else {
            return "A verification link has been sent to the above email. If you have not received it, please check your junk mail box or contact lionel.li@finisar.com for further assistance.";
        }
    } else {
        return "";
    }
});

Template.registerHelper("isVerifiedUser", function () {
    if (Meteor.user() && Meteor.user().emails[0] && Meteor.user().emails[0].verified) {
        return true;
    } else {
        return false;
    }
});

/*
Template.registerHelper(
    "cellIsEditing", function(data) {
    // console.log(data);
    // data passed in has the following form:
    // Object {value: "mA", cell_name: "source_unit", object_id: "483qbHfznNpLCrfGF"}
    var cell_identifier = data.cell_name + '+' + data.object_id;
    return (Session.get(cell_identifier) == true);
    // Each cell when clicked will create a session variable with key of the cell identifier with value true
    // Why not just use a Session.get('currentEditingCell') to store the cell identifier?
    // Because you want to set the particular key to false when the cell is focus out (when user clicks away)
    // instead of setting Session.set('currentEditingCell', null). Because focus out will also get triggered when
    // the user click another cell, and that cell's .rendered method will try to set Session['currentEditingCell']
    // too, so there is chance for conflict.
});
*/
