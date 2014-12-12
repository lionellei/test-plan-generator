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
        return ((Session.get(cell_identifier) == true) && (this.revision == 0));
        // Each cell when clicked will create a session variable with key of the cell identifier with value true
        // Why not just use a Session.get('currentEditingCell') to store the cell identifier?
        // Because you want to set the particular key to false when the cell is focus out (when user clicks away)
        // instead of setting Session.set('currentEditingCell', null). Because focus out will also get triggered when
        // the user click another cell, and that cell's .rendered method will try to set Session['currentEditingCell']
        // too, so there is chance for conflict.
    }, 
    
    "cellAttributes": function(cell_name) {
        var text_class = "";
        if (this.revision == 0) {
            text_class = "text-primary";
        }
        return {
           class: "editable "+text_class,
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

    "useSelectBox": function() {
        // console.log(this);
        if (this.header.allowed_value.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    "allowedValues": function() {
        var selectedOption = this.value;
        var returnArray = [];
        if (this.header.allowed_value.length > 0) {
            returnArray = this.header.allowed_value.split(',').map(function(item){
                return {
                    option:item,
                    selectedOption:selectedOption
                };
            });
        }
        return returnArray;
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
            var inputText = template.find(".get-cell-value").value;
            
            // Call this function to do the heavy lifting of updating the cell.
           // TODO: after update there is "Exception in defer callback: Error: Can't select in removed DomRange"
           // only happens when updating pad, so maybe due to autocomplete package.
            updateCell(event,inputText,this);
            
            // disable the cell for editing once "enter" is pressed.
            disableEditing();
       }
   },

   "change .selecting-cell": function(event, template) {
       // The 'this' object for this template holds the following info:
       // Object {value: "CATHODE_L", cell_name: "pad", object_id: "NShKFazs6uWcACqkh"}
       var inputText = template.find(".get-cell-value").value;
        // Call this function to do the heavy lifting of updating the cell.
        updateCell(event,inputText,this);

       // disable the cell for editing once "enter" is pressed.
        disableEditing();
   },
   
    ////////////// For test notes input //////////////////////
    "click .note-update-button": function(event, template) {
        var inputText = template.find(".get-cell-value").value;
        updateCell(event, inputText, this);
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
            // Meteor.call('notesRemove', this.object_id);
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
var updateCell = function(event, inputText, data) { // data is the data context in template.
    ///console.log(data);
    //if (event.currentTarget.value != data.value) { // check if there is change
    // Use this instead of the above line to accomdate that the update is not triggerred 
    // by the same currentTarget, i.e. via a button, where currentTarget is the button but
    // the value resides in another element.
    if (inputText != data.value) {
        //console.log(inputText);
        switch (data.collection) {
            case 'Testitems':
                var testItem = Testitems.findOne(data.object_id);
                if (data.cell_name == "order") {
                    testItem[data.cell_name] = Number(event.currentTarget.value);
                } else {
                    testItem[data.cell_name] = event.currentTarget.value;
                }

                Testitems.update(data.object_id, testItem);
                break;
                
            case 'Testsetups':
                var testsetup = Testsetups.findOne(data.object_id);
                testsetup[data.cell_name] = event.currentTarget.value;
                Testsetups.update(data.object_id, testsetup);
                break;
                
            case 'Notes':
                var note = Notes.findOne(data.object_id);
                note[data.cell_name] = inputText;
                Meteor.call('notesUpdate', data.object_id, note);
                // Use methods, because restricted collection does not allow replace document.
                // And using $set, does not allow using data.cell_name for key.
                // Notes.update(data.object_id, note);  
                break;
                
            default:
                console.log('Need to provide update codes for the '+data.collection+" collection");
                break;
        }
    }
}
