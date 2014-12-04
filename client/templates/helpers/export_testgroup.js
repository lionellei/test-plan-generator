
   exportTestgroup = function(testgroup){ // Need to pass in the testgroup object
      //console.log("export button clicked");
      var testItems = Testitems.find({testgroupId:testgroup._id}).fetch(); 
      var testsetups = Testsetups.find({testgroup_id:testgroup._id}).fetch();
      var testNotes = Notes.find({testgroupId:testgroup._id}).fetch();
      var headerConfigs = TestHeaderConfigs.findOne({testgroup_id: testgroup._id});
      
      var data = ""; // use a string to form the CSV file
      
      // Title row:
      var title = testgroup.chipName + ' ' + testgroup.name + ' ' + 'Rev '+testgroup.revision + '\n' + '\n';
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
      
      //TODO: header and rows need to depend on the header configs of the testgroup instead of hardcoded now.
      // Header row:
      //var header = "Tests" + '\n' + "Pad,Source,Compliance,Measure,MIN,TYP,MAX,UNIT" + '\n';
      var header = tableHeader(headerConfigs);
      data = data + header;
      
      // var measLabelPrefix = testgroup.name.substring(0,4);
      for (var i=0; i<testItems.length; i++) {
         item = testItems[i];
         /*
         var row = item.pad + ',' + item.source_type+"src="+item.source_value+item.source_unit+','
                  + item.compliance_type+"cmp="+item.compliance_value+item.compliance_unit + ','
                  + measLabelPrefix+" "+item.pad+" ("+item.source_type+"src="+item.source_value+' '+item.source_unit+')' + ','
                  + item.measure_min + ',' + item.measure_typ + ',' + item.measure_max + ',' + item.measure_unit 
                  + '\n' ; */
         var row = writeTestItemRow(item, headerConfigs);
         data = data + row;
      }

      return data; // just return the data for the file
      /*
      var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      var fileName = this.matcher._selector.chipName+"_"+this.matcher._selector.testgroupName+".csv";
      saveAs(blob, fileName); */
   };
   
   var tableHeader = function(configs){
      var row = "";
      row = row + "Number,";
      var columns = configs.columns;
      for (var i=0; i<columns.length; i++) {
         var column = columns[i];
         if ([ "source_type", 
               "source_value", 
               "source_unit", 
               "compliance_type", 
               "compliance_value", 
               "compliance_unit"].indexOf(column.name) == -1) {
            // Column name is none of the above
            // then append the header if it's shown
            if (column.show) {
               row = row + column.label + ',';
            }
         } else {
            // Column name is one of the above, they are required to come in order
            // A hacky way to build the "source", or "compliance" column header
            if (column.name == "source_type") {
               row = row + "SO";
            } 
            else if (column.name == "source_value") {
               row = row + "UR";
            }
            else if (column.name == "source_unit") {
               row = row + "CE,";
            }
            else if (column.name == "compliance_type") {
               row = row + "COM";
            }
            else if (column.name == "compliance_value") {
               row = row + "PLIA";
            }
            else if (column.name == "compliance_unit") {
               row = row + "NCE,";
            }
         }
      }// end looping all the configs.columns
      
      var registers = configs.registers;
      if (registers) {
         for (var i=0; i<registers.length; i++) {
            var register = registers[i];
            row = row + register.label + ',';
         }
      }
      
      row = row + '\n';
      return row;
   };
   
   var writeTestItemRow = function(item, configs) {
      var row = "";
      row = row + item.test_number + ',';
      var columns = configs.columns;
      for (var i=0; i<columns.length; i++) {
         var column = columns[i];
         if ([ "source_type", 
               "source_value", 
               "source_unit", 
               "compliance_type", 
               "compliance_value", 
               "compliance_unit"].indexOf(column.name) == -1) {
            // Column name is none of the above
            // then append the header if it's shown
            if (column.show) {
               row = row + item[column.name] + ',';
            }
         } else {
            // Column name is one of the above, they are required to come in order
            // A hacky way to build the "source", or "compliance" column header
            if (column.name == "source_type") {
               row = row + item[column.name]+'(';
            } 
            else if (column.name == "source_value") {
               row = row + item[column.name]+" ";
            }
            else if (column.name == "source_unit") {
               row = row + item[column.name]+'),';
            }
            else if (column.name == "compliance_type") {
               row = row + item[column.name]+'(';
            }
            else if (column.name == "compliance_value") {
               row = row + item[column.name]+" ";
            }
            else if (column.name == "compliance_unit") {
               row = row + item[column.name]+'),';
            }
         }
      }// end looping all the configs.columns
      
      var registers = configs.registers;
      if (registers) {
         for (var i=0; i<registers.length; i++) {
            var register = registers[i];
            row = row + item[register.label] + ',';
         }
      }
      
      row = row + '\n';
      return row;
      
   }