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
           var testgroupId = Testgroups.findOne({chipName:chipName, name:testgroupName})._id;


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
           Testsetups.insert(setup);
       }
   } 

});