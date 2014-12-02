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

/* // Was used in testitem.html before replaced with a #each loop.
 <!--
 <td {{cellAttributes "pad"}}>
 <span>
 {{> editable_cell revision=this.revision value=pad cell_name="pad" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "source_type"}}>
 <span>
 {{> editable_cell revision=this.revision value=source_type cell_name="source_type" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "source_value"}}>
 <span>
 {{> editable_cell revision=this.revision value=source_value cell_name="source_value" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "source_unit"}}>
 <span>
 {{> editable_cell revision=this.revision value=source_unit cell_name="source_unit" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "compliance_type"}}>
 <span>
 {{> editable_cell revision=this.revision value=compliance_type cell_name="compliance_type" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "compliance_value"}}>
 <span>
 {{> editable_cell revision=this.revision value=compliance_value cell_name="compliance_value" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "compliance_unit"}}>
 <span>
 {{> editable_cell revision=this.revision value=compliance_unit cell_name="compliance_unit" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "measure_type"}}>
 <span>
 {{> editable_cell revision=this.revision value=measure_type cell_name="measure_type" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "measure_min"}}>
 <span>
 {{> editable_cell revision=this.revision value=measure_min cell_name="measure_min" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "measure_typ"}}>
 <span>
 {{> editable_cell revision=this.revision value=measure_typ cell_name="measure_typ" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "measure_max"}}>
 <span>
 {{> editable_cell revision=this.revision value=measure_max cell_name="measure_max" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td>
 <td {{cellAttributes "measure_unit"}}>
 <span>
 {{> editable_cell revision=this.revision value=measure_unit cell_name="measure_unit" object_id=this._id collection="Testitems" chipName=this.chipName}}
 </span>
 </td> -->
 */