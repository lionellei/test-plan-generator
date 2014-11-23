Template.footer.helpers({
    "showOrHideFooter": function () {
        if (Session.get('selectedRowsIds') && Session.get('selectedRowsIds').length>0) {
            return "show";
        } else {
            return "hidden";
        }
    }, 
    
    // For the badge 
    "numRowsSelected": function () {
        if (Session.get('selectedRowsIds') && Session.get('selectedRowsIds').length>0) {
            return Session.get('selectedRowsIds').length;
        } else {
            return 0;
        }
    }
});

Template.footer.events({
    "click .delete-selected-rows": function (event, template) {
        if (Session.get('selectedRowsIds') && Session.get('selectedRowsIds').length>0) {
            Meteor.call('removeSelectedTestItems', Session.get('selectedRowsIds'));
            Session.set('selectedRowsIds', []);
        } 
    } 
});