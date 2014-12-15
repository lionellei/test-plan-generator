deleteTestPlan = function (testplan) {
    if (!(testplan.revision == 0 && Testplans.find({chipName:testplan.chipName}).fetch().length > 1)) {
        // Delete all testgroups
        var testgroups = Testgroups.find({testplanId:testplan._id}).fetch();
        for (var i=0; i<testgroups.length; i++) {
            deleteTestGroup(testgroups[i]);
        }

        // Delete the testplan itself
        Testplans.remove(testplan._id);
    }
};