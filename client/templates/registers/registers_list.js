Template.registersList.helpers({
   log: function() {
      console.log(this);
      console.log(this.fetch());
   },
   
   // A hacky way to let spreadsheet-to-mongo package call back to know the chipName
   setChipNameInSession: function() {
      //console.log(this.matcher._selector.chipName);
      Session.set('currentChipName', this.matcher._selector.chipName);
      console.log(Session.get('currentChipName'));
   },

   "isVersionZero": function() {
      if (Number(Router.current().params.revision) == 0) {
         return true;
      } else {
         return false;
      }
   },

   "showExampleRow": function() {
      if (this.fetch().length > 0) {
         return false;
      } else {
         return true;
      }
   }
});