Template.testitem.events({

    // Delete Row
    "click .delete-row": function(event, template) {
        // Template.data is the data context of the current template,
        // it has the _id of the object.
        var r = confirm("Deleting this row! Are you sure?");
        if (r == true) {
            Testitems.remove(template.data._id);
        }
    },

    // Make the current row a prototype for the entire Pads list
    "click .prototype-button": function(event, template) {
        var r = confirm("Copy this test to all pads? This will overwrite existing entries!");
        if (r == true) {
            // TODO: Need to check if there is Pads list first!!

            var prototype_row_id = template.data._id;
            var prototype_test = Testitems.findOne(prototype_row_id);
            var pads = Pads.find().fetch();

            // TODO: Make it smarter without removing entire collection first.
            // temporary solution is to remove entire collection and then recreate it.
            // This may cause problem.
            // Meteor.call('removeAllTestItems');


            // Loops through all the pads copy the prototype test's value, except the pad name.
            for (var i = 0; i < pads.length; i++) {
                // Only create the test_item for the pad if there is none already.
                // Pads list sometimes will have same pads appear more than once.
                // TODO: In reality, should check within the same testgroup instead of the entire collection.
                pad = pads[i];
                if (!!!Testitems.findOne({pad:pad.name})) {
                    var test_item = {
                        "pad": pad.name,
                        "resource": prototype_test.resource,
                        "source_type": prototype_test.source_type,
                        "source_value": prototype_test.source_value,
                        "source_unit": prototype_test.source_unit,
                        "compliance_type": prototype_test.compliance_type,
                        "compliance_value": prototype_test.compliance_value,
                        "compliance_unit": prototype_test.compliance_unit,
                        "measure_type": prototype_test.measure_type,
                        "measure_min": prototype_test.measure_min,
                        "measure_typ": prototype_test.measure_typ,
                        "measure_max": prototype_test.measure_max,
                        "measure_unit": prototype_test.measure_unit
                    };
                    Testitems.insert(test_item);
                }

            }
        }
    },

    // Click to edit
    "click .editable": function(event, template){
        // Set the Session variable Session["currentEditingCell"] to the tag id
        Session.set("currentEditingCell", event.currentTarget.id);
    }
});


//////////// Helpers ////////////////
Template.testitem.helpers({
    // Create the attributes for each cell in the testitem row:
    "cellAttributes": function(cell_name) {
        //console.log("test item field is"+cell_name);
        return {
            class: "editable text-center",
            id: cell_name + '+' + this._id
        };
    }
});



/////////////////////// Partial Helpers ///////////////////////////////////
// testitem
//     --> testItemCell
//           --> editing_cell
///////////////////////////////////////////////////////////////////////////
Template.testItemCell.helpers({
    // Return whether the cell is being edited:
    "cellIsEditing": function(data) {
        // console.log(data);
        // data passed in has the following form:
        // Object {value: "mA", cell_name: "source_unit", object_id: "483qbHfznNpLCrfGF"}
        var cell_identifier = data.cell_name + '+' + data.object_id;
        return (Session.get("currentEditingCell") == cell_identifier);
    }
});

Template.editing_cell.helpers({
    "cellNameIsType": function(cell_name) {
        if (cell_name == "source_type" || cell_name == "compliance_type" || cell_name == "measure_type") {
            return true;
        } else {
            return false;
        }
    },

    "checkOptionSelection": function(value, option){
        if (value==option) {
            return {
                selected: "selected"
            }
        }
    }
});

// Focus (put the cursor behind the text) the cell once it becomes editable
Template.editing_cell.rendered = function () {
    console.log(this);
    // this.firstNode.focus();
};