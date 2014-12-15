deleteTestGroup = function (testgroup) {
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
};