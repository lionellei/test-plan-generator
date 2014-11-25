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
    
    "cellAttributes": function(cell_name) {
        return {
           class: "editable",
           style: "width:100%; white-space:pre", 
           id: cell_name + '+' + this.object_id
        };
    }    
});

Template.editable_cell.events({
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
    
    // Had to use two different events, one for editing_cell and one for selecting_cell
    // Because if the cell is a textarea, the focusout event will intercept the update button click
    // event. So for textarea the class is neither editing_cell nor selecting_cell so no focusout handling.
   "focusout .editing-cell": function(event, template) {
       disableEditing();
   },

   "focusout .selecting-cell": function(event, template) {
        disableEditing();
   },
   ////////////////////////////////////////////////////////////////////////////////////////////////////////
   
   "keyup .editing-cell": function(event, template) {
       if (event.keyCode === 13) {
            // The 'this' object for this template holds the following info:
            // Object {value: "CATHODE_L", cell_name: "pad", object_id: "NShKFazs6uWcACqkh"}
            // console.log(this);     
            
            // Call this function to do the heavy lifting of updating the cell.
            updateCell(event,template,this);
            
            // disable the cell for editing once "enter" is pressed.
            disableEditing();
       }
   },

   "change .selecting-cell": function(event, template) {
       // The 'this' object for this template holds the following info:
       // Object {value: "CATHODE_L", cell_name: "pad", object_id: "NShKFazs6uWcACqkh"}

        // Call this function to do the heavy lifting of updating the cell.
        updateCell(event,template,this);

       // disable the cell for editing once "enter" is pressed.
        disableEditing();
   },
   
    ////////////// For test notes input //////////////////////
    "click .note-update-button": function(event, template) {
        updateCell(event, template, this);
        
        // disable the cell for editing once "enter" is pressed.
        disableEditing();   
    },
    
    "click .note-cancel-button": function(event, template) {
        disableEditing();
    }, 
    
    "click .note-delete-button": function(event, template) {
        r = confirm("Sure you want to delete this note?");
        if (r) {
            Notes.remove(this.object_id);
        }
        disableEditing();
    }
    ///////////////////////////////////////////////////////////
    
    
});


// Focus (put the cursor behind the text) the cell once it becomes editable
Template.editing_cell.rendered = function () {
    //console.log(this);
    this.firstNode.nextElementSibling.focus();
};

// disable editing
var disableEditing = function() {
    var previousKey = Session.get("currentEditingCell");
    if (previousKey != null) {
       Session.set(previousKey, false);
    }
};

// update function
var updateCell = function(event, template, data) { // data is the data context in template.
    ///console.log(data);
    //if (event.currentTarget.value != data.value) { // check if there is change
    // Use this instead of the above line to accomdate that the update is not triggerred 
    // by the same currentTarget, i.e. via a button, where currentTarget is the button but
    // the value resides in another element.
    if (template.find(".get-cell-value").value != data.value) {
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
                
            case 'Notes':
                note = Notes.findOne(data.object_id);
                note[data.cell_name] = template.find(".get-cell-value").value;
                Notes.update(data.object_id, note);
                break;
                
            default:
                console.log('Need to provide update codes for the '+data.collection+" collection");
                break;
        }
    }
}
