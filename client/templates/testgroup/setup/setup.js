////////////////// Helpers ////////////////////////
Template.setup.helpers({
   // Create the attributes for each cell setup row:
   "cellAttributes": function(cell_name) {
       return {
           class: "editable text-center",
           id: cell_name + '+' + this._id
       };
   }
});