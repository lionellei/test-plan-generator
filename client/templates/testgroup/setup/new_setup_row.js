Template.new_setup_row.events({

   "keyup .setup_item_input": function (event, template) {
        // Detect the "enter" key, via keyCode==13, for any of the input tag
        // in the new_test_row
       if (event.keyCode == 13) {
           //console.log(event);
           //console.log(template);
           //console.log(template.firstNode.children);
           var chipName = template.data.matcher._selector.chipName;
           var testgroupName = template.data.matcher._selector.testgroupName;
           var revision = template.data.matcher._selector.revision
           var testgroupId = Testgroups.findOne({   chipName:chipName, 
                                                    name:testgroupName,
                                                    revision:revision})._id;


           var setup = {}; // Declare the setup as dictionary
           cells = template.firstNode.children; // template.firstNode=<tr> its childrens are all the <td> tags
           

           for (var i = 0; i < cells.length; i++) {
               var key = cells[i].firstElementChild.name;
               var value = cells[i].firstElementChild.value;
               setup[key] = value;
               cells[i].firstElementChild.value = ""; // clear the field
           }
           setup["testgroup_id"] = testgroupId;
           setup["testgroup_name"] = testgroupName;
           setup["chipName"] = chipName;
           setup["revision"] = revision;
           Testsetups.insert(setup);
       }
   } 

});

Template.new_setup_row.helpers({
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
    }
});
