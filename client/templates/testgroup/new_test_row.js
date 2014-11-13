if (Meteor.isClient) {
    Template.new_test_row.events({
       "keyup .input-sm input": function (event, template) {
           console.log("key up detected");
           //console.log(event.name);
       } 
    });
}