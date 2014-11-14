if (Meteor.isClient) {
    Template.new_test_row.events({

       "keyup .test_item_input": function (event, template) {
            // Detect the "enter" key, via keyCode==13, for any of the input tag
            // in the new_test_row
           if (event.keyCode == 13) {
               //console.log(event);
               //console.log(template);
               //console.log(template.firstNode.children);
               
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
               Testitems.insert(test_item);
           }
       } 

    });
}