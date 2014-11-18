
Template.padsList.helpers({
   log: function() {
      console.log(this);
      console.log(this.fetch());
   },
   
   // A hacky way to let spreadsheet-to-mongo package call back to know the chipName
   setChipNameInSession: function() {
      //console.log(this.matcher._selector.chipName);
      Session.set('currentChipName', this.matcher._selector.chipName);
      console.log(Session.get('currentChipName'));
   }
});


