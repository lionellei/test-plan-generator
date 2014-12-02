// Generate a unique ID for arbitrary object, such as those embedded in a mongo document:
// "_id": new Meteor.Collection.ObjectID()._str // Generate a unique ID so it could be updated in template

// Filtering array
/*
homes.filter(function (el) {
  return el.price <= 1000 &&
         el.sqft >= 500 &&
         el.num_of_beds >=2 &&
         el.num_of_baths >= 2.5;
});
*/

/*
 // template instance can be accessed with `UI._templateInstance()`
*/