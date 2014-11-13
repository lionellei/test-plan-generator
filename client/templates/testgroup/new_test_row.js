if (Meteor.isClient) {
    Template.new_test_row.events({
       "keyup .test_item_input": function (event, template) {
           //console.log(event.target.name);
           if (event.keyCode == 13) {
               /*
               var test_item = {};
               test_item[event.target.name]=event.target.value;
               _id = Testitems.insert(test_item);
               test_item = Testitems.findOne(_id);
               console.log(test_item); */
               //console.log(event);
               console.log(template);
               console.log(template.firstNode.children);
               cells = template.firstNode.children;
               for (var i = 0; i < cells.length; i++) {
                   console.log(cells[i].firstChild.value);
               }
           }
       } 
    });
}