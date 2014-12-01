//TODO: All the codes here need to be removed or accessed control (checking currentUser) in production!!
Meteor.methods({
    removeAllTestItems: function () {
        Testitems.remove({});
    }, 
    
    // Called from footer.js, pass in the _ids of the object to be deleted.
    removeSelectedTestItems: function (ids) {
        if (ids.length > 0) {
            Testitems.remove({_id: {$in: ids}});
        }
    },
    
    removeAllTestNotes: function() {
        Notes.remove({});
    },
    
    removeSelectedTestSetups: function (ids) {
        if (ids.length > 0) {
            Testsetups.remove({_id: {$in: ids}});
        }
    },
    
    removeSelectedTestNotes: function (ids) {
        if (ids.length > 0) {
            Notes.remove({_id: {$in: ids}});
        }
    },
    
    removeSelectedTesHeaderConfigs: function (ids) {
        if (ids.length > 0) {
            TestHeaderConfigs.remove({_id: {$in: ids}});
        }
    }
});

