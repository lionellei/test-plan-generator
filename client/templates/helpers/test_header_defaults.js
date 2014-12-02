testHeaderDefaults = {
    columns: [
        {name: "pad", label: "Pad", allowed_value:"", show: true},
        {name: "pad2", label: "Pad2", allowed_value:"", show: false}, // For resistance tests that involves two pads.
        {name: "source_type", label:"Source", allowed_value:"V,I", show: true},
        {name: "source_value", label:"Value", allowed_value:"", show: true},
        {name: "source_unit", label:"Unit", allowed_value:"", show: true},
        {name: "compliance_type", label:"Compliance", allowed_value:"V,I", show: true},
        {name: "compliance_value", label:"Value", allowed_value:"", show:true},
        {name: "compliance_unit", label:"Unit", allowed_value:"", show:true},
        {name: "measure_type", label:"Measure", allowed_value:"V,I", show:true},
        {name: "measure_min", label:"MIN", allowed_value:"", show:true},
        {name: "calculate", label:"Calculate", allowed_value:"", show:false}, // For calculation based on other measurements.
        {name: "measure_typ", label:"TYP", allowed_value:"", show:true},
        {name: "measure_max", label:"MAX", allowed_value:"", show:true},
        {name: "measure_unit", label:"Unit", allowed_value:"", show:true}
    ]
};