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
        return numRowsSelected();
    },
    
    "showOrHideCopyToAllPadsButton": function () {
        if (numRowsSelected() == 1) {
            return "";
        } else {
            return "disabled";
        }
    }
});

Template.footer.events({
    "click .delete-selected-rows": function (event, template) {
        if (Session.get('selectedRowsIds') && Session.get('selectedRowsIds').length>0) {
            var r = confirm(Session.get('selectedRowsIds').length+" rows will be removed, are you sure?");
            if (r) {
                Meteor.call('removeSelectedTestItems', Session.get('selectedRowsIds'));
                Session.set('selectedRowsIds', []);
            }
        } 
    }, 
    
    "click .duplicate-selected-rows": function (event, template) {
        if (Session.get('selectedRowsIds') && Session.get('selectedRowsIds').length>0) {
            var r = confirm(Session.get('selectedRowsIds').length+" rows will be duplicated, are you sure?");
            if (r) {
                var ids = Session.get('selectedRowsIds');
                for (var i=0; i<ids.length; i++) {
                    var testitem = Testitems.findOne(ids[i]);
                    //testitem_copy = testitem;
                    delete testitem._id; // need to erase the _id field otherwise mongo prevents insertion.
                    Testitems.insert(testitem);
                }
            }
        }         
    },
    
    "click .copy-to-all-pads": function(event, template) {
        if (numRowsSelected() == 1) {
            var r = confirm("Copy this test to all pads?");
            if (r == true) {
                var prototype_row_id = Session.get('selectedRowsIds')[0];
                var prototype_test = Testitems.findOne(prototype_row_id);
                var pads = Pads.find({chipName: prototype_test.chipName}).fetch();
    
                if (pads.length == 0) {
                    alert("There is no Pads List defined for this chip. Please import the Pads List first.");
                } else {
                    // Loops through all the pads copy the prototype test's value, except the pad name.
                    // To prevent duplicate test on the same pad:
                    padNames = [];
                    for (var i = 0; i < pads.length; i++) {
                        pad = pads[i];
                        if (pad.name != prototype_test.pad & padNames.filter(function(name){return pad.name == name;}).length==0) {
                            padNames.push(pad.name);
                            var test_item = prototype_test;
                            test_item["pad"] = pad.name;
                            delete test_item._id;
                            Testitems.insert(test_item);
                        }
                    }                
                }
            }            
        } else {
            alert('Select only one row to use this feature.');
        }

    },
});


//********************* Sub Templates ****************************
Template.modifyRowsModal.helpers({
    "attributeToModifyIsType": function () {
        if (Session.get('modifyAttributeIsType')) {
            return true;
        } else {
            return false;
        }
    }, 
    
    "numRowsSelected": function () {
        return numRowsSelected();
    }
});

Template.modifyRowsModal.events({
    "change .attributes_to_modify": function (event, template) {
        if (event.currentTarget.selectedOptions["0"].label == "source_type" ||
            event.currentTarget.selectedOptions["0"].label == "compliance_type" ||
            event.currentTarget.selectedOptions["0"].label == "measure_type") {
            Session.set('modifyAttributeIsType', true);
        } else {
            Session.set('modifyAttributeIsType', false);
        }
    }, 
    
    "keyup .change_attribute_value_input": function(event, template) {
        if (event.keyCode == 13) { //"enter" detected
            updateAttributesForTestItem(event, template);
        }
    }, 
    
    "click .modify-rows-submit-btn": function(event, template) {
        updateAttributesForTestItem(event, template);     
    }
});

//// ******************* The heavy lifting stuffs *******************************
var numRowsSelected = function () {
    if (Session.get('selectedRowsIds') && Session.get('selectedRowsIds').length>0) {
        return Session.get('selectedRowsIds').length;
    } else {
        return 0;
    }
};

var updateAttributesForTestItem = function(event, template) {
    var ids = Session.get('selectedRowsIds');
    var keyToChange = template.find(".attributes_to_modify").selectedOptions["0"].label;
    var inputField = template.find(".change_attribute_value_input");
    if (keyToChange == "none") {
        alert("Please select an attribute to change.");
    } else {
        if (ids && ids.length>0) {
            if (inputField.value=="") {
                var r = confirm("The input field is empty, this will erase the value of "+keyToChange+" for the selected rows. Continue?")
                if (r) {
                    commitChangeTestItem(ids, keyToChange, inputField);
                }
            } else {
                commitChangeTestItem(ids, keyToChange, inputField);
            }

        }
    }    
};

var commitChangeTestItem = function(ids, keyToChange, inputField) {
    for (var i=0; i<ids.length; i++) {
        testitem = Testitems.findOne(ids[i]);
        if (testitem[keyToChange] != inputField.value) {
            testitem[keyToChange] = inputField.value;
            Testitems.update(ids[i], testitem);    
        }
    }
    inputField.value=""; //clearing the input field after update is done.
    $('.modify-rows-modal').modal('hide');
};