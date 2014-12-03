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
            if ((this.fetch().length == Session.get('selectedRowsIds').length) && (Session.get('selectedRowsIds').length>0)) {
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
    },

    "editable": function() {
        if (this.matcher._selector.revision == 0) {
            return true;
        } else {
            return false;
        }
    },

    "testHeaders": function () {
        var testgroup = findCurrentTestgroup(this);
        return TestHeaderConfigs.findOne({testgroup_id:testgroup._id, testgroup_name:testgroup.name}).columns;
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
      var testgroup = findCurrentTestgroup(this);
      
      var data = exportTestgroup(testgroup);
      
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
            
            // Remove test header configs:
            var testHeaderConfigsIds = TestHeaderConfigs.find({testgroup_id:testgroup._id}).fetch().map(function (item) {
                return item._id;
            });
            Meteor.call('removeSelectedTesHeaderConfigs', testHeaderConfigsIds);
            
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


////////////////////////////////////////////////////////////////////////////////
///////////////////// Partials within this template ////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//// ***************************************************************************
Template.addNoteModal.events({
    // Only capture submit button click, don't handle the keyup "enter" case since it's a textarea.
    "click .note-submit-button": function(event, template) {
        //console.log(template.find(".note-textarea").value);
        //console.log(this.currentTestgroup);
        if (template.find(".note-textarea").value != "") {
            var note = {chipName:this.currentTestgroup.chipName,
                testgroupName:this.currentTestgroup.name,
                testgroupId:this.currentTestgroup._id,
                revision:this.currentTestgroup.revision,
                note_text:template.find(".note-textarea").value};
            Notes.insert(note);
            template.find(".note-textarea").value = "";
        }
        $('.add-note-modal').modal('hide');
    }
});
//// ***************************************************************************

//// ###########################################################################
Template.headerConfigModal.events({
    "click .header-config-submit-button": function (event, template) {
        // After submit, update the columns of the test configs to match the Session variable.
        var testgroup = findCurrentTestgroup(this);
        var headerConfigs = TestHeaderConfigs.findOne({testgroup_id: testgroup._id});
        TestHeaderConfigs.update(headerConfigs._id, {$set: {columns:Session.get('headerColumns')}});
        $('.header-config-modal').modal('hide');
    },

    "click .test-header-add-btn": function (event, template) {

        //TODO: warn empty inputs:
        var columns = Session.get('headerColumns');
        var newColumn = {
            name: $('.test_header_name_input')[0].value,
            label: $('.test_header_label_input')[0].value,
            allowed_value: $('.test_header_allowed_value_input')[0].value,
            show: true,
            custom: true
        };
        columns.push(newColumn);
        Session.set('headerColumns', columns);
    }
});

Template.headerConfigModal.helpers({
    "log": function () {
        console.log(this);
    },

    "initializeBootstrapTooltip": function () {
        //console.log("initializ tooltip");
        $('[data-toggle="tooltip"]').tooltip();
    },

    "initializeHeaderSession": function () {
        var testgroup = findCurrentTestgroup(this);
        var testHeaderConfigs = TestHeaderConfigs.findOne({testgroup_id:testgroup._id, testgroup_name:testgroup.name});
        Session.set('headerColumns', testHeaderConfigs.columns);
        Session.set('headerRegisters', testHeaderConfigs.registers);
    },
    
    "testHeaderConfigs": function () {
        return Session.get('headerColumns');
    }
});
//// ###########################################################################

//// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Template.testHeaderConfig.helpers({
    // TODO: programatically change the text color based on the checkbox status
    "headerCheckboxId": function () {
        return "test_header_"+this.name;    
    },
    
    "textClass": function () {
        if (this.show) {
            if (this.custom) { // Use green for user created custom header
                return "h4 text-success";
            } else { // use blue for system created non-custom header
                return "h4 text-primary";
            }
        } else {
            return "text-muted";
        }
    }
});

Template.testHeaderConfig.events({
    "change .test-header-checkbox": function (event, template) {
        //console.log(event.currentTarget.name);
        //console.log(event.currentTarget.id);
        //console.log(Session.get('headerColumns'));

        // All these just to change the item in an array.
        // TODO: make sure the "name" key is unique within this array.
        var columns = Session.get('headerColumns');
        var column = columns.filter(function(element) {
           if (element.name == event.currentTarget.name) {
               return true;
           } else {
               return false;
           }
        })[0];
        var columnIndex = columns.indexOf(column);
        if (columnIndex !== -1) {
            // toggle the "show" value.
            column.show = !column.show;
            columns[columnIndex] = column;
            Session.set('headerColumns', columns);
        }
    }
});
///// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

///// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
Template.addRegister.helpers({
       // Autocomplete settings
    "autocompleteSettings": function() {
        // console.log(this);
        return {
           position: "top",
           limit: 5,
           rules: [
             {
               collection: Registers,
               field: "control_name",
               options: 'i', //case insensitive
               matchAll: true,
               filter: {chipName: this.matcher._selector.chipName },
               template: Template.registerAutoCompleteTemplate
             }
           ]
        };
    }, 
    
    "headerRegisters": function() {
        if (Session.get('headerRegisters')) {
            return Session.get('headerRegisters');
        } else {
            return [];
        }
    }
});

Template.addRegister.events({
    "keyup .add-register-input": function (event, template) {
        if (event.keyCode == 13) {
            if (event.currentTarget.value != "") {
                var headerRegisters;
                if (Session.get('headerRegisters')) {
                    headerRegisters = Session.get('headerRegisters');
                } else {
                    headerRegisters = [];
                }
                
                // check duplicate entries
                var control_names = headerRegisters.map(function (reg) {
                    return reg.name;
                });
                if (control_names.indexOf(event.currentTarget.value) < 0) { // has not been added yet.
                    var register = {
                        //{name: "measure_unit", label:"Unit", allowed_value:"", show:true, custom:false}
                        name: event.currentTarget.value,
                        label: event.currentTarget.value,
                        allowed_value:"",
                        show: true,
                        custom: true
                    }
                    headerRegisters.push(register);
                    Session.set('headerRegisters', headerRegisters);
                }
            
                event.currentTarget.value = "";
            }           
        }
    },
    
    "click .delete-header-register-btn": function (event, template) {
        //console.log(event.currentTarget.name);
        var name = event.currentTarget.name;

        var registers = Session.get('headerRegisters');
        var regToRemove = registers.filter(function (reg) {
            return reg.name == name;
        })[0];
        if (registers.indexOf(regToRemove) > -1) {
            //console.log(registers.indexOf(regToRemove));
            registers.splice(registers.indexOf(regToRemove),1);
            Session.set('headerRegisters', registers);
        }

    }
});
///// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

////////////////////// Functions /////////////////////////////

// Only usable inside the testgroup template, the dataContext needs to be "this" of testgroup template.
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
