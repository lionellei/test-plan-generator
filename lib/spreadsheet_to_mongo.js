//******************* PADS **********************************//

// These codes from meteor-spreadsheet-to-mongo package
// Had to be available from both client and server
var padsFormOptions = {
    // Set a name for this specific "spreadsheet"
    formName: 'padsInputForm',
    // Pass the collection in which you want to store the data inside
    // Note! This collection has to be defined by you!
    collection: Pads,
    saveToDB: true,
    fields: [
       {
           // Pad number
           name: 'number',
           idpart: true,
           // What kind of data should be stored? Currently 'number', 'date' and 'array' are supported.
           // (All other fields will be saved as strings.)
           // type: 'number',
           required: false
           //defaultValue: '2014-01-01'
       },
       { name: 'name', idpart: false, required: false },
       { name: 'type', idpart: false, required: false }
    ]
};

// Callbacks
// Transform the data before inserting into mongo
padsFormOptions.saveCallback = function ( input ) {
    //console.log(input);
    input = _(input).filter(function (spreadsheetRow) {
        //console.log(spreadsheetRow);
        return (spreadsheetRow["number"] != "" && spreadsheetRow["name"] && spreadsheetRow["type"]);
    }).map( function( spreadsheetRow ) {
        // A hacky way to let spreadsheet-to-mongo package call back to know the chipName
        // via Session variable.
        //console.log(spreadsheetRow);
        spreadsheetRow.chipName = Session.get('currentChipName');
        return spreadsheetRow;
    });

    // Remove existing pads if the input is not empty
    if (input.length > 0) {
        var ids = Pads.find({chipName:Session.get('currentChipName')}).fetch().map(function (doc) {
            return doc._id;
        });
        Meteor.call('removeSelectedPads', ids);
    }

    //console.log(input);
    // You must always return the data you've modified
    return input;
};

// Add the form!
SpreadsheetToMongoDB.addForm( padsFormOptions );






//******************* REGISTERS **********************************//

// These codes from meteor-spreadsheet-to-mongo package
// Had to be available from both client and server
var registersFormOptions = {
    // Set a name for this specific "spreadsheet"
    formName: 'registersInputForm',
    // Pass the collection in which you want to store the data inside
    // Note! This collection has to be defined by you!
    collection: Registers,

    fields: [
       { name: 'control_name', idpart: true, required: false },
       { name: 'size', idpart: false, required: false },
       { name: 'description', idpart: false, required: false }
    ]
};

// Callbacks
// Transform the data before inserting into mongo
registersFormOptions.saveCallback = function ( input ) {
    input = _(input).filter(function (spreadsheetRow) {
        //console.log(spreadsheetRow);
        return (spreadsheetRow["control_name"] && spreadsheetRow["size"] && spreadsheetRow["description"]);
    }).map( function( spreadsheetRow ) {
        // A hacky way to let spreadsheet-to-mongo package call back to know the chipName
        // via Session variable.
        spreadsheetRow.chipName = Session.get('currentChipName');
        return spreadsheetRow;
    });

    // Remove existing pads if the input is not empty
    if (input.length > 0) {
        var ids = Registers.find({chipName:Session.get('currentChipName')}).fetch().map(function (doc) {
            return doc._id;
        });
        Meteor.call('removeSelectedRegisters', ids);
    }
    // You must always return the data you've modified
    return input;
};

// Add the form!
SpreadsheetToMongoDB.addForm( registersFormOptions );