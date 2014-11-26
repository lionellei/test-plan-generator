Template.testgroup.helpers({
    "log": function() {
        console.log(this.matcher._selector);
    },

   "showExampleRow": function() {
       return !!!(Testitems.find({chipName:this.matcher._selector.chipName, 
                                testgroupName:this.matcher._selector.testgroupName,
                                revision:Number(this.matcher._selector.revision)}).count() > 0);
   },

    "setups": function() {
        //TODO: figure out a way to return the testsetup by testgroup_id, it is done this way now because the route path
        //      has :chipName and :testgroupName.
        return Testsetups.find({
            chipName:this.matcher._selector.chipName,
            testgroup_name: this.matcher._selector.testgroupName,
            revision:Number(this.matcher._selector.revision)
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
        var testgroup = Testgroups.findOne({chipName:this.matcher._selector.chipName, 
                                            name:this.matcher._selector.testgroupName, 
                                            revision:Number(this.matcher._selector.revision)});
        if (testgroup) {
            return Notes.find({testgroupId:testgroup._id});
        } else {
            return [];
        }

    },

    "currentTestgroup": function() {
        var testgroup = Testgroups.findOne({chipName:this.matcher._selector.chipName, 
                                            name:this.matcher._selector.testgroupName,
                                            revision:Number(this.matcher._selector.revision)});
        if (testgroup) {
            return testgroup;
        } else {
            return null;
        }
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
            testgroup_name: this.matcher._selector.testgroupName,
            revision:Number(this.matcher._selector.revision)
        }).fetch();
      var testNotes = Notes.find({
            chipName:this.matcher._selector.chipName,
            testgroupName: this.matcher._selector.testgroupName,
            revision:Number(this.matcher._selector.revision)
        }).fetch();
      
      var data = ""; // use a string to form the CSV file
      
      // Title row:
      var title = this.matcher._selector.chipName + ' ' + this.matcher._selector.testgroupName + ' ' + 'Rev '+ this.matcher._selector.revision + '\n' + '\n';
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
      var fileName = this.matcher._selector.chipName+"_"+this.matcher._selector.testgroupName+"_Rev"+this.matcher._selector.revision+".csv";
      saveAs(blob, fileName); 
   },
   
    "click .delete-testgroup-button": function (template, event) {
        //TODO: use a confirmation text input instead of alert box to make it more fool proof.
        var r = confirm("All the data for "+this.matcher._selector.testgroupName+" will be ERASED permanently. Continue?");
        if (r) {
            var testgroup = findCurrentTestgroup(this);
            var testplan = Testplans.findOne(testgroup.testplanId);
            
            // Remove test notes:
            var testNoteIds = Notes.find({testgroup_id:testgroup._id}).fetch().map(function (item) {
                return item._id;
            });
            Meteor.call('removeSelectedTestNotes', testNoteIds);
            
            // Remove test setups:
            var testSetupIds = Testsetups.find({testgroup_id:testgroup._id}).fetch().map(function (item) {
                return item._id;
            });
            Meteor.call('removeSelectedTestSetups', testSetupIds);
            
            // Remove all tests:
            var testItemIds = Testitems.find({testgroupId: testgroup._id}).fetch().map(function (item) {
                return item._id;
            });
            Meteor.call('removeSelectedTestItems', testItemIds);
            
            // Remove the testgroup itself:
            Testgroups.remove(testgroup._id);
            
            // Route to Test plan page:
            Router.go('testplanPage', testplan);
            
        }
    }
});


///////////////////// Partials within this template //////////////////////////
Template.addNoteModal.events({
    // Only capture submit button click, don't handle the keyup "enter" case since it's a textarea.
    "click .note-submit-button": function(event, template) {
        //console.log(template.find(".note-textarea").value);
        //console.log(this.currentTestgroup);
        var note = {chipName:this.currentTestgroup.chipName,
                    testgroupName:this.currentTestgroup.name,
                    testgroupId:this.currentTestgroup._id,
                    revision:this.currentTestgroup.revision,
                    note_text:template.find(".note-textarea").value};
        Notes.insert(note);
        template.find(".note-textarea").value = "";
        $('.add-note-modal').modal('hide');
    }
});


////////////////////// Functions /////////////////////////////
var findCurrentTestgroup = function(dataContext) {
    var testgroup = Testgroups.findOne({chipName:dataContext.matcher._selector.chipName, 
                                        name:dataContext.matcher._selector.testgroupName,
                                        revision:Number(dataContext.matcher._selector.revision)
    });
    if (testgroup) {
        return testgroup;
    } else {
        return null;
    }
};
