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
    },
    
    // Row select checkbox
    "change .row_select_checkbox": function (event, template) {
        //console.log(event.currentTarget.checked);
        //console.log(template.data._id);
        if (event.currentTarget.checked) { //checked, add to array of selected rows ids
            if(!Session.get('selectedRowsIds')) {
                Session.set('selectedRowsIds', [template.data._id]);
            } else {
                var ids = Session.get('selectedRowsIds');
                ids.push(template.data._id);
                Session.set('selectedRowsIds', ids);
            }
        } else { //unchecked, remove from array of selected rows ids
            if(Session.get('selectedRowsIds')) {
                var ids = Session.get('selectedRowsIds');
                index = ids.indexOf(template.data._id);
                ids.splice(index,1);
                Session.set('selectedRowsIds', ids);
            }
        }
        //console.log(Session.get('selectedRowsIds'));
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
    },
    
    // check if the checkbox needs to be checked
    "checked": function () {
        if (Session.get('selectedRowsIds') && Session.get('selectedRowsIds').indexOf(this._id)>=0 ) {
            return true;
        } else {
            return false;
        }
    }
});
