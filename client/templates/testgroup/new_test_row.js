if (Meteor.isClient) {
    Template.new_test_row.events({
        /*
       "keyup .input-sm-action input": function (event, template) {
           alert("key up detected!");
           console.log("key up detected");
           //console.log(event.name);
       } */

       "keyup .input-sm :input": function(){
           alert("you typed.");
       }
    });
}