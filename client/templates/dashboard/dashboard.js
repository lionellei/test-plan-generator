// Main Template ///////




//////////// Partials /////////////////
AutoForm.hooks({
    chipNameForm: {
        onSuccess: function(operation, result, template){
            // Dismiss the modal.
            $('.chip-name-modal').modal('hide');
        }
    }
});