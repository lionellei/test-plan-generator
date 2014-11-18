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
           idpart: true,
           // What kind of data should be stored? Currently 'number', 'date' and 'array' are supported.
           // (All other fields will be saved as strings.)
           // type: 'number',
           required: true
           //defaultValue: '2014-01-01'
       },
       { name: 'name', idpart: true, required: true },
       { name: 'type', idpart: true, required: true}
    ]
};

// Add the form!
SpreadsheetToMongoDB.addForm( padsFormOptions );

// Callbacks:
padsFormOptions.saveCallback = function ( input ) {
    input = _(input).map( function( spreadsheetRow ) {
        // Math.floor the sum field
        spreadsheetRow.chipName = "qTIAX1B";
        return spreadsheetRow;
    });
    // You must always return the data you've modified
    return input;
};