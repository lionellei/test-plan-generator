// ********* Main Template *************



// ********* Partials ******************
Template.newTestGroupForm.helpers({
   "hiddenOrShow": function () {
       // Use .prob('checked') instead of .checked for the jquery selector
       /*
       if ($('.select-custom-test').prop('checked')) {
           return "show";
       } else {
           return "hidden";
       }*/

       // Or this way:
       // return $('.select-custom-test').prop('checked')? "show" : "hidden";

       // TODO: Why the two ways above is not reactive? Resort to this hacky way below:
       return Session.get('showCustomTestNameInput')? "show" : "hidden";
   },

   "customTestChecked": function () {
       return Session.get('showCustomTestNameInput');
   }
});

Template.newTestGroupForm.events({
   // Use the change event instead of click because this checkbox could change programatically
   // i.e., checking any of the template checkbox will unchecked this checkbox.
   "change .select-custom-test": function() {
       // Toggle the 'showCustomTestNameInput' key:
       Session.set('showCustomTestNameInput', !Session.get('showCustomTestNameInput'));
       
       // Deselect other testplan templates when custom test is selected.
       if (Session.get('showCustomTestNameInput')) {
           $('#select-continuity-template').prop('checked', false);
           $('#select-leakage-template').prop('checked', false);
       }
   },
   
   "change .select-template": function() {
       // either one of the template checkbox is changed will trigger this event.
       // and if any of them is "checked" then deselect the custom test through Session['showCustomTestNameInput']
       if ($('#select-continuity-template').prop('checked') ||
           $('#select-leakage-template')) {
               Session.set('showCustomTestNameInput', false);
           }
   }
});
