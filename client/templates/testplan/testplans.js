Template.testplans.helpers({
    "log": function () {
        console.log(this);
    },

    "chips": function() {
        // Seperate the testplans to be grouped by chip:
        // Using underscore.js _.uniq function. It's quadratic time, not efficient for large array.
        // TODO: improve above mentioned efficiency.
        var testplans = this.fetch();
        var chipNames = _.uniq(testplans.map(function(testplan){
            return testplan.chipName;
        }));

        var testplansGroupedbyChip = [];
        for (var i=0; i<chipNames.length; i++) {
            testplansGroupedbyChip.push({
                chipName: chipNames[i],
                versions: testplans.filter(function(plan){
                    return plan.chipName == chipNames[i];
                })
            });
        }

        return testplansGroupedbyChip;
    }
});