Meteor.methods({
    // Helper method to create the csv file
   "testplanToCSV": function(testitems){
      console.log("testplanToCSV called");
      var data = ""; // use a string to form the CSV file
      for (var i=0; i<testitems.length; i++) {
         item = testitems[i];
         var row = item.pad + ',' + item.resource + ',' + item.source_type+"src="+item.source_value+item.source_unit+','
                  + item.compliance_type+"cmp="+item.compliance_value+item.compliance_unit + ','
                  + "Cont "+item.pad+" ("+item.source_type+"src="+item.source_value+' '+item.source_unit+')' + ','
                  + item.measure_min + ',' + item.measure_typ + ',' + item.measure_max + ',' + item.measure_unit 
                  + '\n';
         data = data + row;
      }
      return data;
   } 
});