// Register helpers that could be used in all templates

/*
Template.registerHelper(
    "cellIsEditing", function(data) {
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
});
*/