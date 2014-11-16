// Main Template ///////




//////////// Partials /////////////////
var chipNameSubmit = function(chip_name){
    console.log("chip name is "+chip_name);
    $('.chip-name-modal').modal('hide');
};

Template.newTestPlanForm.events({
    // User hit enter on the input field
    // TODO: check if input field is empty.
    "keyup .chip-name-input": function(event, template) {
        if (event.keyCode==13) {
            var chip_name = $('.chip-name-input')[0].value;
            chipNameSubmit(chip_name);
        }
    },

    // User click submit button
    // TODO: check if input field is empty.
    "click .chip-name-input-submit": function(event, template) {
        var chip_name = $('.chip-name-input')[0].value;
        chipNameSubmit(chip_name);
    }
});