Template.testgroup.helpers({
   "testitems": function() {
       return Testitems.find();
   },

   "showExampleRow": function() {
       // TODO: In reality only query within the test group instead of whole collection
       return !!!(Testitems.find().count() > 0);
   }
});

Template.testgroup.events({
   "click .example-info": function(){
       alert("This is just an example row.");
   },

   // Export the test plan to csv file.
   "click .export-button": function(){
      console.log("export button clicked");
      var testItems = Testitems.find().fetch();
      
      var data = ""; // use a string to form the CSV file
      for (var i=0; i<testItems.length; i++) {
         item = testItems[i];
         var row = item.pad + ',' + item.resource + ',' + item.source_type+"src="+item.source_value+item.source_unit+','
                  + item.compliance_type+"cmp="+item.compliance_value+item.compliance_unit + ','
                  + "Cont "+item.pad+" ("+item.source_type+"src="+item.source_value+' '+item.source_unit+')' + ','
                  + item.measure_min + ',' + item.measure_typ + ',' + item.measure_max + ',' + item.measure_unit 
                  + '\n' ;
         data = data + row;
      }
      
      var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "testplan.csv");
   }
});

///////////// This is for Account verification, it should be in the template that '/' routes to.
Template.testgroup.created = function() {
    if (Accounts._verifyEmailToken) {
        Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
            if (err != null) {
                if (err.message = 'Verify email link expired [403]') {
                    console.log('Sorry this verification link has expired.')
                }
            } else {
                console.log('Thank you! Your email address has been confirmed.')
            }
        });
    }
};
