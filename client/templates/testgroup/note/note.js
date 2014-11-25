Template.note.helpers({
    "cellAttributes": function(cell_name) {
        return {
           class: "editable list-group-item",
           id: cell_name + '+' + this._id
        };
    }    
});

Template.note.events({
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
});