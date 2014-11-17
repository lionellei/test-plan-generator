// Main Template ///////




//////////// Partials /////////////////
AutoForm.hooks({
    chipNameForm: {
        onSuccess: function(operation, result, template){
            // Dismiss the modal.
            $('.chip-name-modal').modal('hide');

            //result is the _id of the generated document.
            var testplan = {chipName: Testplans.findOne(result).chipName};
            Router.go('testplanPage', testplan);
        }
    }
});