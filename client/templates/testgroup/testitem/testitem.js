Template.testitem.events({

    // Delete Row
    "click .delete-row": function(event, template) {
        // Template.data is the data context of the current template,
        // it has the _id of the object.
        var r = confirm("Deleting this row! Are you sure?");
        if (r == true) {
            Testitems.remove(template.data._id);
        }
    },

    // Make the current row a prototype for the entire Pads list
    "click .prototype-button": function(event, template) {
        var r = confirm("Copy this test to all pads? This will overwrite existing entries!");
        if (r == true) {
            // TODO: Need to check if there is Pads list first!!

            var prototype_row_id = template.data._id;
            var prototype_test = Testitems.findOne(prototype_row_id);
            var pads = Pads.find().fetch();

            // TODO: Make it smarter without removing entire collection first.
            Meteor.call('removeAllTestItems'); // temporary solution is to remove entire collection and then recreate it.

            // Loops through all the pads copy the prototype test's value, except the pad name.
            for (var i = 0; i < pads.length; i++) {
                pad = pads[i];
                var test_item = {
                    "pin": pad.name,
                    "resource": prototype_test.resource,
                    "source_type": prototype_test.source_type,
                    "source_value": prototype_test.source_value,
                    "source_unit": prototype_test.source_unit,
                    "compliance_type": prototype_test.compliance_type,
                    "compliance_value": prototype_test.compliance_value,
                    "compliance_unit": prototype_test.compliance_unit,
                    "measure_type": prototype_test.measure_type,
                    "measure_min": prototype_test.measure_min,
                    "measure_typ": prototype_test.measure_typ,
                    "measure_max": prototype_test.measure_max,
                    "measure_unit": prototype_test.measure_unit
                };
                Testitems.insert(test_item);
            }

        }
    }
});

Meteor.methods({
    removeAllTestItems: function () {
        Testitems.remove({});
    }
});