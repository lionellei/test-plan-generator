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

/* // was in new_test_row.html, was replaced with a #each loop
 <!--
 <td class="text-center">{{> inputAutocomplete name="pad" settings=settings class="input-sm test_item_input" placeholder="Pad Name"}}</td>
 <td class="bg-success">
 <select name="source_type" class="form-control">
 <option></option>
 <option>V</option>
 <option>I</option>
 </select>
 </td>
 <td class="bg-success"><input name="source_value" class="input-sm test_item_input" type="text"/></td>
 <td class="bg-success"><input name="source_unit" class="input-sm test_item_input" type="text"/></td>
 <td class="bg-warning">
 <select name="compliance_type" class="form-control">
 <option></option>
 <option>V</option>
 <option>I</option>
 </select>
 </td>
 <td class="bg-warning"><input name="compliance_value" class="input-sm test_item_input" type="text"/></td>
 <td class="bg-warning"><input name="compliance_unit" class="input-sm test_item_input" type="text"/></td>
 <td class="bg-info">
 <select name="measure_type" class="form-control">
 <option></option>
 <option>V</option>
 <option>I</option>
 </select>
 </td>
 <td class="bg-info"><input name="measure_min" class="input-sm test_item_input" type="text"/></td>
 <td class="bg-info"><input name="measure_typ" class="input-sm test_item_input" type="text"/></td>
 <td class="bg-info"><input name="measure_max" class="input-sm test_item_input" type="text"/></td>
 <td class="bg-info"><input name="measure_unit" class="input-sm test_item_input" type="text"/></td>
 -->
 */
 
 /* // from testgroup.html
                 <!-- This is an example row, only show when table is empty 
                {{#if showExampleRow}}
                    <tr>
                        <td class="text-center">Example</td>
                        <td class="text-center">CATHODE</td>
                        <td class="text-center bg-success">I</td>
                        <td class="text-center bg-success">1</td>
                        <td class="text-center bg-success">mA</td>
                        <td class="text-center bg-warning">V</td>
                        <td class="text-center bg-warning">3</td>
                        <td class="text-center bg-warning">V</td>
                        <td class="text-center bg-info">V</td>
                        <td class="text-center bg-info">1.5</td>
                        <td class="text-center bg-info">1.75</td>
                        <td class="text-center bg-info">2</td>
                        <td class="text-center bg-info">V</td>
                        <td><span class="glyphicon glyphicon-info-sign example-info"></span></td>
                    </tr>
                {{/if}} -->
*/