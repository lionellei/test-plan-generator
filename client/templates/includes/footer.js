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


//********************* Sub Templates ****************************
Template.modifyRowsModal.events({
    "change .attributes_to_modify": function (event, template) {
        //console.log(event);
        //console.log(template);
        //console.log(this);
        //console.log(event.currentTarget.selectedOptions);
        console.log(event.currentTarget.selectedOptions["0"]);
        console.log(event.currentTarget.selectedOptions["0"].label);
    }, 
    
    "keyup .change_attribute_value_input": function(event, template) {
        if (event.keyCode == 13) { //"enter" detected
            //Use template.find instead of template.$, template.find returns an object that packs much
            //more information then the jquery object.
            //console.log(template.find(".attributes_to_modify").selectedOptions["0"].label);
            //console.log(event.currentTarget.value);
            var ids = Session.get('selectedRowsIds');
            if (ids && ids.length>0) {
                for (var i=0; i<ids.length; i++) {
                    testitem = Testitems.findOne(ids[i]);
                    //TODO: need to check of the key is selected.
                    var keyToChange = template.find(".attributes_to_modify").selectedOptions["0"].label;
                    //TODO: validate value.
                    testitem[keyToChange] = event.currentTarget.value;
                    Testitems.update(ids[i], testitem);
                }
            }
        }
    }
});