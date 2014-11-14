Template.testgroup.helpers({
   "testitems": function() {
       return Testitems.find();
   }
});

Template.testgroup.events({
   "click .example-info": function(){
       alert("This is just an example row.");
   }
});