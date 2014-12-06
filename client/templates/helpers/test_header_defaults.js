testHeaderDefaults = {
    columns: [
        {name: "vector_number", label: "Vector", allowed_value:"", show:false, custom:false},
        {name: "order", label: "Order", allowed_value:"", show:true, custom:false},
        {name: "pad", label: "Pad", allowed_value:"", show: true, custom:false},
        {name: "pad2", label: "Pad2", allowed_value:"", show: false, custom:false}, // For resistance tests that involves two pads.
        {name: "source_type", label:"Source", allowed_value:"V,I", show: true, custom:false},
        {name: "source_value", label:"Value", allowed_value:"", show: true, custom:false},
        {name: "source_unit", label:"Unit", allowed_value:"", show: true, custom:false},
        {name: "compliance_type", label:"Compliance", allowed_value:"V,I", show: true, custom:false},
        {name: "compliance_value", label:"Value", allowed_value:"", show:true, custom:false},
        {name: "compliance_unit", label:"Unit", allowed_value:"", show:true, custom:false},
        {name: "measure_type", label:"Measure", allowed_value:"", show:true, custom:false},
        {name: "marker", label:"Marker", allowed_value:"", show:false, custom:false},
        {name: "calculate", label:"Calculate", allowed_value:"", show:false, custom:false}, // For calculation based on other measurements.
        {name: "measure_min", label:"MIN", allowed_value:"", show:true, custom:false},
        {name: "measure_typ", label:"TYP", allowed_value:"", show:true, custom:false},
        {name: "measure_max", label:"MAX", allowed_value:"", show:true, custom:false},
        {name: "measure_unit", label:"Unit", allowed_value:"", show:true, custom:false}
    ]
};