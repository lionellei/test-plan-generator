//TODO: All the codes here need to be removed or accessed control (checking currentUser) in production!!
Meteor.methods({
    removeAllTestItems: function () {
        if (!!Meteor.user()) {
            Testitems.remove({});
        }
    }, 
    
    // Called from footer.js, pass in the _ids of the object to be deleted.
    removeSelectedTestItems: function (ids) {
        if (ids.length > 0) {
            if (!!Meteor.user()) {
                Testitems.remove({_id: {$in: ids}});
            }
        }
    },
    
    removeAllTestNotes: function() {
        if (!!Meteor.user()) {
            Notes.remove({});
        }
    },
    
    removeSelectedTestSetups: function (ids) {
        if (ids.length > 0) {
            if (!!Meteor.user()) {
                Testsetups.remove({_id: {$in: ids}});
            }
        }
    },
    
    removeSelectedTestNotes: function (ids) {
        if (ids.length > 0) {
            if (!!Meteor.user()) {
                Notes.remove({_id: {$in: ids}});
            }
        }
    },
    
    removeSelectedTesHeaderConfigs: function (ids) {
        if (ids.length > 0) {
            if (!!Meteor.user()) {
                TestHeaderConfigs.remove({_id: {$in: ids}});
            }
        }
    },

    removeSelectedPads: function (ids) {
        if (ids.length > 0) {
            if (!!Meteor.user()) {
                Pads.remove({_id: {$in: ids}});
            }
        }
    },

    removeSelectedRegisters: function (ids) {
        if (ids.length > 0) {
            if (!!Meteor.user()) {
                Registers.remove({_id: {$in: ids}});
            }
        }
    }
});

