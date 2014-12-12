Registers = new Mongo.Collection('registers');

Registers.allow({
    insert: function (userId, document) {
        return !!userId;
    },

    remove: function (userId, document) {
        return !!userId;
    },

    update: function (userId, doc, fieldNames, modifier) {
        return !!userId;
    }
});