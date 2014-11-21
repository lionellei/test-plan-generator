///////////////////// Events /////////////////////////////
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
        var r = confirm("Copy this test to all pads?");
        if (r == true) {
            var prototype_row_id = template.data._id;
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
                        var test_item = {
                            "testgroupId": prototype_test.testgroupId, 
                            "testgroupName": prototype_test.testgroupName, 
                            "chipName": prototype_test.chipName, 
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
        }
    },

    // Click to edit
    "click .editable": function(event, template){
        // Each cell when clicked will create a session variable with key of the cell identifier with value true
        // Why not just use a Session.get('currentEditingCell') to store the cell identifier?
        // Because you want to set the particular key to false when the cell is focus out (when user clicks away)
        // instead of setting Session.set('currentEditingCell', null). Because focus out will also get triggered when
        // the user click another cell, and that cell's .rendered method will try to set Session['currentEditingCell']
        // too, so there is chance for conflict.
        var previousEditingCellIdentifier = Session.get("currentEditingCell");
        Session.set(previousEditingCellIdentifier, false); // Disable editing for the previous cell.
        Session.set(event.currentTarget.id, true);
        Session.set("currentEditingCell", event.currentTarget.id);
    }
});


//////////// Helpers ////////////////
Template.testitem.helpers({
    "log": function() {
      console.log(this);  
    },
    
    // Create the attributes for each cell in the testitem row:
    "cellAttributes": function(cell_name) {
        //console.log("test item field is"+cell_name);
        var bgClass = "";
        switch (cell_name) {
            case "source_type":
            case "source_value":
            case "source_unit":
                bgClass = "bg-success";
                break;
            case "compliance_type":
            case "compliance_value":
            case "compliance_unit":
                bgClass = "bg-warning";
                break;
            case "measure_type":
            case "measure_min":
            case "measure_typ":
            case "measure_max":
            case "measure_unit":
                bgClass = "bg-info";
                break;
            default :
                bgClass = "bg-default";
                break;
        }
        return {
            class: "editable text-center "+bgClass,
            id: cell_name + '+' + this._id
        };
    }
});
