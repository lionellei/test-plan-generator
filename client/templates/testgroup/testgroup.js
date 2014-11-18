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
      
      // Title row:
      var title = testItems[0].chipName + ' ' + testItems[0].testgroupName + '\n' + '\n';
      data = data + title;
      
      // Test setup
      // Hardcode for now, TODO: make it programatically
      var setup = "Setup" + '\n' + "Pad,Source,Unit" + '\n' + "VCC,0,V" + '\n' + "GND,0,V" + '\n' + '\n';
      data = data + setup;
      
      // Header row:
      var header = "Tests" + '\n' + "Pad,Source,Compliance,Measure,MIN,TYP,MAX,UNIT" + '\n';
      data = data + header;
      
      for (var i=0; i<testItems.length; i++) {
         item = testItems[i];
         var row = item.pad + ',' + item.source_type+"src="+item.source_value+item.source_unit+','
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
