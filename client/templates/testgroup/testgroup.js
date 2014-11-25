Template.testgroup.helpers({
    "log": function() {
        console.log(this.matcher._selector);
    },

   "showExampleRow": function() {
       return !!!(Testitems.find({chipName:this.matcher._selector.chipName, testgroupName:this.matcher._selector.testgroupName}).count() > 0);
   },

    "setups": function() {
        //TODO: figure out a way to return the testsetup by testgroup_id, it is done this way now because the route path
        //      has :chipName and :testgroupName.
        return Testsetups.find({
            chipName:this.matcher._selector.chipName,
            testgroup_name: this.matcher._selector.testgroupName
        });
    },
    
    // if the users check the rows one by one, the select-all checkbox should be checked
    // if all rows are selected.
    "allRowsSelected": function () {
        //console(this.fetch());
        //TODO: may not be robust
        if (Session.get('selectedRowsIds')) {
            if (this.fetch().length == Session.get('selectedRowsIds').length) {
                return true;
            } else {
                return false;
            } 
        } else {
            return false;
        }
    },
    
    // Return all the notes collection
    "notes": function () {
        var testgroup = Testgroups.findOne({chipName:this.matcher._selector.chipName, name:this.matcher._selector.testgroupName});
        return Notes.find({testgroupId:testgroup._id});
    }

});

Template.testgroup.events({
    // Do not use change for this event, because the checkbox could be checked programmatically
    // if all rows are checked one-by-one.
    "click .select-all-rows": function(event, template) {
        if (event.currentTarget.checked) {
            Session.set('selectedRowsIds', this.fetch().map(function(test){return test._id}));
        } else {
            Session.set('selectedRowsIds', []);
        }
    },
    
   "click .example-info": function(){
       alert("This is just an example row.");
   },

   // Export the test plan to csv file.
   "click .export-button": function(event, template){
      // console.log("export button clicked");
      var testItems = this.fetch(); // this is the data that passed by the router.
      var testsetups = Testsetups.find({
            chipName:this.matcher._selector.chipName,
            testgroup_name: this.matcher._selector.testgroupName
        }).fetch();
      
      var data = ""; // use a string to form the CSV file
      
      // Title row:
      var title = testItems[0].chipName + ' ' + testItems[0].testgroupName + '\n' + '\n';
      data = data + title;
      
      // Test setup
      // Hardcode for now, TODO: make it programatically
      var setupHeader = "Setup" + '\n' + "Pad,Source,Unit" + '\n';
      data = data + setupHeader;
      var setupRows = "";
      for (var i=0; i<testsetups.length; i++) {
          setup = testsetups[i];
          setupRow = setup.pad + ',' + setup.source_value + ',' + setup.source_unit + '\n';
          setupRows = setupRows + setupRow;
      }
      data = data + setupRows;
      
      // Header row:
      var header = "Tests" + '\n' + "Pad,Source,Compliance,Measure,MIN,TYP,MAX,UNIT" + '\n';
      data = data + header;
      
      var measLabelPrefix = this.matcher._selector.testgroupName.substring(0,4);
      for (var i=0; i<testItems.length; i++) {
         item = testItems[i];
         var row = item.pad + ',' + item.source_type+"src="+item.source_value+item.source_unit+','
                  + item.compliance_type+"cmp="+item.compliance_value+item.compliance_unit + ','
                  + measLabelPrefix+" "+item.pad+" ("+item.source_type+"src="+item.source_value+' '+item.source_unit+')' + ','
                  + item.measure_min + ',' + item.measure_typ + ',' + item.measure_max + ',' + item.measure_unit 
                  + '\n' ;
         data = data + row;
      }
      
      var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      var fileName = this.matcher._selector.chipName+"_"+this.matcher._selector.testgroupName+".csv";
      saveAs(blob, fileName); 
   }
});


///////////////////// Partials within this template //////////////////////////
Template.addNoteModal.events({
    // Only capture submit button click, don't handle the keyup "enter" case since it's a textarea.
    "click .note-submit-button": function(event, template) {
        var testgroup = Testgroups.findOne({chipName:this.matcher._selector.chipName, name:this.matcher._selector.testgroupName});
        var note = {chipName:testgroup.chipName,
                    testgroupName:testgroup.name,
                    testgroupId:testgroup._id,
                    note_text:event.currentTarget.value};
        Notes.insert(note);        
    }
});
