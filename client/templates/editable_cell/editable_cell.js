/////////////////////// Partial Helpers ///////////////////////////////////
// table cell <td>
//     --> editable_cell
//           --> editing_cell
///////////////////////////////////////////////////////////////////////////
Template.editable_cell.helpers({
    // Return whether the cell is being edited:
    "cellIsEditing": function(data) {
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
    }, 
});

//////////////// editing_cell //////////////////////////////////////////////
Template.editing_cell.helpers({
    "log": function () {
        console.log(this);    
    },
    
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
    },
    
    // Autocomplete settings
    "my_settings": function() {
        return {
           position: "top",
           limit: 5,
           rules: [
             {
               collection: Pads,
               field: "name",
               options: 'i', //case insensitive
               matchAll: true,
               filter: {chipName: this.chipName },
               template: Template.padAutoCompleteTemplate
             }
           ]
        };
    },
    
    "cellNameIs": function(cell_name, str) {
        return (cell_name == str);
    }
});

Template.editing_cell.events({
   "focusout": function(event, template) {
       previousKey = Session.get("currentEditingCell");
       if (previousKey != null) {
           Session.set(previousKey, false);
       }
   },

   "keyup .editing-cell": function(event, template) {
       if (event.keyCode === 13) {
            // The 'this' object for this template holds the following info:
            // Object {value: "CATHODE_L", cell_name: "pad", object_id: "NShKFazs6uWcACqkh"}
            // console.log(this);     
            
            // Call this function to do the heavy lifting of updating the cell.
            updateCell(event,template,this);
            
            // disable the cell for editing once "enter" is pressed.
            previousKey = Session.get("currentEditingCell");
            if (previousKey != null) {
               Session.set(previousKey, false);
            }
       }
   },

   "change .selecting-cell": function(event, template) {
       // The 'this' object for this template holds the following info:
       // Object {value: "CATHODE_L", cell_name: "pad", object_id: "NShKFazs6uWcACqkh"}

        // Call this function to do the heavy lifting of updating the cell.
        updateCell(event,template,this);

       // disable the cell for editing once "enter" is pressed.
       previousKey = Session.get("currentEditingCell");
       if (previousKey != null) {
           Session.set(previousKey, false);
       }
   }
});


// Focus (put the cursor behind the text) the cell once it becomes editable
Template.editing_cell.rendered = function () {
    //console.log(this);
    this.firstNode.nextElementSibling.focus();
};

// update function
var updateCell = function(event, template, data) { // data is the data context in template.
    ///console.log(data);
    if (event.currentTarget.value != data.value) { // check if there is change
        switch (data.collection) {
            case 'Testitems':
                testItem = Testitems.findOne(data.object_id);
                testItem[data.cell_name] = event.currentTarget.value;
                Testitems.update(data.object_id, testItem);
                break;
                
            case 'Testsetups':
                testsetup = Testsetups.findOne(data.object_id);
                testsetup[data.cell_name] = event.currentTarget.value;
                Testsetups.update(data.object_id, testsetup);
                break;
            
            default:
                console.log('Need to provide update codes for the '+data.collection+" collection");
                break;
        }
    }
}
