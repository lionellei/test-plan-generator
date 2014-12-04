
Template.new_test_row.events({

   "keyup .test_item_input": function (event, template) {
        // Detect the "enter" key, via keyCode==13, for any of the input tag
        // in the new_test_row
       if (event.keyCode == 13) {
           //console.log(event);
           //console.log(template);
           //console.log(template.firstNode.children);
           var chipName = template.data.matcher._selector.chipName;
           var testgroupName = template.data.matcher._selector.testgroupName;
           var revision = template.data.matcher._selector.revision;
           var testgroupId = Testgroups.findOne({chipName:chipName, 
                                                name:testgroupName,
                                                revision:revision})._id;


           var test_item = {}; // Declare the test_item as dictionary
           cells = template.firstNode.children; // template.firstNode=<tr> its childrens are all the <td> tags
           
           // Loop through the <td> tags to set the attributes of the test_item, 
           // the first one is the test number which is managed by the program.
           for (var i = 1; i < cells.length; i++) {
               var key = cells[i].firstElementChild.name;
               var value = cells[i].firstElementChild.value;
               test_item[key] = value;
               cells[i].firstElementChild.value = ""; // clear the field
           }
           test_item["testgroupId"] = testgroupId;
           test_item["testgroupName"] = testgroupName;
           test_item["chipName"] = chipName;
           test_item["revision"] = revision;
           Testitems.insert(test_item);
       }
   } 

});

Template.new_test_row.helpers({
    "log": function () {
        console.log(findCurrentTestgroup(this));
    },

    /*
    // Autocomplete settings.
    "settings": function () {
        return {
            position: "top",
            limit: 5,
            rules: [
             {
               collection: Pads,
               field: "name",
               options: 'i', //case insensitive
               matchAll: true,
               filter: { chipName: this.matcher._selector.chipName },
               template: Template.padAutoCompleteTemplate
             }
            ]
        }        
    },*/

    // Create the attributes for each cell in the testitem row:
    "cellAttributes": function(cell_name, object_id) {
        //console.log("test item field is"+cell_name);
        var bgClass = "";
        switch (cell_name) {
            case "source_type":
            case "source_value":
            case "source_unit":
                bgClass = "bg-success";
                break;
            case "compliance_type":
            case "compliance_value":
            case "compliance_unit":
                bgClass = "bg-warning";
                break;
            case "measure_type":
            case "measure_min":
            case "measure_typ":
            case "measure_max":
            case "measure_unit":
                bgClass = "bg-info";
                break;
            default :
                bgClass = "bg-default";
                break;
        }
        return {
            class: "editable text-center " + bgClass,
            id: cell_name + '+' + object_id
        };
    },

    "headerColumns": function () {
        // console.log(this);
        var chipName = this.matcher._selector.chipName;
        var testgroup = findCurrentTestgroup(this);

        if (testgroup) {
            var columns = TestHeaderConfigs.findOne({testgroup_id: testgroup._id}).columns;
        }

        var modifiedActiveColumns = [];

        if (columns) {
            var activeColumns = columns.filter(function(column) {
                if (column.show) {
                    return true;
                } else {
                    return false;
                }
            });

            // attach chipName to each items in the array, to be used by the sub templates.
            modifiedActiveColumns = activeColumns.map(function(column) {
                column["chipName"] = chipName;
                // console.log(column);
                return column;
            });
        }

        return modifiedActiveColumns;
    },
    
    "headerRegisters": function () {
        // console.log(this);
        var chipName = this.matcher._selector.chipName;
        var testgroup = findCurrentTestgroup(this);

        if (testgroup) {
            var registers = TestHeaderConfigs.findOne({testgroup_id: testgroup._id}).registers;
        }

        // Always show all registers.
        var modifiedActiveColumns = [];

        if (registers) {
            // attach chipName to each items in the array, to be used by the sub templates.
            modifiedActiveColumns = registers.map(function(column) {
                column["chipName"] = chipName;
                // console.log(column);
                return column;
            });
        }

        return modifiedActiveColumns;
    }
});

/// ****************** Partials *****************************///
Template.inputCell.helpers({
    "log": function () {
        console.log(this);
    },

    "useSelectBox": function() {
        if (this.allowed_value.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    "selectOptions": function() {
        if (this.allowed_value.length > 0) {
            return this.allowed_value.split(',');
        } else {
            return [];
        }
    },

    "settings": function () {
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    collection: Pads,
                    field: "name",
                    options: 'i', //case insensitive
                    matchAll: true,
                    filter: { chipName: this.chipName },
                    template: Template.padAutoCompleteTemplate
                }
            ]
        }
    },

    "padsAutoComplete": function () {
        if (this.name == "pad" || this.name == "pad2") {
            return true;
        } else {
            return false;
        }
    }
});

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