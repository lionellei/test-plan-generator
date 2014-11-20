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

           //TODO: Refactor this code into a method
           if (event.currentTarget.value != this.value) {
               testItem = Testitems.findOne(this.object_id);
               testItem[this.cell_name] = event.currentTarget.value;
               Testitems.update(this.object_id, testItem);
           }

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

       //TODO: Refactor this code into a method
       if (event.currentTarget.value != this.value) {
           testItem = Testitems.findOne(this.object_id);
           testItem[this.cell_name] = event.currentTarget.value;
           Testitems.update(this.object_id, testItem);
       }

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
    this.firstNode.nextSibling.focus();
};