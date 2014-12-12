Notes = new Mongo.Collection('notes');

Notes.allow({
    insert: function (userId, document) {
        return !!userId;
    }, 
    
    remove: function (userId, document) {
        return !!userId;
    }
});

// Althernatively, could call these Meteor methods from client.
Meteor.methods({
    "notesUpdate": function (note_id, note) {
        if (Meteor.user()) {
            return Notes.update(note_id, note);
        } else {
            return new Meteor.Error("logged-out", "The user must be logged in to update note");
        }
    },
    
    /*
    "notesInsert": function(chipName, testgroupName, testgroupId, revision, note_text) {
        if (Meteor.user()) {
            var note = {chipName:chipName,
                        testgroupName:testgroupName,
                        testgroupId:testgroupId,
                        revision:revision,
                        note_text:note_text};
            return Notes.insert(note); // Return the note's _id
        } else {
            return new Meteor.Error("logged-out", "The user must be logged in to add note");
        }
    }, 
    
    "notesRemove": function (note_id) {
        if (Meteor.user()) {
            return Notes.remove(note_id);
        } else {
            return new Meteor.Error("logged-out", "The user must be logged in to update note");
        }
    } */
});
