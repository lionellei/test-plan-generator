// These codes from meteor-spreadsheet-to-mongo package
// Had to be available from both client and server
var padsFormOptions = {
    // Set a name for this specific "spreadsheet"
    formName: 'padsInputForm',
    // Pass the collection in which you want to store the data inside
    // Note! This collection has to be defined by you!
    collection: Pads,

    fields: [
       {
           // Pad number
           name: 'number',
           idpart: false,
           // What kind of data should be stored? Currently 'number', 'date' and 'array' are supported.
           // (All other fields will be saved as strings.)
           // type: 'number',
           required: true
           //defaultValue: '2014-01-01'
       },
       { name: 'name', idpart: false, required: true },
       { name: 'type', idpart: false, required: true}
    ]
};

// Add the form!
SpreadsheetToMongoDB.addForm( padsFormOptions );

// Callbacks
// Transform the data before inserting into mongo
padsFormOptions.saveCallback = function ( input ) {
    input = _(input).map( function( spreadsheetRow ) {
        // A hacky way to let spreadsheet-to-mongo package call back to know the chipName
        // via Session variable.
        spreadsheetRow.chipName = Session.get('currentChipName');
        return spreadsheetRow;
    });
    // You must always return the data you've modified
    return input;
};