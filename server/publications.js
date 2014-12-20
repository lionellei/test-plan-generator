Meteor.publish("testplans", function() {
    return Testplans.find();
});

Meteor.publish("currentTestplan", function(chipName, revision) {
    return Testplans.find({chipName:chipName, revision:revision});
});

Meteor.publish("pads", function(chipName) {
    return Pads.find({chipName:chipName});
});

Meteor.publish("registers", function(chipName) {
    return Registers.find({chipName:chipName});
});

Meteor.publish("testgroups", function(chipName, revision) {
    return Testgroups.find({chipName:chipName, revision:revision});
});

Meteor.publish("currentTestGroup", function (chipName, testgroupName, revision) {
    return Testgroups.find({
        chipName:chipName,
        name:testgroupName,
        revision:revision
    });
});

Meteor.publish("setups", function(chipName, testgroupName, revision) {
    return Testsetups.find({
        chipName:chipName,
        testgroup_name:testgroupName,
        revision:revision
    });
});

Meteor.publish("setupsForWholeTestplan", function(chipName, revision) {
    return Testsetups.find({
        chipName:chipName,
        revision:revision
    });
});

Meteor.publish("notes", function(chipName, testgroupName, revision) {
    return Notes.find({
        chipName:chipName,
        testgroupName:testgroupName,
        revision:revision
    });
});

Meteor.publish("notesForWholeTestplan", function(chipName, revision) {
    return Notes.find({
        chipName:chipName,
        revision:revision
    });
});

Meteor.publish("testHeaderConfigs", function (chipName, testgroup_name, revision) {
    return TestHeaderConfigs.find({
        chipName: chipName,
        testgroup_name:testgroup_name,
        revision: revision
    });
});

Meteor.publish("testHeaderConfigsForWholeTestplan", function (chipName, revision) {
    // Need this publication for "release" in testplan level.
    return TestHeaderConfigs.find({
        chipName: chipName,
        revision: revision
    });
});

Meteor.publish("testitems", function (chipName, testgroupName, revision) {
    return Testitems.find({
        chipName:chipName,
        testgroupName:testgroupName,
        revision:revision
    });
});

Meteor.publish("testitemsForWholeTestplan", function (chipName, revision) {
    return Testitems.find({
        chipName:chipName,
        revision:revision
    });
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find();
  } else {
    this.ready();
  }
});
                                