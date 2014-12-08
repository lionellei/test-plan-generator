Meteor.publish("testplans", function() {
    return Testplans.find();
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

Meteor.publish("setups", function(chipName, testgroupName, revision) {
    return Testsetups.find({
        chipName:chipName,
        testgroup_name:testgroupName,
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