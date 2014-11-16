// Main Template ///////




//////////// Partials /////////////////
var chipNameSubmit = function(){
    $('.chip-name-modal').modal('hide');
};

Template.newTestPlanForm.events({
    // User hit enter on the input field
    // TODO: check if input field is empty.
    "keyup .chip-name-input": function(event, template) {
        if (event.keyCode==13) {
            chipNameSubmit();
        }
    },

    // User click submit button
    // TODO: check if input field is empty.
    "click .chip-name-input-submit": function(event, template) {
        chipNameSubmit();
    }
});