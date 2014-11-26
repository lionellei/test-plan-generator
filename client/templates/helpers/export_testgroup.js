
   exportTestgroup = function(testgroup){ // Need to pass in the testgroup object
      //console.log("export button clicked");
      var testItems = Testitems.find({testgroupId:testgroup._id}).fetch(); 
      var testsetups = Testsetups.find({testgroup_id:testgroup._id}).fetch();
      var testNotes = Notes.find({testgroupId:testgroup._id}).fetch();
      
      var data = ""; // use a string to form the CSV file
      
      // Title row:
      var title = testgroup.chipName + ' ' + testgroup.name + '\n' + '\n';
      data = data + title;
      
      // Test notes:
      var noteHeader = "Notes" + '\n';
      data = data + noteHeader;
      var noteRows = "";
      for (var i=0; i<testNotes.length; i++) {
          noteRows = noteRows + testNotes[i].note_text + '\n';
      }
      data = data + noteRows + '\n';
      
      // Test setup
      var setupHeader = "Setup" + '\n' + "Pad,Source,Unit" + '\n';
      data = data + setupHeader;
      var setupRows = "";
      for (var i=0; i<testsetups.length; i++) {
          setup = testsetups[i];
          setupRow = setup.pad + ',' + setup.source_value + ',' + setup.source_unit + '\n';
          setupRows = setupRows + setupRow;
      }
      data = data + setupRows + '\n';
      
      // Header row:
      var header = "Tests" + '\n' + "Pad,Source,Compliance,Measure,MIN,TYP,MAX,UNIT" + '\n';
      data = data + header;
      
      var measLabelPrefix = testgroup.name.substring(0,4);
      for (var i=0; i<testItems.length; i++) {
         item = testItems[i];
         var row = item.pad + ',' + item.source_type+"src="+item.source_value+item.source_unit+','
                  + item.compliance_type+"cmp="+item.compliance_value+item.compliance_unit + ','
                  + measLabelPrefix+" "+item.pad+" ("+item.source_type+"src="+item.source_value+' '+item.source_unit+')' + ','
                  + item.measure_min + ',' + item.measure_typ + ',' + item.measure_max + ',' + item.measure_unit 
                  + '\n' ;
         data = data + row;
      }

      return data; // just return the data for the file
      /*
      var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      var fileName = this.matcher._selector.chipName+"_"+this.matcher._selector.testgroupName+".csv";
      saveAs(blob, fileName); */
   };